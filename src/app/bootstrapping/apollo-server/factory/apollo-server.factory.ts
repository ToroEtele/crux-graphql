import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';

import type { ApolloServerOptions, BaseContext } from '@apollo/server';
import type { Server } from 'http';

import type IApolloServerFactoryArgs from '../interfaces/apollo-server-factoryArgs.interface';
import type { IRequesterContext } from '../../../_common/interfaces/requester-context.interface';

export class ApolloServerFactory {
  private readonly schema;

  private readonly httpServer?: Server;

  constructor(private readonly args: IApolloServerFactoryArgs) {
    this.httpServer = args.httpServer;
    this.schema = this.args.schema;
  }

  public build(config = this.config): ApolloServer<IRequesterContext> {
    return new ApolloServer(config);
  }

  public get config(): ApolloServerOptions<IRequesterContext> {
    const schema = this.schema;
    return {
      schema,
      apollo: this.getApolloConfig(),
      csrfPrevention: false,
      plugins: [...(this.httpServer ? [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })] : [])]
    };
  }

  private getApolloConfig(): ApolloServerOptions<BaseContext>['apollo'] {
    // const { apolloEngineApiKey, graphRef } = config;
    // if (apolloEngineApiKey) return { key: apolloEngineApiKey, graphRef };
    return {};
  }
}
