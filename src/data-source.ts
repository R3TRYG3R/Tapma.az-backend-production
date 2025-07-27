// src/data-source.ts

import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Ad } from './entities/ad.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DATABASE_URL,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(DATABASE_URL
    ? { url: DATABASE_URL }
    : {
        host: DB_HOST,
        port: Number(DB_PORT),
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
      }),
  entities: [User, Ad],
  migrations: ['dist/migrations/*.js'],
});