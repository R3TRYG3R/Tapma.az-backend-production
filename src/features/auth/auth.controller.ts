// src/features/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { PublicUserDto } from '@/features/users/dto/public-user.dto'
import { RateLimitInterceptor } from '@/shared/interceptors/rate-limit.interceptor'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(new RateLimitInterceptor(30))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered with JWT token',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(PublicUserDto) },
        token: { type: 'string' },
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  @UseInterceptors(new RateLimitInterceptor(5))
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'User logged in with JWT token',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(PublicUserDto) },
        token: { type: 'string' },
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
}