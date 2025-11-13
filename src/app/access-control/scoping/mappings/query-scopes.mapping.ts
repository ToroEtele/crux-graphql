import { SqlQueryBuilder } from '@query-building/external-providers/sql/sql-query-builder';
import { Constructable } from '@common/base-types/constructable.type';
import { ScopingFunction } from '../types/scoping-function.type';

import { AvatarImage } from '@entities/avatar-image/avatar-image.entity';
import { Category } from '@app/entities/category/category.entity';
import { Plan } from '@app/entities/plan/plan.entity';
import { PlanWorkout } from '@app/entities/plan-workout/plan-workout.entity';
import { Workout } from '@app/entities/workout/workout.entity';

export const defaultQueryScopeMappings = new Map<Constructable<any>, ScopingFunction<any>>([
  [AvatarImage, (query, { user }) => (<SqlQueryBuilder<AvatarImage>>query).innerJoin('user.avatarImage', 'user', 'user.id = :userId', { userId: user?.id })],
  [Category, (query) => (<SqlQueryBuilder<Category>>query)],
  [Plan, (query) => (<SqlQueryBuilder<Plan>>query)],
  [PlanWorkout, (query) => (<SqlQueryBuilder<PlanWorkout>>query)],
  [Workout, (query) => (<SqlQueryBuilder<Workout>>query)]
]);
