import { InputType, Field } from 'type-graphql';

import { Difficulty } from '../enums/difficulty.enum';

@InputType()
export class CreatePlanInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field()
  durationWeeks!: number;

  @Field(() => Difficulty)
  diff!: Difficulty;

  @Field()
  isPublic!: boolean;

  @Field()
  categoryId!: number;
}
