import { metadataManager, MetadataType } from '@common/metadata';
import { IStorageSystem } from '../../../_common/utils/storage-system/interfaces/storage-system.interface';
import { BaseGenerator } from '../../../code-generation/base-types/generator.base';

import { ConnectionRenderer } from './renderers/connection.renderer';
import { kebabCase } from 'lodash';

export class ConnectionGenerator extends BaseGenerator {
  constructor(storage: IStorageSystem) {
    super({ storage, renderer: ConnectionRenderer, directory: 'entity-connections' });
  }

  public async run(): Promise<void> {
    await Promise.all(
      metadataManager.getClassesWithMetadataType(MetadataType.Entity).map(async (entityKlass) => {
        const fileName = `${kebabCase(entityKlass.name)}.connection.ts`;
        // eslint-disable-next-line new-cap
        this.storage.write(fileName, await new this.renderer(entityKlass).render());
      })
    );
  }
}
