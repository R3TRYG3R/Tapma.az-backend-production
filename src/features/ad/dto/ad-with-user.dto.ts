// src/features/ad/dto/ad-with-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PublicUserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty({ required: false })
  @Expose()
  avatarUrl?: string;
}

export class AdWithUserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ required: false })
  @Expose()
  imageUrl?: string;

  @ApiProperty({ type: () => PublicUserDto })
  @Expose()
  @Type(() => PublicUserDto)
  user: PublicUserDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}