import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { TvService } from './tv.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateChannelDto,
  UpdateChannelDto,
  CreateChannelSourceDto,
  UpdateChannelSourceDto,
  QuickSwitchSourceDto,
  TestLinkDto,
} from './dto/tv.dto';

@Controller('tv')
export class TvController {
  constructor(private readonly tvService: TvService) {}

  /**
   * PUBLIC FEED FOR APK / FRONTEND CLIENTS
   */
  @Public()
  @Get('live')
  async getLiveFeed() {
    return this.tvService.getLiveFeed();
  }

  /**
   * ADMIN ENDPOINTS (Protected with JWT & ADMIN Role)
   */
  @Public()
  @Get('admin/stats')
  async getStats() {
    return this.tvService.getStats();
  }

  // CATEGORIES
  @Public()
  @Get('admin/categories')
  async getCategories() {
    return this.tvService.getCategories();
  }

  @Public()
  @Post('admin/categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.tvService.createCategory(dto);
  }

  @Public()
  @Put('admin/categories/:id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.tvService.updateCategory(id, dto);
  }

  @Public()
  @Delete('admin/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.tvService.deleteCategory(id);
  }

  // CHANNELS
  @Public()
  @Get('admin/channels')
  async getChannels(
    @Query('search') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('is_active') isActive?: string,
    @Query('format') format?: string,
    @Query('has_errors') hasErrors?: string,
    @Query('no_sources') noSources?: string,
  ) {
    return this.tvService.getChannels({
      search,
      categoryId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      format,
      hasErrors: hasErrors === 'true',
      noSources: noSources === 'true',
    });
  }

  @Public()
  @Post('admin/channels')
  async createChannel(@Body() dto: CreateChannelDto) {
    return this.tvService.createChannel(dto);
  }

  @Public()
  @Put('admin/channels/:id')
  async updateChannel(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.tvService.updateChannel(id, dto);
  }

  @Public()
  @Delete('admin/channels/:id')
  async deleteChannel(@Param('id') id: string) {
    return this.tvService.deleteChannel(id);
  }

  // CHANNEL SOURCES
  @Public()
  @Post('admin/sources')
  async addSource(@Request() req: any, @Body() dto: CreateChannelSourceDto) {
    return this.tvService.addSource(dto, req.user?.id);
  }

  @Public()
  @Put('admin/sources/:id')
  async updateSource(@Body() dto: UpdateChannelSourceDto, @Param('id') id: string) {
    return this.tvService.updateSource(id, dto);
  }

  @Public()
  @Delete('admin/sources/:id')
  async deleteSource(@Param('id') id: string) {
    return this.tvService.deleteSource(id);
  }

  // QUICK SWITCH SOURCE
  @Public()
  @Post('admin/sources/quick-switch')
  async quickSwitchSource(@Request() req: any, @Body() dto: QuickSwitchSourceDto) {
    return this.tvService.quickSwitchSource(dto, req.user?.id);
  }

  // LINK TESTING
  @Public()
  @Post('admin/sources/test')
  async testLink(@Body() dto: TestLinkDto) {
    return this.tvService.testLink(dto);
  }
}
