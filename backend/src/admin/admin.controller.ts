import { Controller, Get, Res, Req } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { Response, Request } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class AdminController {
  @Public()
  @Get('admin')
  getAdminRootNoSlash(@Req() req: Request, @Res() res: Response) {
    if (!req.originalUrl.endsWith('/')) {
      return res.redirect('/admin/');
    }
    return this.serveFile('index.html', res);
  }

  @Public()
  @Get('admin/*')
  getAdminAsset(@Req() req: Request, @Res() res: Response) {
    let relPath = req.params[0] || '';
    if (!relPath || relPath === '') {
      relPath = 'index.html';
    }
    return this.serveFile(relPath, res);
  }

  private serveFile(relPath: string, res: Response) {
    const possiblePaths = [
      join(__dirname, '..', 'admin_public'),
      join(__dirname, '..', '..', 'admin_public'),
      join(__dirname, '..', '..', 'dist', 'admin_public'),
      join(process.cwd(), 'backend', 'admin_public'),
      join(process.cwd(), 'apps', 'admin-panel', 'dist'),
    ];

    let adminDistPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p) && fs.existsSync(join(p, 'index.html'))) {
        adminDistPath = p;
        break;
      }
    }

    if (!adminDistPath) {
      return res.status(404).send('Admin panel dist not found on server.');
    }

    const filePath = join(adminDistPath, relPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    } else {
      return res.sendFile(join(adminDistPath, 'index.html'));
    }
  }
}
