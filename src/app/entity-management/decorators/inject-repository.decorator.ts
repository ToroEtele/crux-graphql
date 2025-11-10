import Container from 'typedi';

import { Constructable } from '@common/base-types/constructable.type';

import { Entity } from '../../entities/_generated/constants/entities-list.constant';
import { ReflectService } from '@app/reflection/reflect.service';
import { DatabaseUtil } from '../utils/database.util';

export function InjectRepository(entity: Constructable<Entity>): ParameterDecorator & PropertyDecorator {
  return (object: any, propertyKey: string | symbol | undefined, index?: number): void => {
    const repositoryFactory = DatabaseUtil.getRepositoryFactory(entity);
    const repositoryType = ReflectService.getType({ index, propertyKey, target: object });
    Container.registerHandler({
      index,
      object,
      ...(propertyKey && { propertyName: propertyKey.toString() }),
      value: () => repositoryFactory(entity, repositoryType)
    });
  };
}
