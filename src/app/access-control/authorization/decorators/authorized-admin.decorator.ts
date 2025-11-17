import { Authorized } from 'type-graphql';

export function AuthorizedAdmin(): ReturnType<typeof Authorized> {
  return Authorized();
}
