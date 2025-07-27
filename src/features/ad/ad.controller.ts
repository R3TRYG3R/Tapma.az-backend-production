// src/features/ad/ad.controller.ts

import {
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  ParseIntPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import { AdsService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { AdWithUserDto } from './dto/ad-with-user.dto';
import { GetAdsQueryDto } from './dto/get-ad-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Ads')
@ApiBearerAuth('jwt')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new ad (max 5 per user)' })
  @ApiResponse({ status: 201, type: AdWithUserDto })
  async create(@Body() dto: CreateAdDto, @Req() req) {
    return this.adsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ads with optional title filter and pagination' })
  @ApiResponse({ status: 200, description: 'List of ads with pagination' })
  async findFiltered(@Query() query: GetAdsQueryDto) {
    return this.adsService.findFiltered(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: "Get current user's ads" })
  @ApiResponse({ status: 200, type: [AdWithUserDto] })
  async getMyAds(@Req() req) {
    return this.adsService.findMyAds(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ad by ID' })
  @ApiResponse({ status: 200, type: AdWithUserDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update ad (only owner)' })
  @ApiResponse({ status: 200, type: AdWithUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdDto,
    @Req() req,
  ) {
    return this.adsService.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete ad (only owner)' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.adsService.delete(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const uniqueName = `ad-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new Error('Only JPG, PNG, or WEBP files are allowed for ad images'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload ad image (only owner)' })
  @ApiResponse({ status: 200, type: AdWithUserDto })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.adsService.updateImage(id, file, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/image')
  @ApiOperation({ summary: 'Delete ad image (only owner)' })
  @ApiResponse({ status: 200, type: AdWithUserDto })
  async removeImage(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.adsService.removeImage(id, req.user);
  }
}