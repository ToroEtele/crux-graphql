import { Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { CategoryBaseResolver } from '../_generated/entity-base-resolvers/category.base-resolver';

import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';

@Service()
@Resolver((_of) => Category)
export class CategoryResolver extends CategoryBaseResolver {
  constructor(@InjectRepository(Category) private repository: CategoryRepository) {
    super(repository);
  }
}
