import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'cambiar-este-secreto',
    });
  }

  // Lo que devuelve este método queda disponible como `request.user`
  async validate(payload: { sub: number; usuario: string; local: string }) {
    return { sub: payload.sub, usuario: payload.usuario, local: payload.local };
  }
}
