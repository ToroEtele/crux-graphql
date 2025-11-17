import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateCategoryInput {
  @Field()
  name!: string;
}
