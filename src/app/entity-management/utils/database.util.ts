import { Constructable } from '@common/base-types/constructable.type';

import { BaseRepository } from '@entity-management/base-types/base.repository';
import { RepositoryFactory } from '@entity-management/base-types/repository-factory.type';
import { database } from '../constants/databases/typeorm.config';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseUtil {
  public static getRepository<TEntity extends {}>(entity: Constructable<TEntity>): BaseRepository<TEntity> {
    const repositoryFactory = this.getRepositoryFactory<TEntity>(entity);
    const repository = repositoryFactory(entity);
    if (repository instanceof BaseRepository) return repository;
    throw new Error(`Repository for ${entity.name} isn't of BaseRepository instance`);
  }

  public static getRepositoryFactory<TEntity extends {}>(entity: Constructable<TEntity>): RepositoryFactory {
    return (entity) => database.getRepository(entity);
  }
}
