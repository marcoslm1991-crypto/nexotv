export declare class CreateCategoryDto {
    name: string;
    slug?: string;
    image_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export declare class UpdateCategoryDto {
    name?: string;
    slug?: string;
    image_url?: string;
    is_active?: boolean;
    sort_order?: number;
}
export declare class CreateChannelDto {
    name: string;
    category_id: string;
    logo_url?: string;
    logo_emoji?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
    initial_source_url?: string;
    initial_source_format?: string;
    stream_url?: string;
}
export declare class UpdateChannelDto {
    name?: string;
    category_id?: string;
    logo_url?: string;
    logo_emoji?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
    stream_url?: string;
}
export declare class CreateChannelSourceDto {
    channel_id: string;
    url: string;
    format?: string;
    is_active?: boolean;
    priority?: number;
}
export declare class UpdateChannelSourceDto {
    url?: string;
    format?: string;
    is_active?: boolean;
    priority?: number;
}
export declare class QuickSwitchSourceDto {
    channel_id: string;
    url: string;
    format?: string;
}
export declare class TestLinkDto {
    url: string;
    format?: string;
    source_id?: string;
}
