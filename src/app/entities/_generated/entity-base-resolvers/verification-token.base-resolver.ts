// This file was generated automatically.
// All manual modifications will be lost!
import { Arg, Args, Query, FieldResolver, Root, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { IRequesterAuthContext } from '../../../_common/interfaces/requester-context.interface';
import { AuthContext } from '../../../access-control/_common/decorators/auth-context.decorator';
import { AuthorizedAdmin } from '../../../access-control/authorization/authorized-admin.decorator';
import { InjectScoped } from '../../../access-control/scoping/inject-scoped.decorator';
import { ScopingService } from '../../../access-control/scoping/scoping.service';
import { IBaseRepository } from '../../../entity-management/interfaces/base-repository.interface';
import { IConnectionArgs } from '../../../query-building/connection/interfaces/connection-args.interface';
import { IConnection } from '../../../query-building/connection/interfaces/connection.interface';
import { QueryService } from '../../../query-building/query.service';
import { ObjectId } from '../../_common/object-id/object-id';
import { RequestedFields } from '../../_common/decorators/requested-fields.decorator';
import { VerificationToken } from '../../verification-token/verification-token.entity';
import {
  VerificationTokenConnection,
  VerificationTokensArgs,
} from '../entity-connections/verification-token.connection';

@Resolver(_of => VerificationToken)
@Service()
export abstract class VerificationTokenBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<VerificationToken>) {}

  @AuthorizedAdmin()
  @Query(_returns => VerificationToken, { description: 'Find VerificationToken by Object ID.' })
  public async getVerificationToken(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', VerificationToken) entity: VerificationToken,
  ): Promise<VerificationToken> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => VerificationTokenConnection, { description: 'Find VerificationTokens by connection arguments.' })
  public async getVerificationTokens(
    @Args(_type => VerificationTokensArgs) args: IConnectionArgs<VerificationToken>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<VerificationToken>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, VerificationToken))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: VerificationToken): ObjectId {
    return new ObjectId({ id, type: 'VerificationToken' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: VerificationToken): string {
    return String(id);
  }
}
