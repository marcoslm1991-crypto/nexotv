import { ContentService } from './content.service';
import { M3uParserService } from './m3u-parser.service';
import { SaveProgressDto } from './dto/save-progress.dto';
export declare class ContentController {
    private readonly contentService;
    private readonly m3uParserService;
    constructor(contentService: ContentService, m3uParserService: M3uParserService);
    saveProgress(req: any, dto: SaveProgressDto): Promise<{
        success: boolean;
        key: string;
        progress: number;
    }>;
    getProgress(req: any, profileId: string, contentId: string): Promise<{
        progress_seconds: number;
        duration_seconds: number;
        updated_at: Date;
    } | {
        progress_seconds: number;
        duration_seconds: number;
    }>;
    getChannels(): Promise<import("./content.service").Channel[]>;
    importM3u(m3uText: string): Promise<{
        total_found: number;
        imported: number;
        message: string;
    }>;
}
