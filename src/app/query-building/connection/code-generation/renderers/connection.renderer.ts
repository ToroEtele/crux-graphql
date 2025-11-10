import { join as pathJoin } from 'node:path';

import pluralize from 'pluralize';

import { TypescriptRenderer } from '../../../../code-generation/base-types/typescript-renderer.base';
import { metadataManager, MetadataType } from '@common/metadata';
import { kebabCase } from 'lodash';

interface IConnectionRendererData {
  flag?: string;
  isFilterable: boolean;
  isSortable: boolean;
  name: string;
  names: string;
  pathName: string;
}

export class ConnectionRenderer extends TypescriptRenderer<IConnectionRendererData> {
  constructor(private readonly entityKlass: Function) {
    super(pathJoin(__dirname, '../constants/entity-connection.ejs'));
  }

  protected get templateData(): IConnectionRendererData {
    const klassName = this.entityKlass.name;

    return {
      isFilterable: metadataManager.getClassPropertiesWithMetadataType(this.entityKlass, MetadataType.FieldFilterable).length > 0,
      isSortable: metadataManager.getClassPropertiesWithMetadataType(this.entityKlass, MetadataType.FieldSortable).length > 0,
      name: klassName,
      names: pluralize(klassName),
      pathName: kebabCase(klassName)
    };
  }
}
