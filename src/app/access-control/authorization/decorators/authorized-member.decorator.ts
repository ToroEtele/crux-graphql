import { Authorized } from 'type-graphql';

import { AuthorizationLevel } from '../constants/authorization-level.enum';

export function AuthorizedMember(): ReturnType<typeof Authorized> {
  return Authorized(AuthorizationLevel.Member);
}
