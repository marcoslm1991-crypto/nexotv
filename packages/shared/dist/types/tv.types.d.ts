export type StreamFormat = 'HLS' | 'DASH' | 'MP4' | 'WEBM' | 'CUSTOM';
export type StreamStatus = 'WORKING' | 'ERROR' | 'UNAVAILABLE' | 'UNCHECKED';
export interface CategoryDto {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    channel_count?: number;
}
export interface ChannelSourceDto {
    id: string;
    channel_id: string;
    url: string;
    format: StreamFormat;
    is_active: boolean;
    priority: number;
    last_checked_at?: string | null;
    last_status: StreamStatus;
    last_http_code?: number | null;
    last_response_time?: number | null;
    last_error_message?: string | null;
    created_by_user_id?: string | null;
    created_at: string;
    updated_at: string;
}
export interface ChannelDto {
    id: string;
    name: string;
    category_id?: string | null;
    category_name?: string | null;
    number?: number | null;
    logo_url?: string | null;
    logo_emoji?: string;
    description?: string | null;
    now_playing?: string | null;
    stream_url?: string | null;
    is_hd: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    sources?: ChannelSourceDto[];
    active_source?: ChannelSourceDto | null;
}
export interface CreateCategoryDto {
    name: string;
    slug?: string;
    image_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export interface UpdateCategoryDto {
    name?: string;
    slug?: string;
    image_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export interface CreateChannelDto {
    name: string;
    category_id: string;
    logo_url?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
    initial_source_url?: string;
    initial_source_format?: StreamFormat;
}
export interface UpdateChannelDto {
    name?: string;
    category_id?: string;
    logo_url?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
}
export interface CreateChannelSourceDto {
    channel_id: string;
    url: string;
    format?: StreamFormat;
    is_active?: boolean;
    priority?: number;
}
export interface UpdateChannelSourceDto {
    url?: string;
    format?: StreamFormat;
    is_active?: boolean;
    priority?: number;
}
export interface QuickSwitchSourceDto {
    channel_id: string;
    url: string;
    format?: StreamFormat;
}
export interface TestLinkDto {
    url: string;
    format?: StreamFormat;
    source_id?: string;
}
export interface StreamTestResultDto {
    url: string;
    is_working: boolean;
    http_code: number;
    response_time_ms: number;
    format: StreamFormat;
    status: StreamStatus;
    checked_at: string;
    error_message?: string | null;
}
export interface TvStatsSummaryDto {
    total_categories: number;
    total_channels: number;
    active_channels: number;
    inactive_channels: number;
    channels_without_source: number;
    working_sources: number;
    error_sources: number;
}
export interface LiveTvCategoryResponse {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    sort_order: number;
    channels: {
        id: string;
        name: string;
        logo_url?: string | null;
        description?: string | null;
        sort_order: number;
        active_source?: {
            id: string;
            url: string;
            format: StreamFormat;
            priority: number;
        } | null;
    }[];
}
//# sourceMappingURL=tv.types.d.ts.map