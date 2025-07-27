// src/features/ad/ad.module.ts

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { Ad } from '@/entities/ad.entity'
import { User } from '@/entities/user.entity'
import { AdsService } from './ad.service'
import { AdsController } from './ad.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad, User]),
    ConfigModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}