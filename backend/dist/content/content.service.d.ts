import { SaveProgressDto } from './dto/save-progress.dto';
export interface EpgProgram {
    title: string;
    start_time: string;
    end_time: string;
    description: string;
    next_program?: {
        title: string;
        start_time: string;
    };
}
export interface Channel {
    id: string;
    number: number;
    name: string;
    category: string;
    logo_url: string;
    stream_url: string;
    epg: EpgProgram;
}
export declare class ContentService {
    private userProgressMap;
    saveProgress(userId: string, dto: SaveProgressDto): Promise<{
        success: boolean;
        key: string;
        progress: number;
    }>;
    getProgress(userId: string, profileId: string, contentId: string): Promise<{
        progress_seconds: number;
        duration_seconds: number;
        updated_at: Date;
    } | {
        progress_seconds: number;
        duration_seconds: number;
    }>;
    getChannels(): Promise<Channel[]>;
}
