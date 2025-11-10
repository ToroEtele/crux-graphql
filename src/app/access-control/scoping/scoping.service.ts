import { Service } from 'typedi';

import { ConnectionFilter } from '@query-building/connection/filtering/interfaces/connection-filter.interface';
import { IQueryBuilder } from '@query-building/interfaces/query-builder.interface';
import { IRequesterAuthContext } from '@interfaces/requester-context.interface';
import { ScopingFunction } from './types/scoping-function.type';
import { PromiseMaybe } from '@common/base-types/maybe.type';

import { isSystemAdmin } from '@access-control/authentication/auth-checker';
import { DatabaseUtil } from '@entity-management/utils/database.util';
import { Constructable } from '@common/base-types/constructable.type';

import { defaultQueryScopeMappings } from './mappings/query-scopes.mapping';
import { defaultScopeMappings } from './mappings/default-scopes.mapping';

import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { EntityNotFoundError } from '@errors/entity-not-found.error';

type ScopingFunctionMap = Map<Constructable<any>, ScopingFunction<any>>;

@Service()
export class ScopingService {
  private readonly isSystemAdmin = isSystemAdmin;
  private readonly databaseUtil = DatabaseUtil;

  public async fetchOrThrow<TEntity extends {}>(
    authContext: IRequesterAuthContext,
    entityClass: Constructable<TEntity>,
    id: number | string
  ): Promise<TEntity> {
    const entity = await this.fetch(authContext, entityClass, id);
    if (!entity) throw new EntityNotFoundError(entityClass.name);
    return entity;
  }

  public createScopedQuery<TEntity extends {}>(authContext: IRequesterAuthContext, entityClass: Constructable<TEntity>): IQueryBuilder<TEntity> {
    if (authContext.user) {
      const scopeMap = this.getQueryScopeMap(authContext);
      return this.getScopedQuery(authContext, entityClass, scopeMap);
    }
    throw new UnauthenticatedError();
  }

  public async fetch<TEntity extends {}>(authContext: IRequesterAuthContext, entityClass: Constructable<TEntity>, id: number | string): PromiseMaybe<TEntity> {
    if (authContext.user) {
      const scopeMap = this.getQueryScopeMap(authContext);
      return this.findOneScoped(authContext, entityClass, id, scopeMap);
    }
    throw new UnauthenticatedError();
  }

  private getQueryScopeMap(authContext: IRequesterAuthContext): ScopingFunctionMap {
    if (authContext.user) {
      return defaultQueryScopeMappings;
    }
    throw new UnauthenticatedError();
  }

  private async findOneScoped<TEntity extends {}>(
    authContext: IRequesterAuthContext,
    entityClass: Constructable<TEntity>,
    id: number | string,
    scopingMap: ScopingFunctionMap
  ): PromiseMaybe<TEntity> {
    const query = this.getScopedQuery(authContext, entityClass, scopingMap);
    return query.andWhere(<ConnectionFilter>{ id: { eq: id } }).getOne();
  }

  private getScopedQuery<TEntity extends {}>(
    authContext: IRequesterAuthContext,
    entityClass: Constructable<TEntity>,
    scopingMap: ScopingFunctionMap
  ): IQueryBuilder<TEntity> {
    const query = this.getQuery(entityClass, authContext);
    if (this.isSystemAdmin(authContext)) return query;
    const scopingFunction = scopingMap.get(entityClass);
    if (!scopingFunction) throw new Error('Missing query scopes for Entity');
    return scopingFunction(query, authContext);
  }

  private getQuery<TEntity extends {}>(entityClass: Constructable<TEntity>, authContext: IRequesterAuthContext): IQueryBuilder<TEntity> {
    const queryBuilder = this.databaseUtil.getRepository(entityClass).createQueryBuilder();
    const defaultQueryScope = defaultScopeMappings.get(entityClass);
    if (defaultQueryScope) {
      defaultQueryScope(queryBuilder, authContext);
    }
    return queryBuilder;
  }
}
