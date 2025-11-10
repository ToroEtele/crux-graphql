import Container from 'typedi';
import { createMethodMiddlewareDecorator } from 'type-graphql';
import { capitalize } from 'lodash';

import { IRequesterContext } from '@interfaces/requester-context.interface';
import { ScopingService } from '@access-control/scoping/scoping.service';
import { Constructable } from '@common/base-types/constructable.type';
import { get } from '@common/helpers/get.helper';
import { ApiError } from '@errors/api.error';

export function UniqueBy<TEntity extends { id: number }>(entityClass: Constructable<TEntity>, uniqueFields: Array<keyof TEntity>): MethodDecorator {
  return createMethodMiddlewareDecorator<IRequesterContext>(async ({ args, context }, next) => {
    const scopingService = Container.get(ScopingService);

    await Promise.all(
      uniqueFields.map(async (key) => {
        const path = `input.${String(key)}`;
        const inputValue = get(args, path);

        const isUpdate = get(args, 'id');

        if (inputValue === undefined || inputValue === null) {
          throw new Error(`Cannot use @UniqueBy on an optional/missing field: ${path}`);
        }

        const query = scopingService.createScopedQuery(context.authContext, entityClass);

        const castedKey = key as any;
        const result = isUpdate
          ? await query.andWhere({ [castedKey]: { eq: inputValue }, id: { ne: isUpdate.numberId() } }).getOne()
          : await query.andWhere({ [castedKey]: { eq: inputValue } }).getOne();

        if (result) {
          throw new ApiError(ApiError.ErrorCodes.BadUserInput, { message: `${capitalize(String(key))} must be unique` });
        }
      })
    );

    return await next();
  });
}
