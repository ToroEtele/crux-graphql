import { IsOptional, Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

import { IPaginationArgs } from '../interfaces/pagination-args.interface';

@ArgsType()
export class PaginationArgs implements IPaginationArgs {
  // Forward pagination
  @IsOptional()
  @Min(1)
  @Max(1000, {
    message: (obj) => `Requesting ${obj.value} records on the connection exceeds the \`${obj.property}\` limit of ${obj.constraints[0]} records.`
  })
  @Field((_type) => Int, { nullable: true, defaultValue: 15 })
  public take?: number | null = 15;

  @Field((_type) => Int, { nullable: true })
  public skip?: number;

  public maxEntities?: number;
}
