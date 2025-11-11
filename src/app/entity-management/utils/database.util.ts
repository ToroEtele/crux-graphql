import { Constructable } from '@common/base-types/constructable.type';

import { BaseRepository } from '@entity-management/base-types/base.repository';
import { RepositoryFactory } from '@entity-management/base-types/repository-factory.type';
import { database } from '../constants/databases/typeorm.config';
import { BaseSqlRepository } from '../external-providers/typeorm/base-sql.repository';
import { TypeORMEntityManager } from '../external-providers/typeorm/typeorm-entity-manager.adapter';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseUtil {
  public static getRepository<TEntity extends {}>(entity: Constructable<TEntity>): BaseRepository<TEntity> {
    const repositoryFactory = this.getRepositoryFactory();
    const repository = repositoryFactory(entity);
    if (repository instanceof BaseRepository) return repository;
    throw new Error(`Repository for ${entity.name} isn't of BaseRepository instance`);
  }

  public static getRepositoryFactory(): RepositoryFactory {
    return this.getTypeOrmRepositoryFactory();
  }

  private static getTypeOrmRepositoryFactory(): RepositoryFactory {
    return (entity, repositoryType) => {
      if (repositoryType) {
        if (repositoryType.name === 'Repository') return database.getRepository(entity);
        if (repositoryType.name !== 'BaseSqlRepository') {
          // eslint-disable-next-line new-cap
          return new repositoryType(database.manager);
        }
      }
      return new BaseSqlRepository(new TypeORMEntityManager(database.manager), entity);
    };
  }
}
