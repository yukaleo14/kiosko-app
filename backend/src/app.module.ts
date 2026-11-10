import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/producto.entity';
import { Usuario } from './usuario/usuario.entity';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: Number(config.get<number>('DB_PORT')) || 5432,
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [Producto, Usuario],
        synchronize: true, // Crea/actualiza las tablas automáticamente en Postgres
        ssl:
          config.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    ProductosModule,
    AuthModule,
    UsuarioModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
