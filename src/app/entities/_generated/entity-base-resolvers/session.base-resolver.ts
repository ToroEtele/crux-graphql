// This file was generated automatically.
// All manual modifications will be lost!
import { Args, Query, FieldResolver, Root, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { IRequesterAuthContext } from '../../../_common/interfaces/requester-context.interface';
import { AuthContext } from '../../../access-control/_common/decorators/auth-context.decorator';
import { AuthorizedAdmin } from '../../../access-control/authorization/authorized-admin.decorator';
import { InjectScoped } from '../../../access-control/scoping/inject-scoped.decorator';
import { ScopingService } from '../../../access-control/scoping/scoping.service';
import { IConnectionArgs } from '../../../query-building/connection/interfaces/connection-args.interface';
import { IConnection } from '../../../query-building/connection/interfaces/connection.interface';
import { QueryService } from '../../../query-building/query.service';
import { ObjectId } from '../../_common/object-id/object-id';
import { RequestedFields } from '../../_common/decorators/requested-fields.decorator';
import { Session } from '../../session/session.entity';
import { SessionConnection, SessionsArgs } from '../entity-connections/session.connection';

@Resolver(_of => Session)
@Service()
export abstract class SessionBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  @AuthorizedAdmin()
  @Query(_returns => SessionConnection, { description: 'Find Sessions by connection arguments.' })
  public async getSessions(
    @Args(_type => SessionsArgs) args: IConnectionArgs<Session>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<Session>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, Session))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }
}
