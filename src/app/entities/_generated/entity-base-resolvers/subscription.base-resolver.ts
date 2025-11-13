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
import { Subscription } from '../../subscription/subscription.entity';
import { SubscriptionConnection, SubscriptionsArgs } from '../entity-connections/subscription.connection';

@Resolver(_of => Subscription)
@Service()
export abstract class SubscriptionBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<Subscription>) {}

  @AuthorizedAdmin()
  @Query(_returns => Subscription, { description: 'Find Subscription by Object ID.' })
  public async getSubscription(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', Subscription) entity: Subscription,
  ): Promise<Subscription> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => SubscriptionConnection, { description: 'Find Subscriptions by connection arguments.' })
  public async getSubscriptions(
    @Args(_type => SubscriptionsArgs) args: IConnectionArgs<Subscription>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<Subscription>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, Subscription))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: Subscription): ObjectId {
    return new ObjectId({ id, type: 'Subscription' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: Subscription): string {
    return String(id);
  }
}
