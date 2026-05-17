import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { GoogleTokenGuard } from '../auth/google-token.guard';
import { UsersService } from './users.service';
import type { User } from '../db/schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('interests')
  @UseGuards(GoogleTokenGuard)
  async saveInterests(@Req() req: Request, @Body() body: { tags: string[] }) {
    const user = req.user as User;
    await this.usersService.saveInterests(user.id, body.tags ?? []);
    return { ok: true };
  }
}
