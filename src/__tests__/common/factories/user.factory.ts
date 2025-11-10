import { Factory } from 'rosie';

import { User } from '@entities/user/user.entity';
import { DatabaseUtil } from '@entity-management/utils/database.util';

export const userFactory = Factory.define<User>('user')
  .sequence('name', (n) => `Name ${n}`)
  .sequence('email', (n) => `name${n}@gmail.com`)
  .attr('termsAgreed', true)
  .attr('createdAt', () => new Date())
  .attr('updatedAt', ['createdAt'], (createdAt) => createdAt);

export async function createUser(opts: Partial<User> = {}): Promise<User> {
  const userRepository = DatabaseUtil.getRepository(User);
  const user = userRepository.build(userFactory.build(opts));
  return await userRepository.save(user);
}
