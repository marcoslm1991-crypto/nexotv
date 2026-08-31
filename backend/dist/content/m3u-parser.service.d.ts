import { PrismaService } from '../prisma/prisma.service';
export interface ParsedM3uChannel {
    name: string;
    category: string;
    number: number;
    logo_url?: string;
    logo_emoji: string;
    now_playing: string;
    stream_url: string;
    is_hd: boolean;
}
export declare class M3uParserService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    parseM3uContent(m3uText: string): ParsedM3uChannel[];
    importM3uToSupabase(m3uText: string): Promise<{
        total_found: number;
        imported: number;
        message: string;
    }>;
}
