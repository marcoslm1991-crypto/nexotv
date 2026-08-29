import { Controller, Post, Get, Body, Query, Request } from '@nestjs/common';
import { ContentService } from './content.service';
import { M3uParserService } from './m3u-parser.service';
import { SaveProgressDto } from './dto/save-progress.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly m3uParserService: M3uParserService,
  ) {}

  @Post('progress')
  async saveProgress(@Request() req: any, @Body() dto: SaveProgressDto) {
    return this.contentService.saveProgress(req.user.id, dto);
  }

  @Get('progress')
  async getProgress(
    @Request() req: any,
    @Query('profile_id') profileId: string,
    @Query('content_id') contentId: string,
  ) {
    return this.contentService.getProgress(req.user.id, profileId, contentId);
  }

  @Public()
  @Get('channels')
  async getChannels() {
    return this.contentService.getChannels();
  }

  @Public()
  @Post('import-m3u')
  async importM3u(@Body('m3u_text') m3uText: string) {
    return this.m3uParserService.importM3uToSupabase(m3uText);
  }
}
