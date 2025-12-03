import { InputType, Field, Int } from 'type-graphql';

import { ObjectId } from '@app/entities/_common/object-id/object-id';

@InputType()
export class CreateWorkoutExerciseInput {
  @Field(() => Int)
  order!: number;

  @Field(() => Int)
  sets!: number;

  @Field(() => Int)
  reps!: number;

  @Field(() => Int, { nullable: true })
  time?: number | null;

  @Field(() => Int, { nullable: true })
  weight?: number | null;

  @Field(() => Int)
  restAfter!: number;

  @Field(() => Int)
  restBetween!: number;

  @Field(() => String, { nullable: true })
  notes!: string;

  @Field(() => ObjectId)
  exerciseId!: number;

  @Field(() => ObjectId)
  workoutId!: number;
}
