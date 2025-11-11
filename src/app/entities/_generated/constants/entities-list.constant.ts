// This file was generated automatically.
// All manual modifications will be lost!
/* eslint-disable @typescript-eslint/sort-type-constituents,import/order */
import { Constructable } from '../../../_common/base-types/constructable.type';
import { StrictMap } from '../../../_common/strict-map';
import { AvatarImage } from '../../avatar-image/avatar-image.entity';
import { Session } from '../../session/session.entity';
import { User } from '../../user/user.entity';
import { Account } from '../../account/account.entity';
import { Subscription } from '../../subscription/subscription.entity';
import { VerificationToken } from '../../verification-token/verification-token.entity';

export type NonAbstractEntity = AvatarImage | Session | User | Account | Subscription | VerificationToken;
export type NonRetrievableEntity = AvatarImage | Session | User | Account | Subscription | VerificationToken;
export type Entity = NonRetrievableEntity;

export const allEntities = [AvatarImage, Session, User, Account, Subscription, VerificationToken];

export const nonRetrievableEntities = [AvatarImage, Session, User, Account, Subscription, VerificationToken];

export const entityNameTypeMapping = new StrictMap<string, Constructable<NonAbstractEntity>>('entityNameTypeMapping', [
  ['AvatarImage', AvatarImage],
  ['Session', Session],
  ['User', User],
  ['Account', Account],
  ['Subscription', Subscription],
  ['VerificationToken', VerificationToken]
]);
