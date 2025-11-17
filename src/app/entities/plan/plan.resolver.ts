import { Arg, Authorized, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { AuthorizedAdmin } from '@app/access-control/authorization/decorators/authorized-admin.decorator';
import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { InjectScoped } from '@app/access-control/scoping/inject-scoped.decorator';
import { ObjectId } from '../_common/object-id/object-id';

import { PlanWorkout } from '../plan-workout/plan-workout.entity';
import { Category } from '../category/category.entity';
import { Plan } from './plan.entity';

import { PlanWorkoutRepository } from '../plan-workout/plan-workout.repository';
import { CategoryRepository } from '../category/category.repository';
import { PlanRepository } from './plan.repository';

import { PlanBaseResolver } from '../_generated/entity-base-resolvers/plan.base-resolver';
import { CreatePlanInput } from './types/create-plan.input-type';
import { UpdatePlanInput } from './types/update-plan.input-type';

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

  @AuthorizedAdmin()
  @Mutation(() => Plan)
  async createPlan(@Arg('input') input: CreatePlanInput): Promise<Plan> {
    return await this.repository.buildAndSave(input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Plan)
  async updatePlan(@Arg('id') id: ObjectId, @Arg('input') input: UpdatePlanInput, @InjectScoped('id.id', Plan) plan: Plan): Promise<Plan> {
    return await this.repository.update(plan, input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Plan)
  async deletePlan(@Arg('id') id: ObjectId, @InjectScoped('id.id', Plan) plan: Plan): Promise<Plan> {
    return await this.repository.remove(plan);
  }

  @FieldResolver((_type) => Category)
  async category(@Root() plan: Plan): Promise<Category> {
    return await this.categoryRepository.findOneOrThrow(plan.categoryId);
  }

  @Authorized()
  @FieldResolver((_type) => [PlanWorkout])
  async workouts(@Root() plan: Plan): Promise<PlanWorkout[]> {
    return await this.planWorkoutRepository
      .createQueryBuilder()
      .where({ planId: { eq: plan.id } })
      .getMany();
  }
}
