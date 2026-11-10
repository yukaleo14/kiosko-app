
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ mensaje: string }> {
    const existe = await this.usuarioRepository.findOneBy({ usuario: dto.usuario });
    if (existe) {
      throw new ConflictException('El nombre de usuario ya existe.');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const nuevoUsuario = this.usuarioRepository.create({
      usuario: dto.usuario,
      nombreLocal: dto.nombreLocal,
      passwordHash,
    });
    try {
      await this.usuarioRepository.save(nuevoUsuario);
    } catch (error) {
      throw new ConflictException('Error al registrar el usuario.');
    }
    return { mensaje: 'Usuario registrado exitosamente.' };
  }


  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ usuario: dto.usuario });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }

    const payload = { sub: usuario.id, usuario: usuario.usuario, local: usuario.nombreLocal };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  
}
