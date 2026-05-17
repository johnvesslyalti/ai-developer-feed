import { Controller, Post, UseGuards } from '@nestjs/common';
import { ScraperService, ScrapeResult } from './scraper.service';
import { GoogleTokenGuard } from '../auth/google-token.guard';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @UseGuards(GoogleTokenGuard)
  @Post('run')
  async run(): Promise<{ saved: ScrapeResult }> {
    const results = await this.scraperService.scrapeAll();
    return { saved: results };
  }
}
