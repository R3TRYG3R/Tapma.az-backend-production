// src/features/ad/ad.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Ad } from '@/entities/ad.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { GetAdsQueryDto } from './dto/get-ad-query.dto';
import { User } from '@/entities/user.entity';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { PaginationResult } from './types/pagination-result.interface';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepo: Repository<Ad>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Ad[]> {
    return this.adRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Ad> {
    const ad = await this.adRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!ad) throw new NotFoundException('Ad not found');
    return ad;
  }

  async create(userId: number, dto: CreateAdDto): Promise<Ad> {
    const count = await this.adRepo.count({
      where: { user: { id: userId } },
    });

    if (count >= 5) {
      throw new BadRequestException('Maximum 5 ads per user');
    }

    const user = await this.adRepo.manager.findOne(User, {
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ad = this.adRepo.create({
      ...dto,
      user,
    });

    return this.adRepo.save(ad);
  }

  async update(id: number, dto: UpdateAdDto, currentUser: any): Promise<Ad> {
    const ad = await this.findById(id);

    if (!ad.user) {
      throw new ForbiddenException('This ad has no owner');
    }

    if (
      String(ad.user.id) !== String(currentUser.id) &&
      currentUser.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only update/delete your own ads');
    }

    Object.assign(ad, dto);
    return this.adRepo.save(ad);
  }

  async findMyAds(userId: number): Promise<Ad[]> {
    return this.adRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: number, currentUser: any): Promise<void> {
    const ad = await this.findById(id);

    if (!ad.user) {
      throw new ForbiddenException('This ad has no owner');
    }

    if (
      String(ad.user.id) !== String(currentUser.id) &&
      currentUser.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only update/delete your own ads');
    }

    await this.tryDeleteFileByUrl(ad.imageUrl);
    await this.adRepo.remove(ad);
  }

  async updateImage(
    id: number,
    file: Express.Multer.File,
    currentUser: any,
  ): Promise<Ad> {
    const ad = await this.findById(id);

    if (!ad.user) {
      await this.tryDeleteFile(file.filename);
      throw new ForbiddenException('This ad has no owner');
    }

    if (
      String(ad.user.id) !== String(currentUser.id) &&
      currentUser.role !== 'admin'
    ) {
      await this.tryDeleteFile(file.filename);
      throw new ForbiddenException('You can only update/delete your own ads');
    }

    await this.tryDeleteFileByUrl(ad.imageUrl);

    const baseUrl = this.configService.get<string>('SERVER_PUBLIC_URL') || 'http://localhost:3000';
    ad.imageUrl = `${baseUrl}/uploads/${file.filename}`;

    return this.adRepo.save(ad);
  }

  async removeImage(id: number, currentUser: any): Promise<Ad> {
    const ad = await this.findById(id);

    if (!ad.user) {
      throw new ForbiddenException('This ad has no owner');
    }

    const isOwner = String(ad.user.id) === String(currentUser.id);
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only remove images from your own ads');
    }

    await this.tryDeleteFileByUrl(ad.imageUrl);
    ad.imageUrl = null;

    return this.adRepo.save(ad);
  }

  async findFiltered(query: GetAdsQueryDto): Promise<PaginationResult<Ad>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.adRepo.createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .orderBy('ad.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.search) {
      qb.andWhere('LOWER(ad.title) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      nextPage: total > page * limit ? page + 1 : null,
    };
  }

  private async tryDeleteFile(filename: string) {
    const filePath = join(__dirname, '..', '..', '..', 'uploads', filename);
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn(`⚠️ Failed to delete file: ${filePath}`, err.message);
    }
  }

  private async tryDeleteFileByUrl(fileUrl?: string | null) {
    if (!fileUrl) return;
    const baseUrl = this.configService.get<string>('SERVER_PUBLIC_URL') || 'http://localhost:3000';
    if (!fileUrl.startsWith(`${baseUrl}/uploads/`)) return;

    const filename = fileUrl.split('/uploads/')[1];
    await this.tryDeleteFile(filename);
  }
}