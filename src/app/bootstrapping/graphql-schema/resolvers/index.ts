import type { NonEmptyArray } from 'type-graphql';

import { AvatarImageResolver } from '@entities/avatar-image/avatar-image.resolver';
import { SubscriptionResolver } from '@entities/subscription/subscription.resolver';

const resolvers: NonEmptyArray<Function> = [AvatarImageResolver, SubscriptionResolver];

export default resolvers;
