/* eslint-disable new-cap */
import { relative as relativePath } from 'node:path';

import Container from 'typedi';

import { IStorageSystem } from '../../../../_common/utils/storage-system/interfaces/storage-system.interface';
import { BaseGenerator } from '../../../../code-generation/base-types/generator.base';
import { EnumsMetadataService } from '../../../filtering/services/enum-metadata.service';

import { EnumConnectionFiltersRenderer } from './renderers/enum-connection-filters.renderer';
import { kebabCase } from 'lodash';

export class EnumConnectionFiltersGenerator extends BaseGenerator {
  constructor(storage: IStorageSystem) {
    super({ storage, renderer: EnumConnectionFiltersRenderer, directory: 'connection-filters' });
  }

  public async run(): Promise<void> {
    const { enums } = Container.get(EnumsMetadataService);
    await Promise.all(
      enums.map(async ({ name, schemaName, filePath }) => {
        const fileName = `connection-${kebabCase(schemaName)}-filter.input-type.ts`;
        const relativeFilePath = relativePath('app/entities/_generated/connection-filters', filePath);

        this.storage.write(fileName, await new this.renderer(name, schemaName, relativeFilePath.replace(/\\/g, '/')).render());
      })
    );
  }
}
