import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class UpdatePlanWorkoutInput {
  @Field(() => Int, { nullable: true })
  weekNumber?: number;

  @Field(() => Int, { nullable: true })
  dayOfWeek?: number;

  @Field(() => Int, { nullable: true })
  orderInDay?: number | null;

  @Field(() => String, { nullable: true })
  customName?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}
