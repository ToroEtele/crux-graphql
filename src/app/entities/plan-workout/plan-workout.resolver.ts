import { Arg, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { AuthorizedAdmin } from '@app/access-control/authorization/decorators/authorized-admin.decorator';
import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { InjectScoped } from '@app/access-control/scoping/inject-scoped.decorator';
import { ObjectId } from '../_common/object-id/object-id';

import { PlanWorkout } from './plan-workout.entity';
import { Workout } from '../workout/workout.entity';
import { Plan } from '../plan/plan.entity';

import { WorkoutRepository } from '../workout/workout.repository';
import { PlanWorkoutRepository } from './plan-workout.repository';

import { PlanWorkoutBaseResolver } from '../_generated/entity-base-resolvers/plan-workout.base-resolver';

import { CreatePlanWorkoutInput } from './types/create-plan-workout.input-type';
import { UpdatePlanWorkoutInput } from './types/update-plan-workout.input-type';

@Service()
@Resolver((_of) => PlanWorkout)
export class PlanWorkoutResolver extends PlanWorkoutBaseResolver {
  constructor(
    @InjectRepository(PlanWorkout) private repository: PlanWorkoutRepository,
    @InjectRepository(Workout) private workoutRepository: WorkoutRepository
  ) {
    super(repository);
  }

  @AuthorizedAdmin()
  @Mutation(() => PlanWorkout)
  async createPlanWorkout(
    @Arg('input') input: CreatePlanWorkoutInput,
    @InjectScoped('input.workoutId', Workout) workout: Workout,
    @InjectScoped('input.planId', Plan) plan: Plan
  ): Promise<PlanWorkout> {
    return await this.repository.buildAndSave({
      ...input,
      workout,
      plan
    });
  }

  @AuthorizedAdmin()
  @Mutation(() => PlanWorkout)
  async updatePlanWorkout(
    @Arg('id') id: ObjectId,
    @Arg('input') input: UpdatePlanWorkoutInput,
    @InjectScoped('id.id', PlanWorkout) planWorkout: PlanWorkout
  ): Promise<PlanWorkout> {
    return await this.repository.update(planWorkout, {
      ...input
    });
  }

  @FieldResolver((_type) => Workout)
  async workout(@Root() planWorkout: PlanWorkout): Promise<Workout> {
    return await this.workoutRepository.findOneOrThrow(planWorkout.workoutId);
  }
}
