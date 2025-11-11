import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Entity } from '@entity-management/decorators/entity.decorator';

import { User } from '@entities/user/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'access_token', type: 'varchar', length: 255, nullable: true })
  accessToken?: string | null;

  @Column({ name: 'refresh_token', type: 'varchar', length: 255, nullable: true })
  refreshToken?: string | null;

  @Column({ name: 'id_token', type: 'varchar', length: 255, nullable: true })
  idToken?: string | null;

  @Column({ name: 'access_token_expires_at', type: 'datetime', nullable: true })
  accessTokenExpiresAt?: string | null;

  @Column({ name: 'refresh_token_expires_at', type: 'datetime', nullable: true })
  refreshTokenExpiresAt?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  scope?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'account_id', type: 'varchar', length: 255 })
  accountId!: string;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId!: string;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
