// src/features/users/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Unique user email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'JohnDoe', description: 'Displayed nickname' })
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  nickname: string;

  @ApiProperty({ example: 'https://i.imgur.com/avatar.png', description: 'Profile avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}