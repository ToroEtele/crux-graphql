// This file was generated automatically.
// All manual modifications will be lost!
import { ValidateNested } from 'class-validator';
import { InputType } from 'type-graphql';

import { ConnectionFilterOperator } from '../../../query-building/connection/filtering/constants/connection-filter-operator.enum';
import { ConnectionFilter } from '../../../query-building/connection/filtering/interfaces/connection-filter.interface';
import { ConnectionBooleanFilterInput } from '../../../query-building/connection/filtering/types/connection-boolean-filter.input';
import { ConnectionDateFilterInput } from '../../../query-building/connection/filtering/types/connection-date-filter.input';
import { ConnectionStringFilterInput } from '../../../query-building/connection/filtering/types/connection-string-filter.input';
import { Field as GraphQLField } from '../../_common/decorators/field.decorator';
import { User } from '../../user/user.entity';

@InputType()
export class UsersFilterInput implements ConnectionFilter<User> {
  @GraphQLField(_type => ConnectionStringFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public name?: ConnectionStringFilterInput;

  @GraphQLField(_type => ConnectionStringFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public email?: ConnectionStringFilterInput;

  @GraphQLField(_type => ConnectionBooleanFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public emailVerified?: ConnectionBooleanFilterInput;

  @GraphQLField(_type => ConnectionDateFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public createdAt?: ConnectionDateFilterInput;

  @GraphQLField(_type => ConnectionBooleanFilterInput, { nullable: true, admin: false })
  @ValidateNested()
  public termsAgreed?: ConnectionBooleanFilterInput;

  @GraphQLField(_type => [UsersFilterInput], {
    nullable: true,
    description: 'Groups each filter object using AND',
  })
  @ValidateNested()
  public [ConnectionFilterOperator.and]?: UsersFilterInput[];

  @GraphQLField(_type => [UsersFilterInput], {
    nullable: true,
    description: 'Groups each filter object using OR',
  })
  @ValidateNested()
  public [ConnectionFilterOperator.or]?: UsersFilterInput[];
}
