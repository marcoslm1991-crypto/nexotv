import { StreamFormat, StreamStatus } from './tv.types';
export interface MovieSourceDto {
    id: string;
    movie_id: string;
    url: string;
    format: StreamFormat;
    is_active: boolean;
    priority: number;
    last_checked_at?: string | null;
    last_status: StreamStatus;
    last_http_code?: number | null;
    last_response_time?: number | null;
    last_error_message?: string | null;
    created_at: string;
    updated_at: string;
}
export interface MovieDto {
    id: string;
    title: string;
    original_title?: string | null;
    category_id?: string | null;
    category_name?: string | null;
    genre?: string | null;
    year: number;
    duration?: string | null;
    rating?: string | null;
    synopsis?: string | null;
    poster_url?: string | null;
    backdrop_url?: string | null;
    poster_emoji?: string;
    stream_url?: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    sources?: MovieSourceDto[];
    active_source?: MovieSourceDto | null;
}
export interface CreateMovieDto {
    title: string;
    original_title?: string;
    category_id?: string;
    genre?: string;
    year?: number;
    duration?: string;
    rating?: string;
    synopsis?: string;
    poster_url?: string;
    backdrop_url?: string;
    is_active?: boolean;
    sort_order?: number;
    initial_source_url?: string;
    initial_source_format?: StreamFormat;
}
export interface UpdateMovieDto {
    title?: string;
    original_title?: string;
    category_id?: string;
    genre?: string;
    year?: number;
    duration?: string;
    rating?: string;
    synopsis?: string;
    poster_url?: string;
    backdrop_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export interface CreateMovieSourceDto {
    movie_id: string;
    url: string;
    format?: StreamFormat;
    is_active?: boolean;
    priority?: number;
}
export interface EpisodeSourceDto {
    id: string;
    episode_id: string;
    url: string;
    format: StreamFormat;
    is_active: boolean;
    priority: number;
    last_checked_at?: string | null;
    last_status: StreamStatus;
    last_http_code?: number | null;
    last_response_time?: number | null;
    last_error_message?: string | null;
    created_at: string;
    updated_at: string;
}
export interface EpisodeDto {
    id: string;
    season_id: string;
    episode_number: number;
    title: string;
    duration?: string | null;
    synopsis?: string | null;
    thumbnail_url?: string | null;
    stream_url?: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    sources?: EpisodeSourceDto[];
    active_source?: EpisodeSourceDto | null;
}
export interface SeasonDto {
    id: string;
    series_id: string;
    season_number: number;
    title?: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    episodes?: EpisodeDto[];
}
export interface SeriesDto {
    id: string;
    title: string;
    original_title?: string | null;
    category_id?: string | null;
    category_name?: string | null;
    genre?: string | null;
    year: number;
    rating?: string | null;
    synopsis?: string | null;
    poster_url?: string | null;
    backdrop_url?: string | null;
    poster_emoji?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    seasons?: SeasonDto[];
    seasons_count?: number;
    episodes_count?: number;
}
export interface CreateSeriesDto {
    title: string;
    original_title?: string;
    category_id?: string;
    genre?: string;
    year?: number;
    rating?: string;
    synopsis?: string;
    poster_url?: string;
    backdrop_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export interface UpdateSeriesDto {
    title?: string;
    original_title?: string;
    category_id?: string;
    genre?: string;
    year?: number;
    rating?: string;
    synopsis?: string;
    poster_url?: string;
    backdrop_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export interface CreateSeasonDto {
    series_id: string;
    season_number: number;
    title?: string;
    is_active?: boolean;
    sort_order?: number;
}
export interface CreateEpisodeDto {
    season_id: string;
    episode_number: number;
    title: string;
    duration?: string;
    synopsis?: string;
    thumbnail_url?: string;
    is_active?: boolean;
    sort_order?: number;
    initial_source_url?: string;
    initial_source_format?: StreamFormat;
}
export interface CreateEpisodeSourceDto {
    episode_id: string;
    url: string;
    format?: StreamFormat;
    is_active?: boolean;
    priority?: number;
}
export interface FullContentStatsDto {
    tv_categories: number;
    tv_channels: number;
    tv_active_channels: number;
    tv_working_sources: number;
    tv_error_sources: number;
    movies_total: number;
    movies_active: number;
    movies_inactive: number;
    movies_without_source: number;
    movies_working_sources: number;
    movies_error_sources: number;
    series_total: number;
    series_active: number;
    seasons_total: number;
    episodes_total: number;
    episodes_without_source: number;
    episodes_error_sources: number;
}
//# sourceMappingURL=vod.types.d.ts.map