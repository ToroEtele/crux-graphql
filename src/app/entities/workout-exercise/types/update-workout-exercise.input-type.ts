import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class UpdateWorkoutExerciseInput {
  @Field(() => Int, { nullable: true })
  order?: number;

  @Field(() => Int, { nullable: true })
  sets?: number;

  @Field(() => Int, { nullable: true })
  reps?: number;

  @Field(() => Int, { nullable: true })
  time?: number | null;

  @Field(() => Int, { nullable: true })
  weight?: number | null;

  @Field(() => Int, { nullable: true })
  restAfter?: number;

  @Field(() => Int, { nullable: true })
  restBetween?: number;

  @Field({ nullable: true })
  notes?: string;
}
