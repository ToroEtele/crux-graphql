import { InputType, Field, Int } from 'type-graphql';

import { ObjectId } from '@app/entities/_common/object-id/object-id';

@InputType()
export class CreatePlanWorkoutInput {
  @Field(() => Int)
  weekNumber!: number;

  @Field(() => Int)
  dayOfWeek!: number;

  @Field(() => Int, { nullable: true })
  orderInDay?: number | null;

  @Field(() => String, { nullable: true })
  customName?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => ObjectId)
  workoutId!: number;

  @Field(() => ObjectId)
  planId!: number;
}
