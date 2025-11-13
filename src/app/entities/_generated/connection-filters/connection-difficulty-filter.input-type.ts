// This file was generated automatically.
// All manual modifications will be lost!
import { Field, InputType } from 'type-graphql';

import { IConnectionFilterInput } from '../../../query-building/connection/filtering/interfaces/connection-filter-input.interface';
import { Difficulty } from '@entities/_common/constants/enum/difficulty.enum';

@InputType()
export class ConnectionDifficultyFilterInput implements IConnectionFilterInput<Difficulty> {
  @Field((_type) => Difficulty, { nullable: true })
  public eq?: Difficulty;

  @Field((_type) => [Difficulty], { nullable: true })
  public in?: Difficulty[];

  @Field((_type) => Difficulty, { nullable: true })
  public ne?: Difficulty;

  @Field((_type) => [Difficulty], { nullable: true })
  public notIn?: Difficulty[];

  @Field({ nullable: true })
  public isNull?: boolean;
}
