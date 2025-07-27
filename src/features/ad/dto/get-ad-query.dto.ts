// src/features/ad/dto/get-ad-query.dto.ts

import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAdsQueryDto {
  @ApiPropertyOptional({ description: 'Search in ad title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}