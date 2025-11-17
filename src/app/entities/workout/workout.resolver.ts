import { Arg, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { AuthorizedAdmin } from '@app/access-control/authorization/decorators/authorized-admin.decorator';
import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { InjectScoped } from '@app/access-control/scoping/inject-scoped.decorator';
import { ObjectId } from '../_common/object-id/object-id';

import { WorkoutExercise } from '../workout-exercise/workout-exercise.entity';
import { Category } from '../category/category.entity';
import { Workout } from './workout.entity';

import { WorkoutExerciseRepository } from '../workout-exercise/workout-exercise.repository';
import { CategoryRepository } from '../category/category.repository';
import { WorkoutRepository } from './workout.repository';

import { WorkoutBaseResolver } from '../_generated/entity-base-resolvers/workout.base-resolver';
import { CreateWorkoutInput } from './types/create-workout.input-type';
import { UpdateWorkoutInput } from './types/update-workout.input-type';

@Service()
@Resolver((_of) => Workout)
export class WorkoutResolver extends WorkoutBaseResolver {
  constructor(
    @InjectRepository(Category) private categoryRepository: CategoryRepository,
    @InjectRepository(WorkoutExercise) private workoutExerciseRepository: WorkoutExerciseRepository,
    @InjectRepository(Workout) private repository: WorkoutRepository
  ) {
    super(repository);
  }

  @AuthorizedAdmin()
  @Mutation(() => Workout)
  async createWorkout(@Arg('input') input: CreateWorkoutInput): Promise<Workout> {
    return await this.repository.buildAndSave(input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Workout)
  async updateWorkout(@Arg('id') id: ObjectId, @Arg('input') input: UpdateWorkoutInput, @InjectScoped('id.id', Workout) workout: Workout): Promise<Workout> {
    return await this.repository.update(workout, input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Workout)
  async deleteWorkout(@Arg('id') id: ObjectId, @InjectScoped('id.id', Workout) workout: Workout): Promise<Workout> {
    return await this.repository.remove(workout);
  }

  @FieldResolver((_type) => Category)
  async category(@Root() workout: Workout): Promise<Category> {
    return await this.categoryRepository.findOneOrThrow(workout.categoryId);
  }

  @FieldResolver((_type) => [WorkoutExercise])
  async workoutExercises(@Root() workout: Workout): Promise<WorkoutExercise[]> {
    return await this.workoutExerciseRepository
      .createQueryBuilder()
      .where({ workoutId: { eq: workout.id } })
      .getMany();
  }
}
