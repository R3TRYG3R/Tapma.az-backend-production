// src/features/users/dto/update-user.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'https://i.imgur.com/new-avatar.png',
    description: 'Avatar image URL',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}