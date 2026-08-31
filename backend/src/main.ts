import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('NexoTV-Backend');
  const app = await NestFactory.create(AppModule);

  // 1. Cabeceras de Seguridad OWASP
  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  // 2. Configuración de CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Servir Panel Administrador Web en /admin
  const expressApp = app.getHttpAdapter().getInstance();
  
  const possiblePaths = [
    join(__dirname, 'admin_public'),
    join(__dirname, '..', 'admin_public'),
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

  if (adminDistPath) {
    expressApp.use('/admin', express.static(adminDistPath));
    expressApp.use('/admin/*', (req: any, res: any) => {
      res.sendFile(join(adminDistPath, 'index.html'));
    });
    logger.log(`📱 Panel Administrador Web cargado en /admin (${adminDistPath})`);
  } else {
    logger.warn(`⚠️ No se encontró dist de admin-panel.`);
  }

  // 4. Validación y Sanitización Estricta de Entradas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. Prefijo Global de la API
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`===================================================`);
  logger.log(`🚀 Backend NexoTV ejecutándose en: http://localhost:${port}/api/v1`);
  logger.log(`📱 Panel Administrador Web en: http://localhost:${port}/admin`);
  logger.log(`===================================================`);
}

bootstrap();
