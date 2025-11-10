import { IEntityMetadataDecoratorArgs } from '@entities/_common/metadata/decorators/entity-metadata.decorator';

export type EntityDecoratorArgs = IEntityMetadataDecoratorArgs & {
  tableName?: string;
  isView?: boolean;
  discriminatorValue?: boolean | string;
};
