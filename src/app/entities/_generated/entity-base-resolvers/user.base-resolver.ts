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
import { User } from '../../user/user.entity';
import { UserConnection, UsersArgs } from '../entity-connections/user.connection';

@Resolver(_of => User)
@Service()
export abstract class UserBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<User>) {}

  @AuthorizedAdmin()
  @Query(_returns => User, { description: 'Find User by Object ID.' })
  public async getUser(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', User) entity: User,
  ): Promise<User> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => UserConnection, { description: 'Find Users by connection arguments.' })
  public async getUsers(
    @Args(_type => UsersArgs) args: IConnectionArgs<User>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<User>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, User))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: User): ObjectId {
    return new ObjectId({ id, type: 'User' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: User): string {
    return String(id);
  }
}
