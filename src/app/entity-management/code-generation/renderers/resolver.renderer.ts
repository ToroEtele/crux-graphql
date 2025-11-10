import { join as pathJoin } from 'node:path';
import { kebabCase } from 'lodash';
import pluralize from 'pluralize';

import { metadataManager, MetadataType } from '@common/metadata';

import { TypescriptRenderer } from '../../../code-generation/base-types/typescript-renderer.base';

interface IResolverRendererData {
  admin: boolean;
  name: string;
  names: string;
  pathName: string;
  skipId: boolean;
}

export class ResolverRenderer extends TypescriptRenderer<IResolverRendererData> {
  constructor(private readonly entityKlass: Function) {
    super(pathJoin(__dirname, '../constants/entity-base-resolver.ejs'));
  }

  protected get templateData(): IResolverRendererData {
    const metadata = metadataManager.fetchClassMetadata(this.entityKlass, MetadataType.Entity);
    const klassName = this.entityKlass.name;

    return {
      admin: metadata.admin ?? false,
      name: klassName,
      names: pluralize(klassName),
      pathName: kebabCase(klassName).toLocaleLowerCase(),
      skipId: metadata.skipId ?? false
    };
  }
}
