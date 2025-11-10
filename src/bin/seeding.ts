import Container from 'typedi';

import { join, resolve } from 'node:path';
import { DataSource } from 'typeorm';

import { database } from '@entity-management/constants/databases/typeorm.config';

import { SeedingService } from '../app/seeding/seeding.service';
import { LogService } from '../app/_common/logging/log.service';

const logService = Container.get(LogService);

let databaseConnection: DataSource;

const exit = async (error?: Error): Promise<never> => {
  await databaseConnection?.destroy();
  if (error) logService.error(error, `An error has occurred when running seeding: ${error.message}`);
  process.exit(error ? 1 : 0);
};

(async () => {
  databaseConnection = await database.initialize();

  await new SeedingService(resolve(join(__dirname, '../db/seedings/')), databaseConnection.createEntityManager()).run();

  await exit();
})().catch(exit);
