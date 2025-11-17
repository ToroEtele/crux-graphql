import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Entity } from '@app/entity-management/decorators/entity.decorator';
import { Field } from '@entities/_common/decorators/field.decorator';
import { ObjectId } from '@entities/_common/object-id/object-id';
import { BaseEntity } from '@common/base-types/base.entity';

import { PlanWorkoutExerciseOverride } from '../plan-workout-exercise-override/plan-workout-exercise-override.entity';
import { Workout } from '../workout/workout.entity';
import { Plan } from '../plan/plan.entity';

@Entity()
export class PlanWorkout extends BaseEntity {
  @Field((_type) => ObjectId)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((_type) => Number)
  @Column({ name: 'week_number', type: 'int' })
  weekNumber!: number;

  @Field((_type) => Number)
  @Column({ name: 'day_of_week', type: 'int' })
  dayOfWeek!: number;

  @Field((_type) => Number, { nullable: true })
  @Column({ name: 'order_in_day', type: 'int', nullable: true })
  orderInDay?: number | null;

  @Field((_type) => String)
  @Column({ name: 'custom_name', type: 'varchar', length: 255, nullable: true })
  customName?: string | null;

  @Field((_type) => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ name: 'workout_id' })
  workoutId!: number;

  @Column({ name: 'plan_id' })
  planId!: number;

  @ManyToOne(() => Workout, (workout) => workout.planWorkouts)
  @JoinColumn({ name: 'workout_id' })
  workout!: Workout;

  @ManyToOne(() => Plan, (plan) => plan.workouts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan!: Plan;

  @OneToMany(() => PlanWorkoutExerciseOverride, (override) => override.planWorkout)
  workoutPlanExerciseOverrides!: Promise<PlanWorkoutExerciseOverride[]>;
}
