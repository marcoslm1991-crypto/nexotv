import { Controller, Post, Get, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { StreamsService } from './streams.service';
import { AuthorizeStreamDto } from './dto/authorize-stream.dto';
import { HeartbeatStreamDto } from './dto/heartbeat-stream.dto';
import { StopStreamDto } from './dto/stop-stream.dto';

@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Post('authorize')
  @HttpCode(HttpStatus.OK)
  async authorizeStream(@Request() req: any, @Body() dto: AuthorizeStreamDto) {
    return this.streamsService.authorizeStream(req.user.id, dto);
  }

  @Post('heartbeat')
  @HttpCode(HttpStatus.OK)
  async heartbeat(@Request() req: any, @Body() dto: HeartbeatStreamDto) {
    return this.streamsService.heartbeat(req.user.id, dto);
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  async stopStream(@Request() req: any, @Body() dto: StopStreamDto) {
    return this.streamsService.stopStream(req.user.id, dto);
  }

  @Get('active')
  async getActiveStreams(@Request() req: any) {
    return this.streamsService.getActiveStreamsForUser(req.user.id);
  }
}
