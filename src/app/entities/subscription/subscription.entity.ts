import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { Entity } from '@entity-management/decorators/entity.decorator';
import { Field } from '@entities/_common/decorators/field.decorator';
import { ObjectId } from '@entities/_common/object-id/object-id';

import { BaseEntity } from '@common/base-types/base.entity';
import { SubscriptionPlan } from './enum/subscription-plan.enum';

@Entity()
export class Subscription extends BaseEntity {
  @Field((_type) => ObjectId)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((_type) => SubscriptionPlan)
  @Column({ name: 'plan', type: 'varchar', length: 255 })
  plan!: string;

  @Field((_type) => String)
  @Column({ name: 'reference_id', type: 'varchar', length: 255 })
  referenceId!: string;

  @Column({ name: 'stripe_customer_id', type: 'varchar', length: 255, nullable: true })
  stripeCustomerId?: string | null;

  @Column({ name: 'stripe_subscription_id', type: 'varchar', length: 255, nullable: true })
  stripeSubscriptionId?: string | null;

  @Column({ type: 'varchar', length: '255' })
  status!: string;

  @Field((_type) => Number, { nullable: true })
  @Column({ name: 'period_start', type: 'bigint', nullable: true })
  periodStart?: number | null;

  @Field((_type) => Number, { nullable: true })
  @Column({ name: 'period_end', type: 'bigint', nullable: true })
  periodEnd?: number | null;

  @Field((_type) => Boolean, { nullable: true })
  @Column({ name: 'cancel_at_period_end', type: 'boolean', nullable: true })
  cancelAtPeriodEnd?: boolean | null;

  @Column({ name: 'seats', type: 'bigint', nullable: true })
  seats?: number | null;

  @Field((_type) => Date, { nullable: true })
  @Column({ name: 'trial_start', type: 'datetime', nullable: true })
  trialStart?: Date | null;

  @Field((_type) => Date, { nullable: true })
  @Column({ name: 'trial_end', type: 'datetime', nullable: true })
  trialEnd?: Date | null;
}
