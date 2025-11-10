import { JwtPayload } from 'jsonwebtoken';
import express from 'express';

import { IRequesterAuthContext, IRequesterContext } from '@common/interfaces/requester-context.interface';
import { GraphLocale } from '../i18n/types';

export type RequestContext = Pick<express.Request, 'accepts' | 'get' | 'headers' | 'ip'> & {
  requesterContext?: IRequesterContext;
  authContext?: IRequesterAuthContext;
  requestId?: string;
  locale?: GraphLocale;
  jwtAuth?: JwtPayload;
};
