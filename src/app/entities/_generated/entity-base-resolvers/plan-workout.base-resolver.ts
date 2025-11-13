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
import { PlanWorkout } from '../../plan-workout/plan-workout.entity';
import { PlanWorkoutConnection, PlanWorkoutsArgs } from '../entity-connections/plan-workout.connection';

@Resolver(_of => PlanWorkout)
@Service()
export abstract class PlanWorkoutBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<PlanWorkout>) {}

  @AuthorizedAdmin()
  @Query(_returns => PlanWorkout, { description: 'Find PlanWorkout by Object ID.' })
  public async getPlanWorkout(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', PlanWorkout) entity: PlanWorkout,
  ): Promise<PlanWorkout> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => PlanWorkoutConnection, { description: 'Find PlanWorkouts by connection arguments.' })
  public async getPlanWorkouts(
    @Args(_type => PlanWorkoutsArgs) args: IConnectionArgs<PlanWorkout>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<PlanWorkout>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, PlanWorkout))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: PlanWorkout): ObjectId {
    return new ObjectId({ id, type: 'PlanWorkout' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: PlanWorkout): string {
    return String(id);
  }
}
