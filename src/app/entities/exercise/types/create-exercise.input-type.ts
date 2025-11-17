import { InputType, Field } from 'type-graphql';

import { Difficulty } from '../../plan/enums/difficulty.enum';

@InputType()
export class CreateExerciseInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Difficulty)
  diff!: Difficulty;

  @Field()
  defaultUnits!: string;

  @Field()
  categoryId!: number;
}
