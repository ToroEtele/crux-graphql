import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { PlanBaseResolver } from '../_generated/entity-base-resolvers/plan.base-resolver';

import { PlanWorkout } from '../plan-workout/plan-workout.entity';
import { Category } from '../category/category.entity';
import { Plan } from './plan.entity';

import { PlanWorkoutRepository } from '../plan-workout/plan-workout.repository';
import { CategoryRepository } from '../category/category.repository';
import { PlanRepository } from './plan.repository';
import { AuthorizedMember } from '@app/access-control/authorization/decorators/authorized-member.decorator';

@Service()
@Resolver((_of) => Plan)
export class PlanResolver extends PlanBaseResolver {
  constructor(
    @InjectRepository(Category) private categoryRepository: CategoryRepository,
    @InjectRepository(PlanWorkout) private planWorkoutRepository: PlanWorkoutRepository,
    @InjectRepository(Plan) private repository: PlanRepository
  ) {
    super(repository);
  }

  @FieldResolver((_type) => Category)
  async category(@Root() plan: Plan): Promise<Category> {
    return await this.categoryRepository.findOneOrThrow(plan.categoryId);
  }

  @AuthorizedMember()
  @FieldResolver((_type) => [PlanWorkout])
  async workouts(@Root() plan: Plan): Promise<PlanWorkout[]> {
    return await this.planWorkoutRepository
      .createQueryBuilder()
      .where({ planId: { eq: plan.id } })
      .getMany();
  }
}
