import { InputType, Field } from 'type-graphql';

import { Difficulty } from '../../plan/enums/difficulty.enum';

@InputType()
export class UpdateWorkoutInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Difficulty, { nullable: true })
  diff?: Difficulty;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  categoryId?: number;
}
