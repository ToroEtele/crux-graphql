import type { NonEmptyArray } from 'type-graphql';

import { AvatarImageResolver } from '@entities/avatar-image/avatar-image.resolver';
import { SubscriptionResolver } from '@entities/subscription/subscription.resolver';
import { UserResolver } from '@app/entities/user/user.resolver';

const resolvers: NonEmptyArray<Function> = [AvatarImageResolver, SubscriptionResolver, UserResolver];

export default resolvers;
