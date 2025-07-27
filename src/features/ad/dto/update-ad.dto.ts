// src/features/ad/dto/update-ad.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdDto {
  @ApiProperty({ example: 'PlayStation 5 Pro', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'New gen console with warranty', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}