// src/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Ad } from './ad.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  nickname: string

  @Column({ nullable: true })
  avatarUrl?: string

  @Column({ default: 'user' })
  role: 'user' | 'admin'

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Ad, (ad) => ad.user, { cascade: true })
  ads: Ad[]
}