import { DataSource } from 'typeorm';

import { mysqlEntities } from '@entities/_generated/constants/entities-list.constant';
import { config } from '@config/config.service';

import migrations from '../../../../db/migrations';

export const database = new DataSource({
  type: 'mysql',
  url: config.databaseUrl,
  synchronize: false,
  entities: mysqlEntities,
  migrationsTableName: 'migrations',
  migrationsRun: false,
  migrations,
  legacySpatialSupport: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  extra: {
    decimalNumbers: true
  }
});
