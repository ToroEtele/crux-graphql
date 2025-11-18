import { InputType, Field } from 'type-graphql';

import { ObjectId } from '@app/entities/_common/object-id/object-id';
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

  @Field((_type) => ObjectId)
  categoryId!: number;
}
