/* eslint-disable @typescript-eslint/no-unused-vars */
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

import { GraphQLFieldConfig, GraphQLObjectTypeConfig, GraphQLResolveInfo } from 'graphql';
import { extractFieldConfig, extractParentTypeConfig } from './helpers/config.extractors';
import { IRequesterContext } from '@common/interfaces/requester-context.interface';

interface LoggerConfig {
  logMessage?: string;
  level?: number;
}

const extractLoggerExtensionsFromConfig = (config: GraphQLObjectTypeConfig<any, any> | GraphQLFieldConfig<any, any>): LoggerConfig =>
  (config.extensions && (config.extensions as LoggerConfig)) || {};

const getLoggerExtensions = (info: GraphQLResolveInfo): LoggerConfig => {
  const fieldConfig = extractFieldConfig(info);
  const fieldLoggerExtensions = extractLoggerExtensionsFromConfig(fieldConfig);

  const parentConfig = extractParentTypeConfig(info);
  const parentLoggerExtensions = extractLoggerExtensionsFromConfig(parentConfig);

  return {
    ...parentLoggerExtensions,
    ...fieldLoggerExtensions
  };
};

@Service()
export class LoggerMiddleware implements MiddlewareInterface<IRequesterContext> {
  // constructor(private readonly logger: LogService) {}

  async use(
    {
      context: {
        authContext: { user }
      },
      info
    }: ResolverData<IRequesterContext>,
    next: NextFn
  ): Promise<void> {
    // const { logMessage, level = 6 } = getLoggerExtensions(info);
    // const caller = user ? `(userId: ${user.id})` : '';

    // if (logMessage) {
    //   if (level === 5) this.logger.silly(logMessage);
    //   if (level === 4) this.logger.debug(`${logMessage} ${caller}`);
    //   if (level === 3) this.logger.http(logMessage);
    //   if (level === 2) this.logger.info(logMessage);
    //   if (level === 1) this.logger.warn(logMessage);
    //   if (level === 0) this.logger.error(logMessage);
    // }

    return await next();
  }
}
