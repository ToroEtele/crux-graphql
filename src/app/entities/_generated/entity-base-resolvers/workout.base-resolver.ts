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
import { Workout } from '../../workout/workout.entity';
import { WorkoutConnection, WorkoutsArgs } from '../entity-connections/workout.connection';

@Resolver(_of => Workout)
@Service()
export abstract class WorkoutBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<Workout>) {}

  @AuthorizedAdmin()
  @Query(_returns => Workout, { description: 'Find Workout by Object ID.' })
  public async getWorkout(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', Workout) entity: Workout,
  ): Promise<Workout> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => WorkoutConnection, { description: 'Find Workouts by connection arguments.' })
  public async getWorkouts(
    @Args(_type => WorkoutsArgs) args: IConnectionArgs<Workout>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<Workout>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, Workout))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: Workout): ObjectId {
    return new ObjectId({ id, type: 'Workout' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: Workout): string {
    return String(id);
  }
}
