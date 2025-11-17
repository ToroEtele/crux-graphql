import { InputType, Field } from 'type-graphql';

import { Difficulty } from '../../plan/enums/difficulty.enum';

@InputType()
export class UpdateExerciseInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Difficulty, { nullable: true })
  diff?: Difficulty;

  @Field({ nullable: true })
  defaultUnits?: string;

  @Field({ nullable: true })
  categoryId?: number;
}
