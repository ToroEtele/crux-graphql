import { InputType, Field } from 'type-graphql';

import { ObjectId } from '@app/entities/_common/object-id/object-id';
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

  @Field((_type) => ObjectId, { nullable: true })
  categoryId?: number;
}
