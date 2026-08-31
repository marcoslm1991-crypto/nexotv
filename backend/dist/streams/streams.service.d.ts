import { PrismaService } from '../prisma/prisma.service';
import { AuthorizeStreamDto } from './dto/authorize-stream.dto';
import { HeartbeatStreamDto } from './dto/heartbeat-stream.dto';
import { StopStreamDto } from './dto/stop-stream.dto';
export declare class StreamsService {
    private prisma;
    private readonly HEARTBEAT_TIMEOUT_SECONDS;
    constructor(prisma: PrismaService);
    private purgeStaleStreams;
    authorizeStream(userId: string, dto: AuthorizeStreamDto): Promise<{
        authorized: boolean;
        active_stream_id: string;
        max_screens: number;
        current_active_screens: number;
        message: string;
    }>;
    heartbeat(userId: string, dto: HeartbeatStreamDto): Promise<{
        success: boolean;
        timestamp: Date;
    }>;
    stopStream(userId: string, dto: StopStreamDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getActiveStreamsForUser(userId: string): Promise<({
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
