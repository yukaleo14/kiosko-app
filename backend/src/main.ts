import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN?.split(',') ?? [
    'http://localhost:4200',
  ];
  app.enableCors({
    origin: corsOrigin,
  });

  // Valida y transforma automáticamente los DTOs en cada request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api'); // todas las rutas quedan bajo /api/...

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend escuchando en http://localhost:${port}/api`);
}
bootstrap();
