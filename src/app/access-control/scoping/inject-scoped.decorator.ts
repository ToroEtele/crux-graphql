import { createParameterDecorator } from 'type-graphql';
import Container from 'typedi';

import { IRequesterContext } from '@interfaces/requester-context.interface';
import { Constructable } from '@common/base-types/constructable.type';
import { get } from '@common/helpers/get.helper';

import { ScopingService } from './scoping.service';

export function InjectScoped<TEntity extends {}>(
  path: string,
  entityClass: Constructable<TEntity>
): PropertyDecorator | ReturnType<typeof createParameterDecorator> {
  return createParameterDecorator<IRequesterContext>(({ args, context }) => {
    const id = get(args, path);

    if (!id) {
      throw new Error(`Missing ID for ${path}`);
    }
    const scopingService = Container.get(ScopingService);
    return scopingService.fetchOrThrow(context.authContext, entityClass, id);
  });
}

export function MaybeInjectScoped<TEntity extends {}>(
  path: string,
  entityClass: Constructable<TEntity>
): PropertyDecorator | ReturnType<typeof createParameterDecorator> {
  return createParameterDecorator<IRequesterContext>(({ args, context }) => {
    const id = get(args, path);
    if (!id) return undefined;
    const scopingService = Container.get(ScopingService);
    return scopingService.fetch(context.authContext, entityClass, id);
  });
}

export function MaybeInjectScopedOrThrow<TEntity extends {}>(
  path: string,
  entityClass: Constructable<TEntity>
): PropertyDecorator | ReturnType<typeof createParameterDecorator> {
  return createParameterDecorator<IRequesterContext>(({ args, context }) => {
    const id = get(args, path);
    if (!id) return undefined;
    const scopingService = Container.get(ScopingService);
    return scopingService.fetchOrThrow(context.authContext, entityClass, id);
  });
}
