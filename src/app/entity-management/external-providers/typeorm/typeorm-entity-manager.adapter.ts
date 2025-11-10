import { DeepPartial, EntityManager, ObjectType, ObjectLiteral } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { IQueryBuilder } from '../../../query-building/interfaces/query-builder.interface';
import { IEntityManager } from '../../interfaces/entity-manager.interface';
import { Constructable } from '@common/base-types/constructable.type';

export class TypeORMEntityManager implements IEntityManager {
  constructor(private readonly entityManager: EntityManager) {}

  public createQueryBuilder<TEntity extends {}>(entityClass: Constructable<TEntity>, alias: string): IQueryBuilder<TEntity> {
    return <IQueryBuilder<TEntity>>(<unknown>this.entityManager.createQueryBuilder<TEntity>(entityClass, alias));
  }

  public create<TEntity>(entityClass: Constructable<TEntity>, plainObject?: Partial<TEntity>): TEntity {
    const objectType: ObjectType<TEntity> = entityClass;
    const deepPartial = <DeepPartial<TEntity>>(plainObject ?? {});
    return this.entityManager.create<TEntity, DeepPartial<TEntity>>(objectType, deepPartial);
  }

  public async update<TEntity extends {}>(entityClass: Constructable<TEntity>, entity: TEntity, plainObject?: Partial<TEntity>): Promise<TEntity> {
    if (!plainObject) return entity;
    const objectType: ObjectType<TEntity> = entityClass;
    const deepPartial = <QueryDeepPartialEntity<TEntity>>plainObject;
    const updateCriteria = this.getUpdateCriteria(objectType, entity);
    await this.entityManager.update(objectType, updateCriteria, deepPartial);
    Object.assign(entity, plainObject);
    return entity;
  }

  public getRawEntityManager(): EntityManager {
    return this.entityManager;
  }

  private getUpdateCriteria<TEntity extends {}>(objectType: ObjectType<TEntity>, entity: TEntity): ObjectLiteral | undefined {
    return this.entityManager.connection.getMetadata(objectType).getEntityIdMap(entity);
  }

  public async remove<TEntity>(entity: TEntity): Promise<TEntity> {
    const cachedEntity = { ...entity };
    await this.entityManager.remove(entity);
    return cachedEntity;
  }

  public async save<TEntity>(entity: TEntity): Promise<TEntity> {
    return await this.entityManager.save(entity);
  }

  public async saveMany<TEntity>(entities: TEntity[]): Promise<TEntity[]> {
    return await this.entityManager.save(entities);
  }
}
