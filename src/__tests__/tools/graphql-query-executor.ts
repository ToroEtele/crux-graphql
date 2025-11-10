import { GraphQLSchema, FormattedExecutionResult } from 'graphql';
import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { NonEmptyArray } from 'type-graphql';

import { GraphQLBuildSchemaOptionsFactory } from '@app/bootstrapping/graphql-schema/graphqlBuildSchemaOptions.factory';
import { ApolloServerFactory } from '@app/bootstrapping/apollo-server/factory/apollo-server.factory';
import { GraphQLSchemaFactory } from '@app/bootstrapping/graphql-schema/graphqlSchema.factory';
import { databaseConnection } from '@app/bootstrapping/services/database-connection';
import { BootstrapService } from '@app/bootstrapping/bootstrap.service';

import { RequesterContext } from '@access-control/_common/requester-context';
import { IRequesterAuthContext, IRequesterContext } from '@interfaces/requester-context.interface';
import { resolveInSequence } from '@utils/resolve-in-sequence.util';
import { User } from '@entities/user/user.entity';

import { Environment } from '@config/constants/environment.enum';
import { config } from '@config/config.service';

import { TestResolver } from './test-resolver';
import { database } from '@entity-management/constants/databases/typeorm.config';
import { GraphLocale } from '@common/i18n/types';
import { RequestContext } from '@interfaces/extended-request.interface';
import { Subscription } from '@entities/subscription/subscription.entity';
export class GraphqlQueryExecutor {
  private readonly bootstrapService = new BootstrapService([databaseConnection]);
  private readonly apolloServer: ApolloServer<IRequesterContext>;

  constructor(
    private readonly resolvers: Function[] = [TestResolver],
    opts?: { withAccesscontrol?: boolean }
  ) {
    if (config.environment !== Environment.Testing) throw new Error('missing required NODE_ENV=testing');
    this.mockServices();
    this.apolloServer = new ApolloServerFactory({ schema: this.buildSchema(opts?.withAccesscontrol ?? true) }).build();
  }

  private buildSchema(withMiddleware: boolean): GraphQLSchema {
    const schemaOptions = new GraphQLBuildSchemaOptionsFactory().build();
    const factory = new GraphQLSchemaFactory({
      ...schemaOptions,
      resolvers: <NonEmptyArray<Function>>[...schemaOptions.resolvers, ...this.resolvers]
    });
    return factory.build();
  }

  public async runQuery(query: string, user: User, variables = {}, subscription?: Subscription): Promise<FormattedExecutionResult<any>> {
    const authContext = { user: { ...user }, subscription };

    const response = await this.apolloServer.executeOperation(
      { query, variables },
      {
        contextValue: new RequesterContext({ authContext })
      }
    );
    return GraphqlQueryExecutor.parseResponse(response);
  }

  public async runMutation(
    mutation: string,
    authContext: IRequesterAuthContext = {},
    variables = {},
    locale?: GraphLocale
  ): Promise<FormattedExecutionResult<any>> {
    const response = await this.apolloServer.executeOperation(
      { query: mutation, variables },
      {
        contextValue: this.createContext({
          authContext,
          locale
        })
      }
    );
    return GraphqlQueryExecutor.parseResponse(response);
  }

  private createContext(context: Pick<RequestContext, 'authContext' | 'locale'>): IRequesterContext {
    return new RequesterContext({
      ...context
    });
  }

  // private parseResponse({ body }: GraphQLResponse): FormattedExecutionResult {
  //   this.resetServices();
  //   if (body.kind === 'single') return { data: body.singleResult.data, errors: body.singleResult.errors };
  //   throw new NotImplementedError('GraphQLResponse.body.kind === "incremental"');
  // }

  public async reset(): Promise<void> {
    const tableNames = database.entityMetadatas.filter((entity) => entity.tableType !== 'view').map((entity) => entity.tableName);
    await database.transaction(async (entityManager) => {
      await entityManager.query('SET FOREIGN_KEY_CHECKS = 0;');
      await resolveInSequence(tableNames.map(async (tableName) => await entityManager.query(`DELETE FROM ${tableName}`)));
      await entityManager.query('SET FOREIGN_KEY_CHECKS = 1;');
    });
  }

  public async setup(): Promise<void> {
    await this.bootstrapService.bootstrap();
  }

  public async teardown(): Promise<void> {
    await this.bootstrapService.teardown();
  }

  private mockServices(): void {}

  private static parseResponse({ body }: GraphQLResponse): FormattedExecutionResult {
    if (body.kind === 'single') return { data: body.singleResult.data, errors: body.singleResult.errors };
    throw new Error('GraphQLResponse.body.kind === "incremental"');
  }
}
