import { InputType, Field } from 'type-graphql';

import { Difficulty } from '../../plan/enums/difficulty.enum';

@InputType()
export class CreateWorkoutInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Difficulty)
  diff!: Difficulty;

  @Field()
  isPublic!: boolean;

  @Field()
  categoryId!: number;
}
