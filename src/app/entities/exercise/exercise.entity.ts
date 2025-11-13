import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Entity } from '@app/entity-management/decorators/entity.decorator';
import { Field } from '@entities/_common/decorators/field.decorator';
import { ObjectId } from '@entities/_common/object-id/object-id';
import { BaseEntity } from '@common/base-types/base.entity';

import { Category } from '../category/category.entity';
import { WorkoutExercise } from '../workout-exercise/workout-exercise.entity';
import { Difficulty } from '../_common/constants/enum/difficulty.enum';

@Entity()
export class Exercise extends BaseEntity {
  @Field((_type) => ObjectId)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((_type) => String, { filterable: true, sortable: true })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Field((_type) => String)
  @Column({ type: 'varchar', length: 2048 })
  description!: string;

  @Field((_type) => Difficulty, { filterable: true, sortable: true, enum: 'Difficulty' })
  @Column({ type: 'varchar', length: 255 })
  diff!: Difficulty;

  @Field((_type) => String, { filterable: true, sortable: true })
  @Column({ name: 'default_units', type: 'varchar', length: 255 })
  defaultUnits!: string;

  @Column({ name: 'category_id' })
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.exercises)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @OneToMany(() => WorkoutExercise, (we) => we.exercise)
  workoutExercises!: Promise<WorkoutExercise[]>;
}
