import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LinkTesterService } from '../tv/link-tester.service';
import { StreamFormat, FullContentStatsDto, StreamTestResultDto } from '../common/types';
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

@Injectable()
export class VodService {
  private readonly logger = new Logger(VodService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly linkTesterService: LinkTesterService,
  ) {}

  /**
   * Seed sample Movies and Series if empty
   */
  async ensureSeedData() {
    const movieCount = await this.prisma.movie.count();
    if (movieCount > 0) return;

    this.logger.log('Seeding initial Movies and Series catalog...');

    // Seed Movies
    const m1 = await this.prisma.movie.create({
      data: {
        title: 'John Wick: Otro Día para Matar',
        original_title: 'John Wick',
        genre: 'Acción',
        year: 2014,
        duration: '1h 41m',
        rating: 'IMDb 7.4',
        synopsis: 'Un exasesino a sueldo sale de su retiro para buscar a los gánsteres que le quitaron todo.',
        poster_url: 'https://images.justwatch.com/poster/176378411/s718/john-wick.f4v',
        poster_emoji: '🎬',
        is_active: true,
        sort_order: 1,
      },
    });

    await this.prisma.movieSource.createMany({
      data: [
        {
          movie_id: m1.id,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          format: 'MP4',
          is_active: true,
          priority: 1,
          last_status: 'WORKING',
          last_http_code: 200,
          last_response_time: 140,
        },
      ],
    });

    const m2 = await this.prisma.movie.create({
      data: {
        title: 'Duna: Parte Dos',
        original_title: 'Dune: Part Two',
        genre: 'Ciencia Ficción',
        year: 2024,
        duration: '2h 46m',
        rating: 'IMDb 8.6',
        synopsis: 'Paul Atreides se une a Chani y los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
        poster_url: 'https://images.justwatch.com/poster/312015383/s718/dune-part-two.f4v',
        poster_emoji: '🏜️',
        is_active: true,
        sort_order: 2,
      },
    });

    await this.prisma.movieSource.create({
      data: {
        movie_id: m2.id,
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        format: 'HLS',
        is_active: true,
        priority: 1,
        last_status: 'WORKING',
        last_http_code: 200,
        last_response_time: 110,
      },
    });

    // Seed Series
    const s1 = await this.prisma.series.create({
      data: {
        title: 'The Walking Dead',
        genre: 'Drama / Terror',
        year: 2010,
        rating: 'IMDb 8.1',
        synopsis: 'El sheriff Rick Grimes se despierta de un coma y lidera a un grupo de sobrevivientes en un mundo apocalíptico.',
        poster_url: 'https://images.justwatch.com/poster/8636181/s718/the-walking-dead.f4v',
        poster_emoji: '🧟',
        is_active: true,
        sort_order: 1,
      },
    });

    const season1 = await this.prisma.season.create({
      data: {
        series_id: s1.id,
        season_number: 1,
        title: 'Temporada 1',
        is_active: true,
        sort_order: 1,
      },
    });

    const ep1 = await this.prisma.episode.create({
      data: {
        season_id: season1.id,
        episode_number: 1,
        title: 'Días Transcurridos',
        duration: '1h 07m',
        synopsis: 'El oficial Rick Grimes despierta en un hospital abandonado rodeado de caminantes.',
        is_active: true,
        sort_order: 1,
      },
    });

    await this.prisma.episodeSource.create({
      data: {
        episode_id: ep1.id,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        format: 'MP4',
        is_active: true,
        priority: 1,
        last_status: 'WORKING',
        last_http_code: 200,
        last_response_time: 165,
      },
    });

    this.logger.log('Initial VOD catalog seeded.');
  }

  /**
   * MOVIES CRUD
   */
  async getMovies(filters?: {
    search?: string;
    categoryId?: string;
    genre?: string;
    year?: number;
    isActive?: boolean;
    hasErrors?: boolean;
    noSources?: boolean;
  }) {
    await this.ensureSeedData();

    const movies = await this.prisma.movie.findMany({
      include: {
        category: true,
        sources: {
          orderBy: { priority: 'asc' },
        },
      },
      orderBy: [{ sort_order: 'asc' }, { title: 'asc' }],
    });

    let result = movies.map((m) => {
      const sources = m.sources.map((s) => ({
        ...s,
        format: s.format as StreamFormat,
        last_status: s.last_status as any,
        created_at: s.created_at.toISOString(),
        updated_at: s.updated_at.toISOString(),
        last_checked_at: s.last_checked_at ? s.last_checked_at.toISOString() : null,
      }));

      const activeSource = sources.find((s) => s.is_active) || null;

      return {
        id: m.id,
        title: m.title,
        original_title: m.original_title,
        category_id: m.category_id,
        category_name: m.category?.name || m.category_name || 'Sin Categoría',
        genre: m.genre,
        year: m.year,
        duration: m.duration,
        rating: m.rating,
        synopsis: m.synopsis,
        poster_url: m.poster_url,
        backdrop_url: m.backdrop_url,
        poster_emoji: m.poster_emoji,
        stream_url: activeSource?.url || m.stream_url || null,
        is_active: m.is_active,
        sort_order: m.sort_order,
        created_at: m.created_at.toISOString(),
        updated_at: m.updated_at.toISOString(),
        sources,
        active_source: activeSource,
      };
    });

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          (m.original_title && m.original_title.toLowerCase().includes(query)) ||
          m.id.toLowerCase().includes(query),
      );
    }

    if (filters?.categoryId && filters.categoryId !== 'ALL') {
      result = result.filter((m) => m.category_id === filters.categoryId);
    }

    if (filters?.genre && filters.genre !== 'ALL') {
      result = result.filter((m) => m.genre?.toLowerCase() === filters.genre?.toLowerCase());
    }

    if (filters?.year) {
      result = result.filter((m) => m.year === filters.year);
    }

    if (filters?.isActive !== undefined) {
      result = result.filter((m) => m.is_active === filters.isActive);
    }

    if (filters?.hasErrors) {
      result = result.filter((m) =>
        m.sources.some((s) => s.last_status === 'ERROR' || s.last_status === 'UNAVAILABLE'),
      );
    }

    if (filters?.noSources) {
      result = result.filter((m) => !m.active_source);
    }

    return result;
  }

  async getMovieById(id: string) {
    const movies = await this.getMovies();
    const movie = movies.find((m) => m.id === id);
    if (!movie) throw new NotFoundException('Película no encontrada.');
    return movie;
  }

  async createMovie(dto: CreateMovieDto) {
    let categoryName = null;
    if (dto.category_id) {
      const cat = await this.prisma.category.findUnique({ where: { id: dto.category_id } });
      if (cat) categoryName = cat.name;
    }

    const movie = await this.prisma.movie.create({
      data: {
        title: dto.title,
        original_title: dto.original_title || null,
        category_id: dto.category_id || null,
        category_name: categoryName,
        genre: dto.genre || null,
        year: dto.year ?? 2026,
        duration: dto.duration || '2h 00m',
        rating: dto.rating || 'IMDb 8.0',
        synopsis: dto.synopsis || null,
        poster_url: dto.poster_url || null,
        backdrop_url: dto.backdrop_url || null,
        is_active: dto.is_active ?? true,
        sort_order: dto.sort_order ?? 0,
      },
    });

    if (dto.initial_source_url) {
      await this.prisma.movieSource.create({
        data: {
          movie_id: movie.id,
          url: dto.initial_source_url,
          format: dto.initial_source_format || this.linkTesterService.detectFormat(dto.initial_source_url),
          is_active: true,
          priority: 1,
        },
      });
    }

    return this.getMovieById(movie.id);
  }

  async updateMovie(id: string, dto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('Película no encontrada.');

    let categoryName = movie.category_name;
    if (dto.category_id && dto.category_id !== movie.category_id) {
      const cat = await this.prisma.category.findUnique({ where: { id: dto.category_id } });
      if (cat) categoryName = cat.name;
    }

    await this.prisma.movie.update({
      where: { id },
      data: {
        title: dto.title ?? movie.title,
        original_title: dto.original_title !== undefined ? dto.original_title : movie.original_title,
        category_id: dto.category_id !== undefined ? dto.category_id : movie.category_id,
        category_name: categoryName,
        genre: dto.genre !== undefined ? dto.genre : movie.genre,
        year: dto.year ?? movie.year,
        duration: dto.duration ?? movie.duration,
        rating: dto.rating ?? movie.rating,
        synopsis: dto.synopsis !== undefined ? dto.synopsis : movie.synopsis,
        poster_url: dto.poster_url !== undefined ? dto.poster_url : movie.poster_url,
        backdrop_url: dto.backdrop_url !== undefined ? dto.backdrop_url : movie.backdrop_url,
        is_active: dto.is_active ?? movie.is_active,
        sort_order: dto.sort_order ?? movie.sort_order,
      },
    });

    return this.getMovieById(id);
  }

  async deleteMovie(id: string) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('Película no encontrada.');

    await this.prisma.movie.delete({ where: { id } });
    return { success: true, message: `Película "${movie.title}" eliminada.` };
  }

  /**
   * MOVIE SOURCES CRUD
   */
  async addMovieSource(dto: CreateMovieSourceDto, userId?: string) {
    const format = dto.format || this.linkTesterService.detectFormat(dto.url);
    const priority = dto.priority ?? 1;

    if (dto.is_active !== false && priority === 1) {
      const existing = await this.prisma.movieSource.findMany({
        where: { movie_id: dto.movie_id, priority: 1 },
      });
      for (const s of existing) {
        await this.prisma.movieSource.update({ where: { id: s.id }, data: { priority: s.priority + 1 } });
      }
    }

    const source = await this.prisma.movieSource.create({
      data: {
        movie_id: dto.movie_id,
        url: dto.url,
        format,
        is_active: dto.is_active ?? true,
        priority,
        created_by_user_id: userId || null,
      },
    });

    await this.testMovieSource(source.id, source.url, source.format as StreamFormat);
    return this.getMovieById(dto.movie_id);
  }

  async updateMovieSource(id: string, dto: UpdateMovieSourceDto) {
    const source = await this.prisma.movieSource.findUnique({ where: { id } });
    if (!source) throw new NotFoundException('Fuente de película no encontrada.');

    await this.prisma.movieSource.update({
      where: { id },
      data: {
        url: dto.url ?? source.url,
        format: dto.format ?? source.format,
        is_active: dto.is_active ?? source.is_active,
        priority: dto.priority ?? source.priority,
      },
    });

    return this.getMovieById(source.movie_id);
  }

  async deleteMovieSource(id: string) {
    const source = await this.prisma.movieSource.findUnique({ where: { id } });
    if (!source) throw new NotFoundException('Fuente de película no encontrada.');

    await this.prisma.movieSource.delete({ where: { id } });
    return this.getMovieById(source.movie_id);
  }

  async testMovieSource(sourceId: string, url?: string, format?: StreamFormat): Promise<StreamTestResultDto> {
    const source = await this.prisma.movieSource.findUnique({ where: { id: sourceId } });
    const targetUrl = url || source?.url;
    if (!targetUrl) throw new BadRequestException('URL inválida.');

    const result = await this.linkTesterService.testLink(targetUrl, format || (source?.format as StreamFormat));

    if (source) {
      await this.prisma.movieSource.update({
        where: { id: sourceId },
        data: {
          last_checked_at: new Date(result.checked_at),
          last_status: result.status,
          last_http_code: result.http_code,
          last_response_time: result.response_time_ms,
          last_error_message: result.error_message || null,
        },
      });
    }

    return result;
  }

  /**
   * SERIES, SEASONS & EPISODES CRUD
   */
  async getSeries(filters?: {
    search?: string;
    categoryId?: string;
    genre?: string;
    year?: number;
    isActive?: boolean;
    noEpisodes?: boolean;
  }) {
    await this.ensureSeedData();

    const seriesList = await this.prisma.series.findMany({
      include: {
        category: true,
        seasons: {
          orderBy: { season_number: 'asc' },
          include: {
            episodes: {
              orderBy: { episode_number: 'asc' },
              include: {
                sources: { orderBy: { priority: 'asc' } },
              },
            },
          },
        },
      },
      orderBy: [{ sort_order: 'asc' }, { title: 'asc' }],
    });

    let result = seriesList.map((s) => {
      const seasons = s.seasons.map((se) => ({
        id: se.id,
        series_id: se.series_id,
        season_number: se.season_number,
        title: se.title || `Temporada ${se.season_number}`,
        is_active: se.is_active,
        sort_order: se.sort_order,
        created_at: se.created_at.toISOString(),
        episodes: se.episodes.map((ep) => {
          const sources = ep.sources.map((src) => ({
            ...src,
            format: src.format as StreamFormat,
            last_status: src.last_status as any,
            created_at: src.created_at.toISOString(),
            updated_at: src.updated_at.toISOString(),
            last_checked_at: src.last_checked_at ? src.last_checked_at.toISOString() : null,
          }));
          const activeSource = sources.find((src) => src.is_active) || null;

          return {
            id: ep.id,
            season_id: ep.season_id,
            episode_number: ep.episode_number,
            title: ep.title,
            duration: ep.duration,
            synopsis: ep.synopsis,
            thumbnail_url: ep.thumbnail_url,
            stream_url: activeSource?.url || ep.stream_url || null,
            is_active: ep.is_active,
            sort_order: ep.sort_order,
            created_at: ep.created_at.toISOString(),
            updated_at: ep.updated_at.toISOString(),
            sources,
            active_source: activeSource,
          };
        }),
      }));

      const totalEpisodes = seasons.reduce((acc, se) => acc + se.episodes.length, 0);

      return {
        id: s.id,
        title: s.title,
        original_title: s.original_title,
        category_id: s.category_id,
        category_name: s.category?.name || s.category_name || 'Sin Categoría',
        genre: s.genre,
        year: s.year,
        rating: s.rating,
        synopsis: s.synopsis,
        poster_url: s.poster_url,
        backdrop_url: s.backdrop_url,
        poster_emoji: s.poster_emoji,
        is_active: s.is_active,
        sort_order: s.sort_order,
        created_at: s.created_at.toISOString(),
        updated_at: s.updated_at.toISOString(),
        seasons,
        seasons_count: seasons.length,
        episodes_count: totalEpisodes,
      };
    });

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          (s.original_title && s.original_title.toLowerCase().includes(query)) ||
          s.id.toLowerCase().includes(query),
      );
    }

    if (filters?.categoryId && filters.categoryId !== 'ALL') {
      result = result.filter((s) => s.category_id === filters.categoryId);
    }

    if (filters?.genre && filters.genre !== 'ALL') {
      result = result.filter((s) => s.genre?.toLowerCase() === filters.genre?.toLowerCase());
    }

    if (filters?.isActive !== undefined) {
      result = result.filter((s) => s.is_active === filters.isActive);
    }

    if (filters?.noEpisodes) {
      result = result.filter((s) => s.episodes_count === 0);
    }

    return result;
  }

  async getSeriesById(id: string) {
    const list = await this.getSeries();
    const s = list.find((item) => item.id === id);
    if (!s) throw new NotFoundException('Serie no encontrada.');
    return s;
  }

  async createSeries(dto: CreateSeriesDto) {
    let categoryName = null;
    if (dto.category_id) {
      const cat = await this.prisma.category.findUnique({ where: { id: dto.category_id } });
      if (cat) categoryName = cat.name;
    }

    const series = await this.prisma.series.create({
      data: {
        title: dto.title,
        original_title: dto.original_title || null,
        category_id: dto.category_id || null,
        category_name: categoryName,
        genre: dto.genre || null,
        year: dto.year ?? 2026,
        rating: dto.rating || 'IMDb 8.0',
        synopsis: dto.synopsis || null,
        poster_url: dto.poster_url || null,
        backdrop_url: dto.backdrop_url || null,
        is_active: dto.is_active ?? true,
        sort_order: dto.sort_order ?? 0,
      },
    });

    return this.getSeriesById(series.id);
  }

  async updateSeries(id: string, dto: UpdateSeriesDto) {
    const series = await this.prisma.series.findUnique({ where: { id } });
    if (!series) throw new NotFoundException('Serie no encontrada.');

    await this.prisma.series.update({
      where: { id },
      data: {
        title: dto.title ?? series.title,
        original_title: dto.original_title !== undefined ? dto.original_title : series.original_title,
        category_id: dto.category_id !== undefined ? dto.category_id : series.category_id,
        genre: dto.genre !== undefined ? dto.genre : series.genre,
        year: dto.year ?? series.year,
        rating: dto.rating ?? series.rating,
        synopsis: dto.synopsis !== undefined ? dto.synopsis : series.synopsis,
        poster_url: dto.poster_url !== undefined ? dto.poster_url : series.poster_url,
        backdrop_url: dto.backdrop_url !== undefined ? dto.backdrop_url : series.backdrop_url,
        is_active: dto.is_active ?? series.is_active,
        sort_order: dto.sort_order ?? series.sort_order,
      },
    });

    return this.getSeriesById(id);
  }

  async deleteSeries(id: string) {
    const series = await this.prisma.series.findUnique({ where: { id } });
    if (!series) throw new NotFoundException('Serie no encontrada.');

    await this.prisma.series.delete({ where: { id } });
    return { success: true, message: `Serie "${series.title}" eliminada.` };
  }

  // SEASONS
  async addSeason(dto: CreateSeasonDto) {
    const season = await this.prisma.season.create({
      data: {
        series_id: dto.series_id,
        season_number: dto.season_number,
        title: dto.title || `Temporada ${dto.season_number}`,
        is_active: dto.is_active ?? true,
        sort_order: dto.sort_order ?? dto.season_number,
      },
    });

    return this.getSeriesById(dto.series_id);
  }

  async updateSeason(id: string, dto: UpdateSeasonDto) {
    const season = await this.prisma.season.findUnique({ where: { id } });
    if (!season) throw new NotFoundException('Temporada no encontrada.');

    await this.prisma.season.update({
      where: { id },
      data: {
        season_number: dto.season_number ?? season.season_number,
        title: dto.title ?? season.title,
        is_active: dto.is_active ?? season.is_active,
        sort_order: dto.sort_order ?? season.sort_order,
      },
    });

    return this.getSeriesById(season.series_id);
  }

  async deleteSeason(id: string) {
    const season = await this.prisma.season.findUnique({ where: { id } });
    if (!season) throw new NotFoundException('Temporada no encontrada.');

    await this.prisma.season.delete({ where: { id } });
    return this.getSeriesById(season.series_id);
  }

  // EPISODES & EPISODE SOURCES
  async addEpisode(dto: CreateEpisodeDto) {
    const season = await this.prisma.season.findUnique({ where: { id: dto.season_id } });
    if (!season) throw new BadRequestException('Temporada no encontrada.');

    const episode = await this.prisma.episode.create({
      data: {
        season_id: dto.season_id,
        episode_number: dto.episode_number,
        title: dto.title,
        duration: dto.duration || '45m',
        synopsis: dto.synopsis || null,
        thumbnail_url: dto.thumbnail_url || null,
        is_active: dto.is_active ?? true,
        sort_order: dto.sort_order ?? dto.episode_number,
      },
    });

    if (dto.initial_source_url) {
      await this.prisma.episodeSource.create({
        data: {
          episode_id: episode.id,
          url: dto.initial_source_url,
          format: dto.initial_source_format || this.linkTesterService.detectFormat(dto.initial_source_url),
          is_active: true,
          priority: 1,
        },
      });
    }

    return this.getSeriesById(season.series_id);
  }

  async updateEpisode(id: string, dto: UpdateEpisodeDto) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { season: true },
    });
    if (!episode) throw new NotFoundException('Episodio no encontrado.');

    await this.prisma.episode.update({
      where: { id },
      data: {
        episode_number: dto.episode_number ?? episode.episode_number,
        title: dto.title ?? episode.title,
        duration: dto.duration ?? episode.duration,
        synopsis: dto.synopsis !== undefined ? dto.synopsis : episode.synopsis,
        thumbnail_url: dto.thumbnail_url !== undefined ? dto.thumbnail_url : episode.thumbnail_url,
        is_active: dto.is_active ?? episode.is_active,
        sort_order: dto.sort_order ?? episode.sort_order,
      },
    });

    return this.getSeriesById(episode.season.series_id);
  }

  async deleteEpisode(id: string) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { season: true },
    });
    if (!episode) throw new NotFoundException('Episodio no encontrado.');

    await this.prisma.episode.delete({ where: { id } });
    return this.getSeriesById(episode.season.series_id);
  }

  async addEpisodeSource(dto: CreateEpisodeSourceDto, userId?: string) {
    const format = dto.format || this.linkTesterService.detectFormat(dto.url);
    const priority = dto.priority ?? 1;

    if (dto.is_active !== false && priority === 1) {
      const existing = await this.prisma.episodeSource.findMany({
        where: { episode_id: dto.episode_id, priority: 1 },
      });
      for (const s of existing) {
        await this.prisma.episodeSource.update({ where: { id: s.id }, data: { priority: s.priority + 1 } });
      }
    }

    const source = await this.prisma.episodeSource.create({
      data: {
        episode_id: dto.episode_id,
        url: dto.url,
        format,
        is_active: dto.is_active ?? true,
        priority,
        created_by_user_id: userId || null,
      },
    });

    await this.testEpisodeSource(source.id, source.url, source.format as StreamFormat);

    const episode = await this.prisma.episode.findUnique({
      where: { id: dto.episode_id },
      include: { season: true },
    });
    return this.getSeriesById(episode!.season.series_id);
  }

  async updateEpisodeSource(id: string, dto: UpdateEpisodeSourceDto) {
    const source = await this.prisma.episodeSource.findUnique({
      where: { id },
      include: { episode: { include: { season: true } } },
    });
    if (!source) throw new NotFoundException('Fuente de episodio no encontrada.');

    await this.prisma.episodeSource.update({
      where: { id },
      data: {
        url: dto.url ?? source.url,
        format: dto.format ?? source.format,
        is_active: dto.is_active ?? source.is_active,
        priority: dto.priority ?? source.priority,
      },
    });

    return this.getSeriesById(source.episode.season.series_id);
  }

  async deleteEpisodeSource(id: string) {
    const source = await this.prisma.episodeSource.findUnique({
      where: { id },
      include: { episode: { include: { season: true } } },
    });
    if (!source) throw new NotFoundException('Fuente de episodio no encontrada.');

    await this.prisma.episodeSource.delete({ where: { id } });
    return this.getSeriesById(source.episode.season.series_id);
  }

  async testEpisodeSource(sourceId: string, url?: string, format?: StreamFormat): Promise<StreamTestResultDto> {
    const source = await this.prisma.episodeSource.findUnique({ where: { id: sourceId } });
    const targetUrl = url || source?.url;
    if (!targetUrl) throw new BadRequestException('URL inválida.');

    const result = await this.linkTesterService.testLink(targetUrl, format || (source?.format as StreamFormat));

    if (source) {
      await this.prisma.episodeSource.update({
        where: { id: sourceId },
        data: {
          last_checked_at: new Date(result.checked_at),
          last_status: result.status,
          last_http_code: result.http_code,
          last_response_time: result.response_time_ms,
          last_error_message: result.error_message || null,
        },
      });
    }

    return result;
  }

  /**
   * UNIFIED CONTENT DASHBOARD STATS
   */
  async getFullStats(): Promise<FullContentStatsDto> {
    await this.ensureSeedData();

    // TV Stats
    const tvCategories = await this.prisma.category.count();
    const tvChannels = await this.prisma.channel.count();
    const tvActiveChannels = await this.prisma.channel.count({ where: { is_active: true } });
    const tvSources = await this.prisma.channelSource.findMany();
    const tvWorkingSources = tvSources.filter((s) => s.last_status === 'WORKING').length;
    const tvErrorSources = tvSources.filter((s) => s.last_status === 'ERROR' || s.last_status === 'UNAVAILABLE').length;

    // Movies Stats
    const movies = await this.prisma.movie.findMany({ include: { sources: true } });
    const moviesTotal = movies.length;
    const moviesActive = movies.filter((m) => m.is_active).length;
    const moviesInactive = moviesTotal - moviesActive;
    const moviesWithoutSource = movies.filter((m) => !m.sources.some((s) => s.is_active)).length;
    const movieSources = await this.prisma.movieSource.findMany();
    const moviesWorkingSources = movieSources.filter((s) => s.last_status === 'WORKING').length;
    const moviesErrorSources = movieSources.filter((s) => s.last_status === 'ERROR' || s.last_status === 'UNAVAILABLE').length;

    // Series Stats
    const seriesList = await this.prisma.series.count();
    const seriesActive = await this.prisma.series.count({ where: { is_active: true } });
    const seasonsTotal = await this.prisma.season.count();
    const episodes = await this.prisma.episode.findMany({ include: { sources: true } });
    const episodesTotal = episodes.length;
    const episodesWithoutSource = episodes.filter((e) => !e.sources.some((s) => s.is_active)).length;
    const episodeSources = await this.prisma.episodeSource.findMany();
    const episodesErrorSources = episodeSources.filter((s) => s.last_status === 'ERROR' || s.last_status === 'UNAVAILABLE').length;

    return {
      tv_categories: tvCategories,
      tv_channels: tvChannels,
      tv_active_channels: tvActiveChannels,
      tv_working_sources: tvWorkingSources,
      tv_error_sources: tvErrorSources,

      movies_total: moviesTotal,
      movies_active: moviesActive,
      movies_inactive: moviesInactive,
      movies_without_source: moviesWithoutSource,
      movies_working_sources: moviesWorkingSources,
      movies_error_sources: moviesErrorSources,

      series_total: seriesList,
      series_active: seriesActive,
      seasons_total: seasonsTotal,
      episodes_total: episodesTotal,
      episodes_without_source: episodesWithoutSource,
      episodes_error_sources: episodesErrorSources,
    };
  }

  /**
   * PUBLIC API FEEDS FOR APK / CLIENTS
   */
  async getMoviesFeed() {
    await this.ensureSeedData();
    const movies = await this.getMovies({ isActive: true });
    return movies.map((m) => ({
      id: m.id,
      title: m.title,
      original_title: m.original_title,
      category: m.category_name,
      genre: m.genre,
      year: m.year,
      duration: m.duration,
      rating: m.rating,
      synopsis: m.synopsis,
      poster_url: m.poster_url,
      poster_emoji: m.poster_emoji,
      active_source: m.active_source,
    }));
  }

  async getSeriesFeed() {
    await this.ensureSeedData();
    const series = await this.getSeries({ isActive: true });
    return series;
  }
}
