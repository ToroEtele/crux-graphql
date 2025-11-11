import { Column, CreateDateColumn, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Entity } from '@entity-management/decorators/entity.decorator';
import { Field } from '@entities/_common/decorators/field.decorator';
import { ObjectId } from '@entities/_common/object-id/object-id';
import { BaseEntity } from '@common/base-types/base.entity';

import { AvatarImage } from '@entities/avatar-image/avatar-image.entity';
import { Session } from '@entities/session/session.entity';
import { Account } from '../account/account.entity';

@Entity()
export class User extends BaseEntity {
  @Field((_type) => ObjectId)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field((_type) => String, { filterable: true, sortable: true })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Field((_type) => String, { filterable: true, sortable: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Field((_type) => Boolean, { filterable: true, sortable: true })
  @Column({ name: 'email_verified', type: 'tinyint', default: false })
  emailVerified!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string | null;

  @Field((_type) => Date, { filterable: true, sortable: true })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'stripe_customer_id', type: 'varchar', length: 255, nullable: true })
  stripeCustomerId?: string | null;

  @Column({ name: 'ban_expires', type: 'varchar', length: 255, nullable: true })
  banExpires?: Date | null;

  @Column({ name: 'ban_reason', type: 'text', nullable: true })
  banReason?: string | null;

  @Column({ type: 'tinyint', default: false })
  banned!: boolean;

  @Column({ type: 'text', nullable: true })
  role?: string | null;

  // Not required for better auth

  @Field((_type) => Boolean, { filterable: true, sortable: true })
  @Column({ name: 'terms_agreed', type: 'tinyint', default: false })
  termsAgreed!: boolean;

  // * One-to-one relations

  @Column({ name: 'avatar_image_id', nullable: true })
  avatarImageId!: number | null;

  @OneToOne((_type) => AvatarImage, { nullable: true, onDelete: 'SET NULL', orphanedRowAction: 'nullify' })
  @JoinColumn({ name: 'avatar_image_id' })
  avatarImage!: AvatarImage | null;

  // * One-to-Many relations

  @OneToMany((_type) => Session, (session) => session.user)
  sessions!: Promise<Session[]>;

  @OneToMany((_type) => Account, (account) => account.user)
  accounts!: Promise<Account[]>;
}
