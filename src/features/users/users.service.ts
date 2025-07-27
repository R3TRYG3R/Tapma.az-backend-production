// src/features/users/users.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    const currentAvatar = user.avatarUrl;
    const newAvatar = dto.avatarUrl;

    const isAvatarChanged = !!newAvatar && newAvatar !== currentAvatar;
    const isLocalAvatar = !!currentAvatar && currentAvatar.startsWith('http://localhost:3000/uploads/');

    if (isAvatarChanged && isLocalAvatar) {
      const filename = currentAvatar.split('/uploads/')[1];
      const filePath = join(__dirname, '..', '..', '..', 'uploads', filename);

      try {
        await unlink(filePath);
      } catch (err) {
        console.warn(`⚠️ Failed to delete old avatar: ${filePath}`, err.message);
      }
    }

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async updateAvatar(id: number, file: Express.Multer.File, currentUser: any): Promise<User> {
    const user = await this.findById(id);

    if (String(user.id) !== String(currentUser.id) && currentUser.role !== 'admin') {
      await this.tryDeleteFile(file.filename);
      throw new ForbiddenException('You cannot upload avatar for another user');
    }

    await this.tryDeleteFileByUrl(user.avatarUrl);

    user.avatarUrl = `http://localhost:3000/uploads/${file.filename}`;
    return this.userRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);
    await this.userRepo.delete(id);
  }

  private async tryDeleteFile(filename: string) {
    const filePath = join(__dirname, '..', '..', '..', 'uploads', filename);
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn(`⚠️ Failed to delete file: ${filePath}`, err.message);
    }
  }

  private async tryDeleteFileByUrl(fileUrl?: string) {
    if (!fileUrl?.startsWith('http://localhost:3000/uploads/')) return;
    const filename = fileUrl.split('/uploads/')[1];
    await this.tryDeleteFile(filename);
  }
}