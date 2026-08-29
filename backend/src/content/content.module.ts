import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { M3uParserService } from './m3u-parser.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContentController],
  providers: [ContentService, M3uParserService],
  exports: [ContentService, M3uParserService],
})
export class ContentModule {}
