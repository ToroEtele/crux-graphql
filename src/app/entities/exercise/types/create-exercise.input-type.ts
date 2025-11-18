import { InputType, Field } from 'type-graphql';

import { ObjectId } from '@app/entities/_common/object-id/object-id';
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

  @Field((_type) => ObjectId)
  categoryId!: number;
}
