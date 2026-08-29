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
import { VodService } from './vod.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateMovieDto,
  UpdateMovieDto,
  CreateMovieSourceDto,
  UpdateMovieSourceDto,
  CreateSeriesDto,
  UpdateSeriesDto,
  CreateSeasonDto,
  UpdateSeasonDto,
  CreateEpisodeDto,
  UpdateEpisodeDto,
  CreateEpisodeSourceDto,
  UpdateEpisodeSourceDto,
} from './dto/vod.dto';
import { TestLinkDto } from '../tv/dto/tv.dto';

@Controller('vod')
export class VodController {
  constructor(private readonly vodService: VodService) {}

  /**
   * PUBLIC FEEDS FOR APK / CLIENTS
   */
  @Public()
  @Get('movies/feed')
  async getMoviesFeed() {
    return this.vodService.getMoviesFeed();
  }

  @Public()
  @Get('series/feed')
  async getSeriesFeed() {
    return this.vodService.getSeriesFeed();
  }

  /**
   * ADMIN ENDPOINTS (Protected with JWT & ADMIN Role)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  async getFullStats() {
    return this.vodService.getFullStats();
  }

  // MOVIES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/movies')
  async getMovies(
    @Query('search') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('genre') genre?: string,
    @Query('year') year?: string,
    @Query('is_active') isActive?: string,
    @Query('has_errors') hasErrors?: string,
    @Query('no_sources') noSources?: string,
  ) {
    return this.vodService.getMovies({
      search,
      categoryId,
      genre,
      year: year ? parseInt(year, 10) : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      hasErrors: hasErrors === 'true',
      noSources: noSources === 'true',
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/movies')
  async createMovie(@Body() dto: CreateMovieDto) {
    return this.vodService.createMovie(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/movies/:id')
  async updateMovie(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.vodService.updateMovie(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/movies/:id')
  async deleteMovie(@Param('id') id: string) {
    return this.vodService.deleteMovie(id);
  }

  // MOVIE SOURCES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/movies/sources')
  async addMovieSource(@Request() req: any, @Body() dto: CreateMovieSourceDto) {
    return this.vodService.addMovieSource(dto, req.user?.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/movies/sources/:id')
  async updateMovieSource(@Param('id') id: string, @Body() dto: UpdateMovieSourceDto) {
    return this.vodService.updateMovieSource(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/movies/sources/:id')
  async deleteMovieSource(@Param('id') id: string) {
    return this.vodService.deleteMovieSource(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/movies/sources/test')
  async testMovieSource(@Body() dto: TestLinkDto) {
    return this.vodService.testMovieSource(dto.source_id || '', dto.url, dto.format as any);
  }

  // SERIES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/series')
  async getSeries(
    @Query('search') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('genre') genre?: string,
    @Query('is_active') isActive?: string,
    @Query('no_episodes') noEpisodes?: string,
  ) {
    return this.vodService.getSeries({
      search,
      categoryId,
      genre,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      noEpisodes: noEpisodes === 'true',
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/series')
  async createSeries(@Body() dto: CreateSeriesDto) {
    return this.vodService.createSeries(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/series/:id')
  async updateSeries(@Param('id') id: string, @Body() dto: UpdateSeriesDto) {
    return this.vodService.updateSeries(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/series/:id')
  async deleteSeries(@Param('id') id: string) {
    return this.vodService.deleteSeries(id);
  }

  // SEASONS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/seasons')
  async addSeason(@Body() dto: CreateSeasonDto) {
    return this.vodService.addSeason(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/seasons/:id')
  async updateSeason(@Param('id') id: string, @Body() dto: UpdateSeasonDto) {
    return this.vodService.updateSeason(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/seasons/:id')
  async deleteSeason(@Param('id') id: string) {
    return this.vodService.deleteSeason(id);
  }

  // EPISODES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/episodes')
  async addEpisode(@Body() dto: CreateEpisodeDto) {
    return this.vodService.addEpisode(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/episodes/:id')
  async updateEpisode(@Param('id') id: string, @Body() dto: UpdateEpisodeDto) {
    return this.vodService.updateEpisode(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/episodes/:id')
  async deleteEpisode(@Param('id') id: string) {
    return this.vodService.deleteEpisode(id);
  }

  // EPISODE SOURCES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/episodes/sources')
  async addEpisodeSource(@Request() req: any, @Body() dto: CreateEpisodeSourceDto) {
    return this.vodService.addEpisodeSource(dto, req.user?.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/episodes/sources/:id')
  async updateEpisodeSource(@Param('id') id: string, @Body() dto: UpdateEpisodeSourceDto) {
    return this.vodService.updateEpisodeSource(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/episodes/sources/:id')
  async deleteEpisodeSource(@Param('id') id: string) {
    return this.vodService.deleteEpisodeSource(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/episodes/sources/test')
  async testEpisodeSource(@Body() dto: TestLinkDto) {
    return this.vodService.testEpisodeSource(dto.source_id || '', dto.url, dto.format as any);
  }
}
