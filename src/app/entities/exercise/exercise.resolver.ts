import { Arg, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { AuthorizedAdmin } from '@app/access-control/authorization/decorators/authorized-admin.decorator';
import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { InjectScoped } from '@app/access-control/scoping/inject-scoped.decorator';
import { ObjectId } from '../_common/object-id/object-id';

import { Category } from '../category/category.entity';
import { Exercise } from './exercise.entity';

import { CategoryRepository } from '../category/category.repository';
import { ExerciseRepository } from './exercise.repository';

import { ExerciseBaseResolver } from '../_generated/entity-base-resolvers/exercise.base-resolver';
import { CreateExerciseInput } from './types/create-exercise.input-type';
import { UpdateExerciseInput } from './types/update-exercise.input-type';

@Service()
@Resolver((_of) => Exercise)
export class ExerciseResolver extends ExerciseBaseResolver {
  constructor(
    @InjectRepository(Exercise)
    private repository: ExerciseRepository,
    @InjectRepository(Category)
    private categoryRepository: CategoryRepository
  ) {
    super(repository);
  }

  @AuthorizedAdmin()
  @Mutation(() => Exercise)
  async createExercise(@Arg('input') input: CreateExerciseInput): Promise<Exercise> {
    return await this.repository.buildAndSave(input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Exercise)
  async updateExercise(
    @Arg('id') id: ObjectId,
    @Arg('input') input: UpdateExerciseInput,
    @InjectScoped('id.id', Exercise) exercise: Exercise
  ): Promise<Exercise> {
    return await this.repository.update(exercise, input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Exercise)
  async deleteExercise(@Arg('id') id: ObjectId, @InjectScoped('id.id', Exercise) exercise: Exercise): Promise<Exercise> {
    return await this.repository.remove(exercise);
  }

  @FieldResolver((_type) => Category)
  async category(@Root() exercise: Exercise): Promise<Category> {
    return await this.categoryRepository.findOneOrThrow(exercise.categoryId);
  }
}
