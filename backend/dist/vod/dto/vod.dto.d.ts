export declare class CreateMovieDto {
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
    initial_source_format?: string;
}
export declare class UpdateMovieDto {
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
export declare class CreateMovieSourceDto {
    movie_id: string;
    url: string;
    format?: string;
    is_active?: boolean;
    priority?: number;
}
export declare class UpdateMovieSourceDto {
    url?: string;
    format?: string;
    is_active?: boolean;
    priority?: number;
}
export declare class CreateSeriesDto {
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
export declare class UpdateSeriesDto {
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
export declare class CreateSeasonDto {
    series_id: string;
    season_number: number;
    title?: string;
    is_active?: boolean;
    sort_order?: number;
}
export declare class UpdateSeasonDto {
    season_number?: number;
    title?: string;
    is_active?: boolean;
    sort_order?: number;
}
export declare class CreateEpisodeDto {
    season_id: string;
    episode_number: number;
    title: string;
    duration?: string;
    synopsis?: string;
    thumbnail_url?: string;
    is_active?: boolean;
    sort_order?: number;
    initial_source_url?: string;
    initial_source_format?: string;
}
export declare class UpdateEpisodeDto {
    episode_number?: number;
    title?: string;
    duration?: string;
    synopsis?: string;
    thumbnail_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export declare class CreateEpisodeSourceDto {
    episode_id: string;
    url: string;
    format?: string;
    is_active?: boolean;
    priority?: number;
}
export declare class UpdateEpisodeSourceDto {
    url?: string;
    format?: string;
    is_active?: boolean;
    priority?: number;
}
