import { Module } from '@nestjs/common';
import { TvController } from './tv.controller';
import { TvService } from './tv.service';
import { LinkTesterService } from './link-tester.service';

@Module({
  controllers: [TvController],
  providers: [TvService, LinkTesterService],
  exports: [TvService, LinkTesterService],
})
export class TvModule {}
