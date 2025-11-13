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
import { AvatarImage } from '../../avatar-image/avatar-image.entity';
import { AvatarImageConnection, AvatarImagesArgs } from '../entity-connections/avatar-image.connection';

@Resolver(_of => AvatarImage)
@Service()
export abstract class AvatarImageBaseResolver {
  @Inject(_type => ScopingService) protected scopingService!: ScopingService;

  constructor(private readonly entityRepository: IBaseRepository<AvatarImage>) {}

  @AuthorizedAdmin()
  @Query(_returns => AvatarImage, { description: 'Find AvatarImage by Object ID.' })
  public async getAvatarImage(
    @Arg('id', _type => ObjectId) id: ObjectId,
    @InjectScoped('id.id', AvatarImage) entity: AvatarImage,
  ): Promise<AvatarImage> {
    return entity;
  }

  @AuthorizedAdmin()
  @Query(_returns => AvatarImageConnection, { description: 'Find AvatarImages by connection arguments.' })
  public async getAvatarImages(
    @Args(_type => AvatarImagesArgs) args: IConnectionArgs<AvatarImage>,
    @RequestedFields() requestedFields: string[],
    @AuthContext() authContext: IRequesterAuthContext,
  ): Promise<IConnection<AvatarImage>> {
    const { filter, orderBy } = args;
    return await new QueryService(this.scopingService.createScopedQuery(authContext, AvatarImage))
      .applyFilter(filter)
      .applySorting(orderBy)
      .getConnection({ ...args, maxEntities: 1000 }, requestedFields);
  }

  @FieldResolver()
  public id(@Root() { id }: AvatarImage): ObjectId {
    return new ObjectId({ id, type: 'AvatarImage' });
  }

  @FieldResolver()
  public rawID(@Root() { id }: AvatarImage): string {
    return String(id);
  }
}
