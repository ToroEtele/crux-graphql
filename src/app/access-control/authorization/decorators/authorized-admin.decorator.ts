import { Authorized } from 'type-graphql';

import { AuthorizationLevel } from '../constants/authorization-level.enum';

export function AuthorizedAdmin(): ReturnType<typeof Authorized> {
  return Authorized(AuthorizationLevel.Admin);
}
