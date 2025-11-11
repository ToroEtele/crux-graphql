/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { json } from 'body-parser';
import express from 'express';
import cors from 'cors';

import type { ApolloServer } from '@apollo/server';
import type { GraphQLSchema } from 'graphql';
import type { Express } from 'express';
import type { Server } from 'http';

import { ApolloServerFactory } from '../apollo-server/factory/apollo-server.factory';
import { GraphQLSchemaFactory } from '../graphql-schema/graphqlSchema.factory';
import { config } from '../../_common/config/config.service';

import type { IBootstrapableService } from '../../_common/interfaces/bootstrapable.interface';
import type { IRequesterContext } from '../../_common/interfaces/requester-context.interface';

import { RequestLoggerMiddleware } from '@common/logging/middleware/request-logger.middleware';
import { AuthMiddleware } from '@access-control/authentication/middlewares/auth-middleware';
import { RequestContext } from '@common/interfaces/extended-request.interface';
import { nonNullable } from '@common/utils/non-nullable.util';
import { AvatarImageController } from '@entities/avatar-image/avatar-image.controller';

interface IWebserverServiceArgs {
  hostname: string;
  port: number;
  enableSchemaTransformations?: boolean;
}

export class WebserverService implements IBootstrapableService {
  public url?: string;
  private server?: Server;
  private apolloServer?: ApolloServer<IRequesterContext>;
  private httpServer?: Server;
  protected hostname: string;
  protected port: number;
  private app!: Express;
  private readonly graphqlPath = config.graphqlPath;

  constructor(private readonly args: IWebserverServiceArgs) {
    this.hostname = args.hostname;
    this.port = args.port;
  }

  public getApp(): Express {
    const app = express();
    app
      .set('trust proxy', true)
      .disable('x-powered-by')
      .set('etag', false)
      .use(
        cors<cors.CorsRequest>((req, callback) => {
          const origins = config.origins;
          if (req.headers.origin !== undefined && origins.includes(req.headers.origin)) {
            callback(null, {
              origin: req.headers.origin,
              credentials: true
            });
          } else {
            callback(null);
          }
        })
      )
      .use(cookieParser())
      .use(RequestLoggerMiddleware);

    app.use(AuthMiddleware);

    app.use(json());
    AvatarImageController.use(app);

    return app;
  }

  public async bootstrap(): Promise<void> {
    this.app = this.getApp();

    this.httpServer = this.getHttpServer();

    this.server = await this.bootstrapServer();
    this.apolloServer = this.getApolloServer();

    await this.apolloServer.start();

    this.app.use(
      this.graphqlPath,
      expressMiddleware<IRequesterContext>(this.apolloServer, {
        context: (ctx: { req: RequestContext }) => Promise.resolve(nonNullable(ctx.req.requesterContext))
      })
    );
  }

  private async bootstrapServer(): Promise<Server> {
    return await new Promise((resolve, reject) => {
      const server = this.getHttpServer()
        .on('connection', (socket) => {
          socket.setTimeout(300 * 1000);
        })
        .listen({ port: this.port, hostname: this.hostname }, () => {
          this.url = `http://${this.hostname}:${this.port}`;
          console.log(`🚀  Server ready at ${this.url}${config.graphqlPath}`);
          resolve(server);
        })
        .once('error', (err) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`❌  ${err.message}`);
        });
    });
  }

  private getApolloServer(): ApolloServer<IRequesterContext> {
    const schema = this.getSchema();

    return new ApolloServerFactory({
      schema,
      enableSchemaTransformations: this.args.enableSchemaTransformations,
      httpServer: this.getHttpServer()
    }).build();
  }

  private getHttpServer(): Server {
    return this.httpServer ? this.httpServer : createServer(this.app);
  }

  protected getSchema(): GraphQLSchema {
    return new GraphQLSchemaFactory().build();
  }

  public async teardown(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this.server) return resolve();
      this.server.close((err) => (err ? reject(err) : resolve(err)));
    });

    await this.apolloServer?.stop();

    this.server = undefined;
    this.url = undefined;
    this.apolloServer = undefined;
    this.httpServer = undefined;
  }
}

export const webserver = new WebserverService({
  hostname: config.hostname,
  port: config.port
});
