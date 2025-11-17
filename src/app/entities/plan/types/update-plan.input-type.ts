import { InputType, Field } from 'type-graphql';

import { Difficulty } from '../enums/difficulty.enum';

@InputType()
export class UpdatePlanInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  durationWeeks?: number;

  @Field(() => Difficulty, { nullable: true })
  diff?: Difficulty;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  categoryId?: number;
}
