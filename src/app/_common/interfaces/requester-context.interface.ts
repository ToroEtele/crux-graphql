import { GraphLocale } from '@common/i18n/types';

import { Subscription } from '@entities/subscription/subscription.entity';
import { Session } from '@entities/session/session.entity';
import { User } from '@entities/user/user.entity';

export interface IRequesterAuthContext {
  subscription?: Subscription | null;
  session?: Session | null;
  user?: User | null;
  ip?: string;
  userAgent?: string;
}
export interface IRequesterContext {
  requestId: string;
  locale: GraphLocale;
  isSystemAdmin: boolean;
  authContext: IRequesterAuthContext;
}
