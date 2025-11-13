// This file was generated automatically.
// All manual modifications will be lost!
import { ValidateNested } from 'class-validator';
import { InputType } from 'type-graphql';

import { ConnectionFilterOperator } from '../../../query-building/connection/filtering/constants/connection-filter-operator.enum';
import { ConnectionFilter } from '../../../query-building/connection/filtering/interfaces/connection-filter.interface';
import { ConnectionStringFilterInput } from '../../../query-building/connection/filtering/types/connection-string-filter.input';
import { Field as GraphQLField } from '../../_common/decorators/field.decorator';
import { Exercise } from '../../exercise/exercise.entity';

import { ConnectionDifficultyFilterInput } from './connection-difficulty-filter.input-type';

@InputType()
export class ExercisesFilterInput implements ConnectionFilter<Exercise> {
  @GraphQLField(_type => ConnectionStringFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public name?: ConnectionStringFilterInput;

  @GraphQLField(_type => ConnectionStringFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public defaultUnits?: ConnectionStringFilterInput;

  @GraphQLField(_type => ConnectionDifficultyFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public diff?: ConnectionDifficultyFilterInput;

  @GraphQLField(_type => [ExercisesFilterInput], {
    nullable: true,
    description: 'Groups each filter object using AND',
  })
  @ValidateNested()
  public [ConnectionFilterOperator.and]?: ExercisesFilterInput[];

  @GraphQLField(_type => [ExercisesFilterInput], {
    nullable: true,
    description: 'Groups each filter object using OR',
  })
  @ValidateNested()
  public [ConnectionFilterOperator.or]?: ExercisesFilterInput[];
}
