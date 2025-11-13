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
import { Exercise } from '../../exercise/exercise.entity';
import { ExerciseConnection, ExercisesArgs } from '../entity-connections/exercise.connection';

@Resolver(_of => Exercise)
@Service()
export abstract class ExerciseBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<Exercise>) {}

  @AuthorizedAdmin()
  @Query(_returns => Exercise, { description: 'Find Exercise by Object ID.' })
  public async getExercise(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', Exercise) entity: Exercise,
  ): Promise<Exercise> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => ExerciseConnection, { description: 'Find Exercises by connection arguments.' })
  public async getExercises(
    @Args(_type => ExercisesArgs) args: IConnectionArgs<Exercise>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<Exercise>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, Exercise))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: Exercise): ObjectId {
    return new ObjectId({ id, type: 'Exercise' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: Exercise): string {
    return String(id);
  }
}
