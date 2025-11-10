import { camelCase } from 'lodash';

import { EntityNotFoundError } from '../../_common/errors/entity-not-found.error';
import { Constructable } from '@common/base-types/constructable.type';
import { PromiseMaybe } from '@common/base-types/maybe.type';

import { ConnectionFilter } from '@query-building/connection/filtering/interfaces/connection-filter.interface';
import { IBaseRepositoryMethodOptions } from '../interfaces/base-repository-method-options.interface.';
import { IConnectionArgs } from '@query-building/connection/interfaces/connection-args.interface';
import { IQueryBuilder } from '../../query-building/interfaces/query-builder.interface';
import { IEntityManager } from '@entity-management/interfaces/entity-manager.interface';
import { IBaseRepository } from '../interfaces/base-repository.interface';

import { TypeORMEntityManager } from '@entity-management/external-providers/typeorm/typeorm-entity-manager.adapter';
import { QueryService } from '@query-building/query.service';

export abstract class BaseRepository<TEntity extends {}> implements IBaseRepository<TEntity> {
  protected readonly alias;

  constructor(
    protected manager: TypeORMEntityManager,
    protected entityClass: Constructable<TEntity>
  ) {
    this.alias = camelCase(this.entityClass.name);
  }

  public async buildAndSave(entity: Partial<TEntity>, options: IBaseRepositoryMethodOptions = {}): Promise<TEntity> {
    return await this.save(this.build(entity, options), options);
  }

  public build(entity: Partial<TEntity> = {}, options: IBaseRepositoryMethodOptions = {}): TEntity {
    return this.getManager(options).create(this.entityClass, entity);
  }

  public save(entity: TEntity, options: IBaseRepositoryMethodOptions = {}): Promise<TEntity> {
    return this.getManager(options).save(entity);
  }

  public async findOneOrThrow(id?: number | string, options: IBaseRepositoryMethodOptions = {}): Promise<TEntity> {
    const entity = await this.findOne(id, options);
    if (!entity) throw new EntityNotFoundError(this.entityClass.name);
    return entity;
  }

  public findOne(id?: number | string, options: IBaseRepositoryMethodOptions = {}): PromiseMaybe<TEntity> {
    const queryBuilder =
      typeof id === 'undefined' ? this.createQueryBuilder(options) : this.createQueryBuilder(options).where(<ConnectionFilter>{ id: { eq: id } });
    return queryBuilder.getOne();
  }

  public createQueryService(args: IConnectionArgs<TEntity>, options: IBaseRepositoryMethodOptions = {}): QueryService<TEntity> {
    const query = this.createQueryBuilder(options);
    return this.createFilteredQueryServiceFromQuery(query, args);
  }

  public createFilteredQueryService(
    args: IConnectionArgs<TEntity>,
    scope: ConnectionFilter<TEntity>,
    options: IBaseRepositoryMethodOptions = {}
  ): QueryService<TEntity> {
    const query = this.createQueryBuilder(options);
    return this.createFilteredQueryServiceFromQuery(query, args, scope);
  }

  public createFilteredQueryServiceFromQuery(
    query: IQueryBuilder<TEntity>,
    { filter, orderBy }: IConnectionArgs<TEntity>,
    scope?: ConnectionFilter<TEntity>
  ): QueryService<TEntity> {
    const queryService = new QueryService(query).applyFilter(filter).applySorting(orderBy);
    if (scope) query.andWhere(scope);
    return queryService;
  }

  public abstract createQueryBuilder(options?: IBaseRepositoryMethodOptions): IQueryBuilder<TEntity>;

  public remove(entity: TEntity, options: IBaseRepositoryMethodOptions = {}): Promise<TEntity> {
    return this.getManager(options).remove(entity);
  }

  public async update(entity: TEntity, updateParams: Partial<TEntity>, options: IBaseRepositoryMethodOptions = {}): Promise<TEntity> {
    await this.getManager(options).update(this.entityClass, entity, updateParams);
    return {
      ...entity,
      ...updateParams
    };
  }

  protected getManager(options: IBaseRepositoryMethodOptions = {}): IEntityManager {
    return options.transactionalEntityManager ?? this.manager;
  }
}
