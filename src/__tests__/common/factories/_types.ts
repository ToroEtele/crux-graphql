import { User } from '@entities/user/user.entity';

export type FactoryCreateOptions<TEntity> = TEntity & { creator: User };
