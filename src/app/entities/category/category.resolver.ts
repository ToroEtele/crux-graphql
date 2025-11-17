import { Arg, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { AuthorizedAdmin } from '@app/access-control/authorization/decorators/authorized-admin.decorator';
import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { InjectScoped } from '@app/access-control/scoping/inject-scoped.decorator';

import { CategoryBaseResolver } from '../_generated/entity-base-resolvers/category.base-resolver';
import { ObjectId } from '../_common/object-id/object-id';

import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';

import { CreateCategoryInput } from './types/create-category.input-type';
import { UpdateCategoryInput } from './types/update-category-input-type';

@Service()
@Resolver((_of) => Category)
export class CategoryResolver extends CategoryBaseResolver {
  constructor(@InjectRepository(Category) private repository: CategoryRepository) {
    super(repository);
  }

  @AuthorizedAdmin()
  @Mutation(() => Category)
  async createCategory(@Arg('input') input: CreateCategoryInput): Promise<Category> {
    return await this.repository.buildAndSave(input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Category)
  async updateCategory(
    @Arg('id') id: ObjectId,
    @Arg('input') input: UpdateCategoryInput,
    @InjectScoped('id.id', Category) category: Category
  ): Promise<Category> {
    return await this.repository.update(category, input);
  }

  @AuthorizedAdmin()
  @Mutation(() => Category)
  async deleteCategory(@Arg('id') id: ObjectId, @InjectScoped('id.id', Category) category: Category): Promise<Category> {
    return await this.repository.remove(category);
  }
}
