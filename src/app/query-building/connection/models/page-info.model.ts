import { ObjectType } from 'type-graphql';

import { Field } from '../../../entities/_common/decorators/field.decorator';
import { IPageInfo } from '../../pagination/interfaces/page-info.interface';

@ObjectType()
export class PageInfo implements IPageInfo {
  @Field()
  public hasNextPage!: boolean;

  @Field()
  public hasPreviousPage!: boolean;

  @Field({ nullable: true })
  public startOffset!: number;

  @Field({ nullable: true })
  public endOffset!: number;
}
