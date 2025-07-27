// src/features/users/dto/public-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PublicUserDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'JohnDoe' })
  @Expose()
  nickname: string;

  @ApiProperty({ example: 'https://i.imgur.com/avatar.png', required: false })
  @Expose()
  avatarUrl?: string;
}