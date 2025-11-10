import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Entity } from '../../entity-management/decorators/entity.decorator';

@Entity()
export class VerificationToken {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Column({ type: 'varchar', length: 255 })
  identifier!: string;

  @Column({ type: 'varchar', length: 255 })
  value!: string;

  @Column({ name: 'expires_at', type: 'datetime' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
