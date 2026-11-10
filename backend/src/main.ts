import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const corsOrigin = process.env.CORS_ORIGIN?.split(',') ?? [
  //   // 'https://kiosko-app-front.onrender.com',
  //   'http://localhost:4200',
  // ];
  // app.enableCors({
  //   origin: corsOrigin,
  // });

  // 1. Extraemos los orígenes del .env si existen
  const origenesEnv = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

  // 2. Forzamos a que localhost SIEMPRE esté en la lista permitida
  const origenesPermitidos = [
    'http://localhost:4200',
    ...origenesEnv
  ];

  // 3. Configuramos CORS de forma robusta
  app.enableCors({
    origin: origenesPermitidos,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Valida y transforma automáticamente los DTOs en cada request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api'); // todas las rutas quedan bajo /api/...

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend escuchando en http://localhost:${port}/api`);
}
bootstrap();
