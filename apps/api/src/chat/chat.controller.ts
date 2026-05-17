import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { GoogleTokenGuard } from '../auth/google-token.guard';
import { UserThrottlerGuard } from '../common/guards/user-throttler.guard';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import type { User } from '../db/schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(GoogleTokenGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async chat(@Req() req: Request, @Body() body: ChatDto) {
    const user = req.user as User;
    return this.chatService.query(user.id, body.message);
  }
}
