import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const usuarioValido = this.config.get<string>('ADMIN_USERNAME');
    const hashValido = this.config.get<string>('ADMIN_PASSWORD_HASH');

    if (!usuarioValido || !hashValido) {
      throw new UnauthorizedException(
        'El servidor no tiene configuradas las credenciales de acceso.',
      );
    }

    const usuarioCoincide = dto.usuario === usuarioValido;
    const passwordCoincide = await bcrypt.compare(dto.password, hashValido);

    if (!usuarioCoincide || !passwordCoincide) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    const payload = { sub: usuarioValido, rol: 'dueña' };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
