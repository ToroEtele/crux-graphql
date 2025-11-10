import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { isEmpty } from 'lodash';

import { Constructable } from '../../../_common/base-types/constructable.type';
import { ConnectionFilter } from '../../connection/filtering/interfaces/connection-filter.interface';
import { IQueryBuilder } from '../../interfaces/query-builder.interface';
import { OrderDirection } from '../../sorting/constants/order-direction.enum';

import { SqlConditionsService } from './services/sql-conditions.service';

export class SqlQueryBuilder<TEntity extends {}> implements IQueryBuilder<TEntity> {
  private readonly metadata;
  private readonly conditionsService;

  constructor(
    private readonly entityClass: Constructable<TEntity>,
    public readonly builder: SelectQueryBuilder<TEntity>
  ) {
    this.metadata = this.builder.connection.getMetadata(this.entityClass);
    this.conditionsService = new SqlConditionsService(this.entityClass, this.builder);
  }

  public andWhere(filter: ConnectionFilter<TEntity>): this {
    const normalizedFilter = this.conditionsService.normalizeFilter(filter);
    if (isEmpty(normalizedFilter)) return this;
    const expressionMethod = this.builder.expressionMap.wheres.length > 0 ? this.builder.andWhere.bind(this.builder) : this.builder.where.bind(this.builder);
    expressionMethod(
      new Brackets((queryBuilder) => {
        this.conditionsService.applyFilter(queryBuilder, normalizedFilter);
      })
    );
    return this;
  }

  public orWhere(filter: ConnectionFilter<TEntity>): this {
    const normalizedFilter = this.conditionsService.normalizeFilter(filter);
    if (isEmpty(normalizedFilter)) return this;
    this.builder.orWhere(
      new Brackets((queryBuilder) => {
        this.conditionsService.applyFilter(queryBuilder, normalizedFilter);
      })
    );
    return this;
  }

  public take(limit?: number): this {
    this.builder.limit(limit);
    return this;
  }

  public skip(offset?: number): this {
    this.builder.offset(offset);
    return this;
  }

  public where(filter: ConnectionFilter<TEntity>): this {
    this.conditionsService.applyFilter(this.builder, filter);
    return this;
  }

  public async getOne(): Promise<TEntity | null> {
    return await this.builder.take(1).getOne();
  }

  public async getMany(): Promise<TEntity[]> {
    return await this.builder.getMany();
  }

  public getSql(): string {
    return this.builder.getSql();
  }

  public async getManyAndCount(): Promise<[TEntity[], number]> {
    return await this.builder.getManyAndCount();
  }

  public async getCount(): Promise<number> {
    return await this.builder.getCount();
  }

  public innerJoin(tableName: string, alias: string, condition?: string, parameters?: ObjectLiteral): this {
    this.builder.innerJoin(tableName, alias, condition, parameters);
    return this;
  }

  public leftJoinAndSelect(tableName: string, alias: string): this {
    this.builder.leftJoinAndSelect(tableName, alias);
    return this;
  }

  public select(selectionString: string, selectionAlias: string): this {
    this.builder.select(selectionString, selectionAlias);
    return this;
  }

  public getRawOne(): Promise<any> {
    return this.builder.getRawOne();
  }

  public limit(limit?: number): this {
    this.builder.limit(limit);
    return this;
  }

  public offset(offset?: number): this {
    this.builder.offset(offset);
    return this;
  }

  public whereInIds(ids: number[] | string[]): this {
    this.builder.whereInIds(ids);
    return this;
  }

  public orderBy(field?: string, direction?: OrderDirection): this {
    if (field && direction) {
      this.builder.orderBy(this.buildOrderFieldAlias(field), direction);
    } else {
      this.builder.orderBy();
    }
    return this;
  }

  public addOrderBy(field: string, direction: OrderDirection): this {
    this.builder.addOrderBy(this.buildOrderFieldAlias(field), direction);
    return this;
  }

  private buildOrderFieldAlias(field: string): string {
    return this.getMySQLFieldAlias(field);
  }

  private getMySQLFieldAlias(field: string): string {
    return this.getDatabaseFieldName(field);
  }

  private getMainAliasName(): string {
    if (!this.builder.expressionMap.mainAlias) throw new Error('missing mainAlias for the query');
    return this.builder.expressionMap.mainAlias.name;
  }

  private getDatabaseFieldName(field: string): string {
    const columnMetadata = this.metadata.findColumnWithPropertyName(field);
    if (!columnMetadata) {
      return field;
    }
    return `${this.getMainAliasName()}_${columnMetadata.databaseName}`;
  }
}
