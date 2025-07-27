// src/features/ad/dto/create-ad.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdDto {
  @ApiProperty({ example: 'PlayStation 5' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Brand new console with two controllers' })
  @IsString()
  @IsNotEmpty()
  description: string;
}