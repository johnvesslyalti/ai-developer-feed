import { Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GoogleTokenGuard } from '../auth/google-token.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(GoogleTokenGuard)
  @Post('process')
  async process() {
    const result = await this.aiService.processUnsummarized();
    return result;
  }
}
