import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { User } from '../users/user.entity';

@Injectable()
export class GoogleTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const user = await this.usersRepository.findOne({ where: { id: token } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return undefined;
    }

    return parts[1];
  }
}
