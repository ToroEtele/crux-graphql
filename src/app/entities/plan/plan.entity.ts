import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Entity } from '@app/entity-management/decorators/entity.decorator';
import { Field } from '@entities/_common/decorators/field.decorator';
import { ObjectId } from '@entities/_common/object-id/object-id';
import { BaseEntity } from '@common/base-types/base.entity';

import { Category } from '../category/category.entity';
import { PlanWorkout } from '../plan-workout/plan-workout.entity';
import { Difficulty } from './enums/difficulty.enum';

@Entity()
export class Plan extends BaseEntity {
  @Field((_type) => ObjectId)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((_type) => String, { filterable: true, sortable: true })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Field((_type) => String)
  @Column({ type: 'varchar', length: 2048 })
  description!: string;

  @Field((_type) => Number, { filterable: true, sortable: true })
  @Column({ name: 'duration_weeks', type: 'int' })
  durationWeeks!: number;

  @Field((_type) => Difficulty, { filterable: true, sortable: true, enum: 'Difficulty' })
  @Column({ type: 'varchar', length: 255 })
  diff!: Difficulty;

  @Field((_type) => Boolean, { filterable: true, sortable: true })
  @Column({ name: 'is_public', type: 'tinyint', default: false })
  isPublic!: boolean;

  @Column({ name: 'category_id' })
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.plans)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @OneToMany(() => PlanWorkout, (pw) => pw.plan)
  workouts!: Promise<PlanWorkout[]>;
}
