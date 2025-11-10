import { IRequesterContext } from '@common/interfaces/requester-context.interface';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

@Service()
export class ResolveTimeService implements MiddlewareInterface<IRequesterContext> {
  async use({ info }: ResolverData<IRequesterContext>, next: NextFn): Promise<void> {
    const start = Date.now();
    await next();
    const resolveTime = Date.now() - start;
    console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
  }
}
