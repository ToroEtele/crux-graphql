import { NextFunction, Response, Request } from 'express';
import { betterFetch } from '@better-fetch/fetch';

import { RequesterContext } from '@access-control/_common/requester-context';
import { RequestContext } from '@interfaces/extended-request.interface';
import { config } from '@config/config.service';

import { Subscription } from '@entities/subscription/subscription.entity';
import { Session } from '@entities/session/session.entity';
import { User } from '@entities/user/user.entity';

import { UnauthorizedError } from '@errors/unauthorized.error';
import { DatabaseUtil } from '@entity-management/utils/database.util';

/**
 * Express middleware that verifies Better Auth session cookies.
 */
export const AuthMiddleware = async (req: Request & RequestContext, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookiesHeader = req.headers.cookie || '';

    const hasBetterAuthCookie = cookiesHeader.includes('better-auth.session_token') || cookiesHeader.includes('better-auth.refresh_token');

    const { data } = hasBetterAuthCookie
      ? await betterFetch<{ session: Session; user: User }>('/auth/get-session', {
          baseURL: config.authUrl,
          headers: {
            cookie: cookiesHeader || ''
          }
        })
      : { data: { user: null, session: null } };

    const subscriptionRepository = DatabaseUtil.getRepository(Subscription);

    const authContext = {
      userAgent: req.header('user-agent'),
      ip: req.ip,
      session: data?.session,
      user: data?.user,
      subscription: data?.user
        ? await subscriptionRepository
            .createQueryBuilder()
            .where({ referenceId: { eq: data.user.id.toString() }, status: { eq: 'active' } })
            .getOne()
        : null
    };

    req.requesterContext = new RequesterContext({ ...req, authContext });

    next();
  } catch (error) {
    console.log(error);
    next(new UnauthorizedError());
  }
};
