// This file was generated automatically.
// All manual modifications will be lost!
import { Arg, Args, Query, FieldResolver, Root, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { IRequesterAuthContext } from '../../../_common/interfaces/requester-context.interface';
import { AuthContext } from '../../../access-control/_common/decorators/auth-context.decorator';
import { AuthorizedAdmin } from '../../../access-control/authorization/authorized-admin.decorator';
import { InjectScoped } from '../../../access-control/scoping/inject-scoped.decorator';
import { ScopingService } from '../../../access-control/scoping/scoping.service';
import { IBaseRepository } from '../../../entity-management/interfaces/base-repository.interface';
import { IConnectionArgs } from '../../../query-building/connection/interfaces/connection-args.interface';
import { IConnection } from '../../../query-building/connection/interfaces/connection.interface';
import { QueryService } from '../../../query-building/query.service';
import { ObjectId } from '../../_common/object-id/object-id';
import { RequestedFields } from '../../_common/decorators/requested-fields.decorator';
import { Category } from '../../category/category.entity';
import { CategoryConnection, CategoriesArgs } from '../entity-connections/category.connection';

@Resolver(_of => Category)
@Service()
export abstract class CategoryBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<Category>) {}

  @AuthorizedAdmin()
  @Query(_returns => Category, { description: 'Find Category by Object ID.' })
  public async getCategory(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', Category) entity: Category,
  ): Promise<Category> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => CategoryConnection, { description: 'Find Categories by connection arguments.' })
  public async getCategories(
    @Args(_type => CategoriesArgs) args: IConnectionArgs<Category>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<Category>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, Category))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: Category): ObjectId {
    return new ObjectId({ id, type: 'Category' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: Category): string {
    return String(id);
  }
}
