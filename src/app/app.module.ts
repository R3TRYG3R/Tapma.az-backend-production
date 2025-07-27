// src/app/app.module.ts

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { UsersModule } from '@/features/users/users.module'
import { AuthModule } from '@/features/auth/auth.module'
import { AdsModule } from '@/features/ad/ad.module'

import { User } from '@/entities/user.entity'
import { Ad } from '@/entities/ad.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const entities = [User, Ad];

        const baseOptions: TypeOrmModuleOptions = {
          type: 'postgres',
          autoLoadEntities: false,
          synchronize: false,
          migrations: ['dist/migrations/*.js'],
          migrationsRun: true,
          entities,
        };

        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            ...baseOptions,
            url: databaseUrl,
          };
        }

        return {
          ...baseOptions,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
        };
      },
    }),

    UsersModule,
    AuthModule,
    AdsModule,
  ],
})
export class AppModule {}