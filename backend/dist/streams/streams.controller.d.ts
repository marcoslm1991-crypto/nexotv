import { StreamsService } from './streams.service';
import { AuthorizeStreamDto } from './dto/authorize-stream.dto';
import { HeartbeatStreamDto } from './dto/heartbeat-stream.dto';
import { StopStreamDto } from './dto/stop-stream.dto';
export declare class StreamsController {
    private readonly streamsService;
    constructor(streamsService: StreamsService);
    authorizeStream(req: any, dto: AuthorizeStreamDto): Promise<{
        authorized: boolean;
        active_stream_id: string;
        max_screens: number;
        current_active_screens: number;
        message: string;
    }>;
    heartbeat(req: any, dto: HeartbeatStreamDto): Promise<{
        success: boolean;
        timestamp: Date;
    }>;
    stopStream(req: any, dto: StopStreamDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getActiveStreams(req: any): Promise<({
        profile: {
            id: string;
            name: string;
        };
        device: {
            id: string;
            device_uuid: string;
            device_name: string;
        };
    } & {
        id: string;
        user_id: string;
        profile_id: string;
        device_id: string;
        content_id: string | null;
        started_at: Date;
        last_heartbeat: Date;
    })[]>;
}
