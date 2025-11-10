import { MetadataManager } from './metadata-manager';

import { IEntityMetadataDecoratorArgs } from '../../entities/_common/metadata/decorators/entity-metadata.decorator';
import { FilterableFieldMetadata } from '@query-building/filtering/types/filterable-field-metadata.interface';

export enum MetadataType {
  Entity = 'Entity',
  FieldFilterable = 'FieldFilterable',
  FieldSortable = 'FieldSortable'
}

export interface IMetadata {
  [MetadataType.Entity]: IEntityMetadataDecoratorArgs;
  [MetadataType.FieldFilterable]: FilterableFieldMetadata;
  [MetadataType.FieldSortable]: { name: string };
}

export const metadataManager = new MetadataManager<IMetadata>();
