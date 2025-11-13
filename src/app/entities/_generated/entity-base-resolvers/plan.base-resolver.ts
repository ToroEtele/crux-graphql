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
import { Plan } from '../../plan/plan.entity';
import { PlanConnection, PlansArgs } from '../entity-connections/plan.connection';

@Resolver(_of => Plan)
@Service()
export abstract class PlanBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<Plan>) {}

  @AuthorizedAdmin()
  @Query(_returns => Plan, { description: 'Find Plan by Object ID.' })
  public async getPlan(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', Plan) entity: Plan,
  ): Promise<Plan> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => PlanConnection, { description: 'Find Plans by connection arguments.' })
  public async getPlans(
    @Args(_type => PlansArgs) args: IConnectionArgs<Plan>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<Plan>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, Plan))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: Plan): ObjectId {
    return new ObjectId({ id, type: 'Plan' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: Plan): string {
    return String(id);
  }
}
