import { ColumnOptions } from 'typeorm';

import { BaseClassDecorator } from '@common/base-types/decorators/base-class.decorator';
import { Constructable } from '@common/base-types/constructable.type';

import { metadataManager, MetadataType } from '@common/metadata';

interface IRetrievable {
  retrievable?: true;
  abstract?: false;
}

interface IAbstract {
  retrievable?: false;
  abstract?: true;
}

export type IEntityMetadataDecoratorArgs = {
  /**
   * Entity name. If differs from class name.
   */
  name?: string;
  /**
   * Used when Entity does not have primary key `id` column.
   *
   * @default false
   */
  skipId?: boolean;
  /**
   * Used when generated id and rawID fields should be admin-only.
   * Ignored when skipId is true.
   *
   * @default false
   */
  admin?: boolean;
  implements?: Constructable<unknown>;
  discriminatorColumn?: ColumnOptions | string;
  /** instead of kebab(entity) you can tell file name */
  path?: string;
} & (IAbstract | IRetrievable);

class EntityMetadataDecorator implements BaseClassDecorator {
  constructor(private readonly args?: IEntityMetadataDecoratorArgs) {}

  public getDecorator(): ClassDecorator {
    return (targetConstructor) => {
      metadataManager.setClassMetadata(targetConstructor, MetadataType.Entity, {
        ...this.args
      });

      if (this.args?.implements) {
        this.copyParentFieldMetadata(targetConstructor, this.args.implements, MetadataType.FieldFilterable);
        this.copyParentFieldMetadata(targetConstructor, this.args.implements, MetadataType.FieldSortable);
      }
    };
  }

  private copyParentFieldMetadata(target: Function, parentKlass: Function, metadataType: MetadataType): void {
    metadataManager.getClassPropertiesWithMetadataType(parentKlass, metadataType).forEach((propertyKey) => {
      metadataManager.fetchPropertyMetadata(parentKlass, propertyKey, metadataType).forEach((metadata) => {
        metadataManager.setPropertyMetadata(target, propertyKey, metadataType, metadata);
      });
    });
  }
}

export const GenericEntity = (args?: IEntityMetadataDecoratorArgs): ClassDecorator => new EntityMetadataDecorator(args).getDecorator();
