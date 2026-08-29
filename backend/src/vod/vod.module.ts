import { Module } from '@nestjs/common';
import { VodController } from './vod.controller';
import { VodService } from './vod.service';
import { TvModule } from '../tv/tv.module';

@Module({
  imports: [TvModule],
  controllers: [VodController],
  providers: [VodService],
  exports: [VodService],
})
export class VodModule {}
