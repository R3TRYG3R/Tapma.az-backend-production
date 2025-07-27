// src/features/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '@/features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '@/features/users/dto/public-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findAll();
    if (existing.some((u) => u.email === dto.email)) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.usersService.create(dto);
    const token = this.generateToken(user.id, user.role);

    const responseUser =
      user.role === 'admin'
        ? user
        : plainToInstance(PublicUserDto, user, { excludeExtraneousValues: true });

    return { user: responseUser, token };
  }

  async login(dto: LoginDto) {
    const users = await this.usersService.findAll();
    const user = users.find((u) => u.email === dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    const token = this.generateToken(user.id, user.role);

    const responseUser =
      user.role === 'admin'
        ? user
        : plainToInstance(PublicUserDto, user, { excludeExtraneousValues: true });

    return { user: responseUser, token };
  }

  private generateToken(userId: number, role: 'user' | 'admin'): string {
    return this.jwtService.sign({ sub: userId, role });
  }
}