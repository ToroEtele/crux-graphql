import { EnumConfig } from 'type-graphql/build/typings/decorators/types';
import { registerEnumType } from 'type-graphql';
import { Container } from 'typedi';

import { EnumsMetadataService } from '../../../query-building/filtering/services/enum-metadata.service';
import { IEnumFilterData } from '../../../query-building/filtering/types/enum-filter-data.interface';

export function registerGraphQLEnum<TEnum extends object>(
  enumObj: TEnum,
  enumConfig: EnumConfig<TEnum> & {
    filterTypeOptions?: Pick<IEnumFilterData, 'filePath' | 'name'>;
  }
): void {
  registerEnumType(enumObj, enumConfig);

  if (enumConfig.filterTypeOptions) {
    Container.get(EnumsMetadataService).register({
      schemaName: enumConfig.name,
      name: enumConfig.filterTypeOptions.name ?? enumConfig.name,
      filePath: enumConfig.filterTypeOptions.filePath
    });
  }
}
