import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { SqlQueryBuilder } from '../../../query-building/external-providers/sql/sql-query-builder';

import { TypeORMEntityManager } from './typeorm-entity-manager.adapter';
import { BaseRepository } from '@entity-management/base-types/base.repository';
import { Constructable } from '@common/base-types/constructable.type';
import { IBaseSqlRepositoryMethodOptions } from './interfaces/base-sql-repository-method-options.interface';

export class BaseSqlRepository<TEntity extends {}> extends BaseRepository<TEntity> {
  constructor(
    protected override manager: TypeORMEntityManager,
    protected override entityClass: Constructable<TEntity>
  ) {
    super(manager, entityClass);
  }

  public createQueryBuilder(options: IBaseSqlRepositoryMethodOptions = {}): SqlQueryBuilder<TEntity> {
    const queryBuilder = <unknown>this.getManager(options).createQueryBuilder(this.entityClass, this.alias);
    return new SqlQueryBuilder<TEntity>(this.entityClass, <SelectQueryBuilder<TEntity>>queryBuilder);
  }

  public override async save(entity: TEntity, options: IBaseSqlRepositoryMethodOptions = {}): Promise<TEntity> {
    try {
      return await super.save(entity, options);
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') throw new Error(e.message);
      throw e;
    }
  }

  public override async update(entity: TEntity, updateParams: Partial<TEntity>, options: IBaseSqlRepositoryMethodOptions = {}): Promise<TEntity> {
    try {
      return await this.getManager(options).update(this.entityClass, entity, updateParams);
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') throw new Error(e.message);
      throw e;
    }
  }

  public async increment(entity: TEntity, path: keyof TEntity, value: number): Promise<void> {
    await this.getRawEntityManager().increment(this.entityClass, entity, path.toString(), value);
  }

  public async remove(entity: TEntity, options: IBaseSqlRepositoryMethodOptions = {}): Promise<TEntity> {
    try {
      return await this.getManager(options).remove(entity);
    } catch (error: any) {
      if (typeof error.code === 'string' && error.code.startsWith('ER_ROW_IS_REFERENCED')) {
        throw new Error('Entity is referenced');
      }
      throw error;
    }
  }

  protected getRawEntityManager(options: IBaseSqlRepositoryMethodOptions = {}): EntityManager {
    return options.transactionalEntityManager ? options.transactionalEntityManager.getRawEntityManager() : this.manager.getRawEntityManager();
  }
}
