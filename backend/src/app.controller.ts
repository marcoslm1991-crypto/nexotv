import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getApiHealth() {
    return {
      service: 'NexoTV API Backend',
      status: 'ONLINE',
      version: '1.0.0',
      database: 'CONNECTED (Supabase PostgreSQL)',
      timestamp: new Date().toISOString(),
      public_endpoints: {
        tv_live_feed: '/api/v1/tv/live',
        movies_feed: '/api/v1/vod/movies/feed',
        series_feed: '/api/v1/vod/series/feed',
      },
    };
  }
}
