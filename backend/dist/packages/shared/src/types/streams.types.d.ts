export interface StreamAuthorizeRequest {
    profile_id: string;
    device_name: string;
    device_uuid: string;
    content_id?: string;
}
export interface StreamAuthorizeResponse {
    authorized: boolean;
    active_stream_id?: string;
    message?: string;
    max_screens?: number;
    current_active_screens?: number;
}
