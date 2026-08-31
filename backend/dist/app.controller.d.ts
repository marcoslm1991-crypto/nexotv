export declare class AppController {
    getApiHealth(): {
        service: string;
        status: string;
        version: string;
        database: string;
        timestamp: string;
        public_endpoints: {
            tv_live_feed: string;
            movies_feed: string;
            series_feed: string;
        };
    };
}
