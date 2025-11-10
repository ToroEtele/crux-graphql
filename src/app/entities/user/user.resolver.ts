import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { InjectRepository } from '@entity-management/decorators/inject-repository.decorator';
import { CurrentUser } from '@access-control/_common/decorators/current-user.decorator';
import { ObjectId } from '@entities/_common/object-id/object-id';
import { pickBy, isEqual, isUndefined } from '@utils/ts-tools';

import { UserBaseResolver } from '@entities/_generated/entity-base-resolvers/user.base-resolver';
import { Subscription } from '@entities/subscription/subscription.entity';
import { User } from './user.entity';

import { SubscriptionRepository } from '@entities/subscription/subscription.repository';
import { UserRepository } from './user.repository';
import { UpdateUserInput } from './types/update-user.input-type';

@Service()
@Resolver((_of) => User)
export class UserResolver extends UserBaseResolver {
  constructor(
    @InjectRepository(Subscription) private subscriptionRepository: SubscriptionRepository,
    @InjectRepository(User) private repository: UserRepository
  ) {
    super(repository);
  }

  @Query((_type) => User, { nullable: true })
  public async me(@CurrentUser() user: User): Promise<User | null> {
    return user;
  }

  @Authorized()
  @Mutation((_type) => User)
  public async updateUser(@Arg('input') input: UpdateUserInput, @CurrentUser() user: User): Promise<User> {
    return await this.repository.update(user, this.getUpdateParams(user, input));
  }

  private getUpdateParams(user: User, input: UpdateUserInput): UpdateUserInput {
    const userPartial: Partial<User> = input;

    return pickBy(userPartial, (value, key) => {
      const k = key as keyof User;
      return !isUndefined(value) && !isEqual(value, user[k]);
    }) as UpdateUserInput;
  }

  @FieldResolver((_type) => ObjectId, { nullable: true })
  async avatarImageId(@Root() user: User): Promise<ObjectId | null> {
    return user?.avatarImageId ? new ObjectId({ id: user.avatarImageId, type: 'AvatarImage' }) : null;
  }

  @FieldResolver((_type) => Subscription, { nullable: true })
  async activeSubscription(@Root() user: User): Promise<Subscription | null> {
    if (!user.stripeCustomerId) return null;
    return await this.subscriptionRepository
      .createQueryBuilder()
      .where({ stripeCustomerId: { eq: user.stripeCustomerId }, status: { eq: 'active' } })
      .getOne();
  }
}
