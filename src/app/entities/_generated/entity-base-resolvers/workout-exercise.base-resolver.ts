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
import { WorkoutExercise } from '../../workout-exercise/workout-exercise.entity';
import { WorkoutExerciseConnection, WorkoutExercisesArgs } from '../entity-connections/workout-exercise.connection';

@Resolver(_of => WorkoutExercise)
@Service()
export abstract class WorkoutExerciseBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<WorkoutExercise>) {}

  @AuthorizedAdmin()
  @Query(_returns => WorkoutExercise, { description: 'Find WorkoutExercise by Object ID.' })
  public async getWorkoutExercise(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', WorkoutExercise) entity: WorkoutExercise,
  ): Promise<WorkoutExercise> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => WorkoutExerciseConnection, { description: 'Find WorkoutExercises by connection arguments.' })
  public async getWorkoutExercises(
    @Args(_type => WorkoutExercisesArgs) args: IConnectionArgs<WorkoutExercise>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<WorkoutExercise>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, WorkoutExercise))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: WorkoutExercise): ObjectId {
    return new ObjectId({ id, type: 'WorkoutExercise' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: WorkoutExercise): string {
    return String(id);
  }
}
