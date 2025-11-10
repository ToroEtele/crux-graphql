import { BaseGenerator } from '../../code-generation/base-types/generator.base';

import { IStorageSystem } from '@utils/storage-system/interfaces/storage-system.interface';
import { metadataManager, MetadataType } from '@common/metadata';
import { ResolverRenderer } from './renderers/resolver.renderer';
import { kebabCase } from 'lodash';

export class ResolverGenerator extends BaseGenerator {
  constructor(storage: IStorageSystem) {
    super({ storage, renderer: ResolverRenderer, directory: 'entity-base-resolvers' });
  }

  public async run(): Promise<void> {
    await Promise.all(
      metadataManager.getClassesWithMetadataType(MetadataType.Entity).map(async (entityKlass) => {
        const fileName = `${kebabCase(entityKlass.name)}.base-resolver.ts`;
        // eslint-disable-next-line new-cap
        this.storage.write(fileName, await new this.renderer(entityKlass).render());
      })
    );
  }
}
