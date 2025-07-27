// src/entities/ad.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './user.entity'

@Entity('ads')
export class Ad {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column({ nullable: true, type: 'text' })
  imageUrl: string | null;

  @ManyToOne(() => User, (user) => user.ads, { onDelete: 'CASCADE' })
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}