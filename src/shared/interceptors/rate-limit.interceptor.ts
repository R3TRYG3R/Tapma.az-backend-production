// src/shared/interceptors/rate-limit.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs'

const ipTimestamps = new Map<string, number>()

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private readonly seconds: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const ip = request.ip || request.connection.remoteAddress

    const now = Date.now()
    const lastAttempt = ipTimestamps.get(ip)
    const limitMs = this.seconds * 1000

    if (lastAttempt && now - lastAttempt < limitMs) {
      throw new HttpException(
        'Too many attempts. Please wait a few seconds.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    ipTimestamps.set(ip, now)
    return next.handle()
  }
}