import { PaginationService } from '@query-building/pagination/pagination.service';

import { ConnectionModel } from './connection.model';

import { IConnectionServiceArgs } from './interfaces/connection-service-args.interface';

export class ConnectionService<TEntity> {
  public static readonly edgesFields = ['edges', 'nodes', 'pageInfo'];
  public static readonly countFields = ['totalCount', 'pageInfo'];

  private readonly paginationService: PaginationService<TEntity>;

  constructor(private readonly args: IConnectionServiceArgs<TEntity>) {
    this.paginationService = new PaginationService<TEntity>(this.args.paginationArgs);
  }

  public async getConnection(): Promise<ConnectionModel<TEntity>> {
    const page = await this.paginationService.getPage(this.args.query);
    return new ConnectionModel(page);
  }

  public static isAnyFieldRequested(names: string[], requestedFields: string[]): boolean {
    return !!names.find((name) => requestedFields.includes(name));
  }
}
