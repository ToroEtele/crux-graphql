import { GraphQLError, type GraphQLErrorExtensions } from 'graphql';

import { i18nService } from '@app/bootstrapping/services/i18n.bootstrapable';
import { ErrorCode } from './constants/error-codes.enum';
import type { Maybe } from '../base-types/maybe.type';

export interface IApiErrorOptions {
  extensions?: Maybe<GraphQLErrorExtensions>;
  originalError?: Maybe<Error>;
  message?: Maybe<string>;
  translatable?: boolean;
  internal?: boolean;
}

function getErrorMessage(code: ErrorCode, extensions?: Maybe<GraphQLErrorExtensions>): string {
  const errorMessageKey = `errors.${code}.message`;
  const translatedDefaultMessage = i18nService.exists(errorMessageKey) ? i18nService.t(errorMessageKey, { extensions }) : null;
  return typeof translatedDefaultMessage === 'string' ? translatedDefaultMessage : code;
}

export class ApiError extends GraphQLError {
  public static ErrorCodes = ErrorCode;

  readonly #isInternal?: boolean;

  constructor(code: ErrorCode, options?: IApiErrorOptions) {
    const message = options?.message ?? getErrorMessage(code);

    super(message, {
      extensions: {
        ...options?.extensions,
        code
      },
      originalError: options?.originalError
    });

    this.#isInternal = options?.internal;
  }

  public get internal(): boolean {
    return this.#isInternal ?? false;
  }
}
