import { Controller, Post } from '@nestjs/common';
import { ScraperService, ScrapeResult } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('run')
  async run(): Promise<{ saved: ScrapeResult }> {
    const results = await this.scraperService.scrapeAll();
    return { saved: results };
  }
}
