import { Response, Request } from 'express';
export declare class AdminController {
    getAdminRootNoSlash(req: Request, res: Response): void | Response<any, Record<string, any>>;
    getAdminAsset(req: Request, res: Response): void | Response<any, Record<string, any>>;
    private serveFile;
}
