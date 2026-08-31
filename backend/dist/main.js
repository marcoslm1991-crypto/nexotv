"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const express = require("express");
const path_1 = require("path");
const fs = require("fs");
async function bootstrap() {
    const logger = new common_1.Logger('NexoTV-Backend');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
    }));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const expressApp = app.getHttpAdapter().getInstance();
    const possiblePaths = [
        (0, path_1.join)(__dirname, 'admin_public'),
        (0, path_1.join)(__dirname, '..', 'admin_public'),
        (0, path_1.join)(process.cwd(), 'backend', 'admin_public'),
        (0, path_1.join)(process.cwd(), 'apps', 'admin-panel', 'dist'),
    ];
    let adminDistPath = '';
    for (const p of possiblePaths) {
        if (fs.existsSync(p) && fs.existsSync((0, path_1.join)(p, 'index.html'))) {
            adminDistPath = p;
            break;
        }
    }
    if (adminDistPath) {
        expressApp.use('/admin', express.static(adminDistPath));
        expressApp.use('/admin/*', (req, res) => {
            res.sendFile((0, path_1.join)(adminDistPath, 'index.html'));
        });
        logger.log(`📱 Panel Administrador Web cargado en /admin (${adminDistPath})`);
    }
    else {
        logger.warn(`⚠️ No se encontró dist de admin-panel.`);
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`===================================================`);
    logger.log(`🚀 Backend NexoTV ejecutándose en: http://localhost:${port}/api/v1`);
    logger.log(`📱 Panel Administrador Web en: http://localhost:${port}/admin`);
    logger.log(`===================================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map