import { join as pathJoin } from 'node:path';
import { kebabCase } from 'lodash';

import { TypescriptRenderer } from '@app/code-generation/base-types/typescript-renderer.base';
import { metadataManager, MetadataType } from '@common/metadata';

interface IAllEntitiesRendererData {
  abstractEntities: Function[];
  allEntities: Array<{ name: string; path: string }>;
  nonAbstractEntities: Function[];
  nonRetrievableEntities: Function[];
  retrievableEntities: Function[];
}

export class AllEntitiesRenderer extends TypescriptRenderer<IAllEntitiesRendererData> {
  constructor() {
    super(pathJoin(__dirname, '../constants/all-entities.ejs'));
  }

  protected get templateData(): IAllEntitiesRendererData {
    const entities = metadataManager.getClassesWithMetadataType(MetadataType.Entity);
    const allEntities = new Array<{ name: string; path: string }>();
    const abstractEntities = new Array<Function>();
    const nonAbstractEntities = new Array<Function>();
    const nonRetrievableEntities = new Array<Function>();
    const retrievableEntities = new Array<Function>();

    entities.forEach((entityKlass) => {
      const { abstract, path, retrievable } = metadataManager.fetchClassMetadata(entityKlass, MetadataType.Entity);

      allEntities.push({ name: entityKlass.name, path: path ?? kebabCase(entityKlass.name) });
      abstract ? abstractEntities.push(entityKlass) : nonAbstractEntities.push(entityKlass);
      if (retrievable && !abstract) retrievableEntities.push(entityKlass);
      if (!(retrievable || abstract)) nonRetrievableEntities.push(entityKlass);
    });

    return {
      allEntities,
      nonAbstractEntities,
      abstractEntities,
      nonRetrievableEntities,
      retrievableEntities
    };
  }
}
