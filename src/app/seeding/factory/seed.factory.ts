import Container from 'typedi';

import { LogService } from '@logging/log.service';

import { SeedFactoryArgs } from '../interfaces/seed-factory-args.interface';

export class SeedFactory<TEntity> {
  private readonly logService = Container.get(LogService);

  constructor(public args: SeedFactoryArgs<TEntity>) {}

  public async run(): Promise<void> {
    console.log(`Seeding ${this.args.name}...`);
    this.logService.info(`Seeding ${this.args.name}...`);

    if (this.args.customSave) {
      await this.args.customSave(this.args.data);
      return;
    }

    const entities = this.args.entityManager.create(this.args.entityClass, this.args.data);

    try {
      await this.args.entityManager.save(this.args.entityClass, entities);
    } catch (e) {
      console.error(e);
    }
  }
}
