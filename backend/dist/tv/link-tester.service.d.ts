import { StreamFormat, StreamTestResultDto } from '../common/types';
export declare class LinkTesterService {
    private readonly logger;
    private isPrivateIp;
    validateAndFilterUrl(urlStr: string): Promise<{
        valid: boolean;
        reason?: string;
        parsedUrl?: URL;
    }>;
    detectFormat(urlStr: string, contentType?: string | null): StreamFormat;
    testLink(urlStr: string, preferredFormat?: StreamFormat): Promise<StreamTestResultDto>;
}
