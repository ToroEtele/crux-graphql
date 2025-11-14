import { Authorized } from 'type-graphql';

import { AuthorizationLevel } from '../constants/authorization-level.enum';

export function AuthorizedProMember(): ReturnType<typeof Authorized> {
  return Authorized(AuthorizationLevel.Professional);
}
