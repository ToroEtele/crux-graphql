import { v4 as uuidv4 } from 'uuid';

import { IRequesterAuthContext, IRequesterContext } from '@common/interfaces/requester-context.interface';
import { RequestContext } from '@common/interfaces/extended-request.interface';
import { GraphLocale } from '@common/i18n/types';

export class RequesterContext implements IRequesterContext {
  public readonly authContext: IRequesterAuthContext;
  public readonly isSystemAdmin: boolean;
  public readonly requestId: string;
  public readonly locale: GraphLocale;

  constructor({ requestId, locale, authContext }: Pick<RequestContext, 'requestId' | 'locale' | 'authContext'>) {
    this.requestId = requestId ?? RequesterContext.generateRequestId();
    this.locale = locale ?? GraphLocale.English;
    this.isSystemAdmin = false;
    this.authContext = authContext || { user: null };
  }

  public static generateRequestId(): string {
    return uuidv4();
  }
}
