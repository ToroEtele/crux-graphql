import { AuthCheckerFn } from 'type-graphql';

import { IRequesterAuthContext, IRequesterContext } from '@common/interfaces/requester-context.interface';
import { User } from '@app/entities/user/user.entity';

export const userAuthChecker = (user: User | null | undefined, requiredRoles: string[]): boolean => {
  if (!requiredRoles) return false;
  return true;
};

export const authChecker: AuthCheckerFn<IRequesterContext, any> = ({ context: { authContext } }, roles) => userAuthChecker(authContext.user, roles);

export function isSystemAdmin(authContext: IRequesterAuthContext): boolean {
  return false;
}
