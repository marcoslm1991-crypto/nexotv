import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsEnum, Min } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  original_title?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  rating?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsString()
  @IsOptional()
  poster_url?: string;

  @IsString()
  @IsOptional()
  backdrop_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;

  @IsString()
  @IsOptional()
  initial_source_url?: string;

  @IsString()
  @IsOptional()
  initial_source_format?: string;
}

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  original_title?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  rating?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsString()
  @IsOptional()
  poster_url?: string;

  @IsString()
  @IsOptional()
  backdrop_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}

export class CreateMovieSourceDto {
  @IsString()
  @IsNotEmpty()
  movie_id: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  priority?: number;
}

export class UpdateMovieSourceDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  priority?: number;
}

export class CreateSeriesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  original_title?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  rating?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsString()
  @IsOptional()
  poster_url?: string;

  @IsString()
  @IsOptional()
  backdrop_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}

export class UpdateSeriesDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  original_title?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  rating?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsString()
  @IsOptional()
  poster_url?: string;

  @IsString()
  @IsOptional()
  backdrop_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}

export class CreateSeasonDto {
  @IsString()
  @IsNotEmpty()
  series_id: string;

  @IsInt()
  @Min(1)
  season_number: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}

export class UpdateSeasonDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  season_number?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  season_id: string;

  @IsInt()
  @Min(1)
  episode_number: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;

  @IsString()
  @IsOptional()
  initial_source_url?: string;

  @IsString()
  @IsOptional()
  initial_source_format?: string;
}

export class UpdateEpisodeDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  episode_number?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}

export class CreateEpisodeSourceDto {
  @IsString()
  @IsNotEmpty()
  episode_id: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  priority?: number;
}

export class UpdateEpisodeSourceDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  priority?: number;
}
