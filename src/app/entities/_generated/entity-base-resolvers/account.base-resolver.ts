// This file was generated automatically.
// All manual modifications will be lost!
import { Arg, Args, Query, FieldResolver, Root, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { IRequesterAuthContext } from '../../../_common/interfaces/requester-context.interface';
import { AuthContext } from '../../../access-control/_common/decorators/auth-context.decorator';
import { AuthorizedAdmin } from '../../../access-control/authorization/authorized-admin.decorator';
import { InjectScoped } from '../../../access-control/scoping/inject-scoped.decorator';
import { ScopingService } from '../../../access-control/scoping/scoping.service';
import { IBaseRepository } from '../../../entity-management/interfaces/base-repository.interface';
import { IConnectionArgs } from '../../../query-building/connection/interfaces/connection-args.interface';
import { IConnection } from '../../../query-building/connection/interfaces/connection.interface';
import { QueryService } from '../../../query-building/query.service';
import { ObjectId } from '../../_common/object-id/object-id';
import { RequestedFields } from '../../_common/decorators/requested-fields.decorator';
import { Account } from '../../account/account.entity';
import { AccountConnection, AccountsArgs } from '../entity-connections/account.connection';

@Resolver(_of => Account)
@Service()
export abstract class AccountBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<Account>) {}

  @AuthorizedAdmin()
  @Query(_returns => Account, { description: 'Find Account by Object ID.' })
  public async getAccount(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', Account) entity: Account,
  ): Promise<Account> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => AccountConnection, { description: 'Find Accounts by connection arguments.' })
  public async getAccounts(
    @Args(_type => AccountsArgs) args: IConnectionArgs<Account>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<Account>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, Account))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: Account): ObjectId {
    return new ObjectId({ id, type: 'Account' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: Account): string {
    return String(id);
  }
}
