// src/features/users/users.controller.ts

import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  ForbiddenException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { Express } from 'express'

import { UsersService } from './users.service'
import { PublicUserDto } from './dto/public-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard'
import { RolesGuard } from '@/shared/guards/roles.guard'
import { Roles } from '@/shared/decorators/roles.decorator'
import { User } from '@/entities/user.entity'

@ApiTags('Users')
@ApiBearerAuth('jwt')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user by token' })
  @ApiResponse({ status: 200, type: PublicUserDto })
  async getMe(@Req() req) {
    const user = await this.usersService.findById(req.user.id)
    const isAdmin = req.user.role === 'admin'

    return plainToInstance(isAdmin ? User : PublicUserDto, user, {
      excludeExtraneousValues: true,
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, type: [PublicUserDto] })
  async findAll() {
    const users = await this.usersService.findAll()
    return users.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
    }))
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({ status: 200, type: PublicUserDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id)
    return {
      id: user.id,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update avatar by URL (protected)' })
  @ApiResponse({ status: 200, type: User })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    const isAdmin = req.user.role === 'admin'
    const isOwner = req.user.id === id

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only update your own profile')
    }

    const user = await this.usersService.update(id, dto)
    return plainToInstance(User, user, { excludeExtraneousValues: true })
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname)
          const uniqueName = `avatar-${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${ext}`
          cb(null, uniqueName)
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp|gif)$/)) {
          return cb(new Error('Only image files are allowed'), false)
        }
        cb(null, true)
      },
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
  @ApiOperation({ summary: 'Upload user avatar (protected)' })
  @ApiResponse({ status: 200, type: User })
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const protocol = req.protocol
    const host = req.get('host')
    const avatarUrl = `${protocol}://${host}/uploads/${file.filename}`

    const isAdmin = req.user.role === 'admin'
    const isOwner = req.user.id === id

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only update your own profile')
    }

    const user = await this.usersService.update(id, { avatarUrl })
    return plainToInstance(User, user, { excludeExtraneousValues: true })
  }
}