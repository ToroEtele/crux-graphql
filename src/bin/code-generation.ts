import { join } from 'node:path';

import { FileSystemService } from '@utils/storage-system/external-providers/file-system/file-system.service';
import { IStorageSystem } from '@utils/storage-system/interfaces/storage-system.interface';
import { EntityLoader } from '@entities/_common/entity-loader.service';

import { EnumConnectionFiltersGenerator } from '@query-building/connection/filtering/code-generation/enum-connection-filters.generator';
import { ConnectionFiltersGenerator } from '@query-building/connection/filtering/code-generation/connection-filters.generator';
import { AllEntitiesGenerator } from '@entities/_common/metadata/code-generation/all-entities.generator';
import { ConnectionGenerator } from '@query-building/connection/code-generation/connection.generator';
import { OrderInputGenerator } from '@query-building/sorting/code-generation/order-input.generator';
import { OrderFieldGenerator } from '@query-building/sorting/code-generation/order-field.generator';
import { ResolverGenerator } from '@entity-management/code-generation/resolver.generator';

(async () => {
  await EntityLoader.loadAll();

  const entitiesGenerators = [
    async (storage: IStorageSystem) => {
      await new AllEntitiesGenerator(storage).run();
    },
    async (storage: IStorageSystem) => {
      await new OrderFieldGenerator(storage).run();
    },
    async (storage: IStorageSystem) => {
      await new OrderInputGenerator(storage).run();
    },
    async (storage: IStorageSystem) => {
      await new ConnectionFiltersGenerator(storage).run();
    },
    async (storage: IStorageSystem) => {
      await new ConnectionGenerator(storage).run();
    },
    async (storage: IStorageSystem) => {
      await new ResolverGenerator(storage).run();
    },
    async (storage: IStorageSystem) => {
      await new EnumConnectionFiltersGenerator(storage).run();
    }
  ];
  const entitiesGeneratedPath = join(__dirname, '../app/entities/_generated/');
  const entitiesStorage = new FileSystemService(entitiesGeneratedPath).touch();

  for (const generator of entitiesGenerators) {
    await generator(entitiesStorage).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    });
  }
  process.exit(0);
})().catch((error) => {
  //   logService.error(error, `An error has occurred when generating code: ${error.message}`);
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
