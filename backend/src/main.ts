import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('NexoTV-Backend');
  const app = await NestFactory.create(AppModule);

  // 1. Cabeceras de Seguridad OWASP
  app.use(helmet());

  // 2. Configuración de CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Validación y Sanitización Estricta de Entradas (OWASP)
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

  // 4. Prefijo Global de la API
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`===================================================`);
  logger.log(`🚀 Backend NexoTV ejecutándose en: http://localhost:${port}/api/v1`);
  logger.log(`===================================================`);
}

bootstrap();
