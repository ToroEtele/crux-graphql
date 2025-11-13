import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Entity } from '@app/entity-management/decorators/entity.decorator';
import { Field } from '@entities/_common/decorators/field.decorator';
import { ObjectId } from '@entities/_common/object-id/object-id';
import { BaseEntity } from '@common/base-types/base.entity';

import { Exercise } from '../exercise/exercise.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutExerciseParam } from '../workout-exercise-param/workout-exercise-param.entity';
import { PlanWorkoutExerciseOverride } from '../plan-workout-exercise-override/plan-workout-exercise-override.entity';

@Entity()
export class WorkoutExercise extends BaseEntity {
  @Field((_type) => ObjectId)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((_type) => Number)
  @Column({ type: 'int' })
  order!: number;

  @Field((_type) => Number)
  @Column({ type: 'int' })
  sets!: number;

  @Field((_type) => Number)
  @Column({ type: 'int' })
  reps!: number;

  @Field((_type) => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  time?: number | null;

  @Field((_type) => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  weight?: number | null;

  @Field((_type) => Number)
  @Column({ name: 'rest_after', type: 'int' })
  restAfter!: number;

  @Field((_type) => Number)
  @Column({ name: 'rest_between', type: 'int' })
  restBetween!: number;

  @Field((_type) => String)
  @Column({ type: 'text' })
  notes!: string;

  @Column({ name: 'exercise_id' })
  exerciseId!: number;

  @Column({ name: 'workout_id' })
  workoutId!: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.workoutExercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise!: Exercise;

  @ManyToOne(() => Workout, (workout) => workout.workoutExercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_id' })
  workout!: Workout;

  @OneToMany(() => WorkoutExerciseParam, (param) => param.workoutExercise)
  params!: Promise<WorkoutExerciseParam[]>;

  @OneToMany(() => PlanWorkoutExerciseOverride, (override) => override.workoutExercise)
  workoutPlanExerciseOverrides!: Promise<PlanWorkoutExerciseOverride[]>;
}
