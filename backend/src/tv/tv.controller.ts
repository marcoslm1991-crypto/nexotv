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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  async getStats() {
    return this.tvService.getStats();
  }

  // CATEGORIES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/categories')
  async getCategories() {
    return this.tvService.getCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.tvService.createCategory(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/categories/:id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.tvService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.tvService.deleteCategory(id);
  }

  // CHANNELS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/channels')
  async createChannel(@Body() dto: CreateChannelDto) {
    return this.tvService.createChannel(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/channels/:id')
  async updateChannel(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.tvService.updateChannel(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/channels/:id')
  async deleteChannel(@Param('id') id: string) {
    return this.tvService.deleteChannel(id);
  }

  // CHANNEL SOURCES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/sources')
  async addSource(@Request() req: any, @Body() dto: CreateChannelSourceDto) {
    return this.tvService.addSource(dto, req.user?.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/sources/:id')
  async updateSource(@Body() dto: UpdateChannelSourceDto, @Param('id') id: string) {
    return this.tvService.updateSource(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/sources/:id')
  async deleteSource(@Param('id') id: string) {
    return this.tvService.deleteSource(id);
  }

  // QUICK SWITCH SOURCE
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/sources/quick-switch')
  async quickSwitchSource(@Request() req: any, @Body() dto: QuickSwitchSourceDto) {
    return this.tvService.quickSwitchSource(dto, req.user?.id);
  }

  // LINK TESTING
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/sources/test')
  async testLink(@Body() dto: TestLinkDto) {
    return this.tvService.testLink(dto);
  }
}
