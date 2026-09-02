import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./usuario.entity";


@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
         private readonly usuarioRepository: Repository<Usuario>
    ) {}

    async obtenerPerfil(id:number){
        const usuario = await this.usuarioRepository.findOneBy({id});
        if(!usuario){
            throw new Error('Usuario no encontrado');
        }

        // Se excluye el passwordHash del perfil antes de devolverlo
        const { passwordHash, ...perfil } = usuario;
        return perfil;
    }

    async actualizarPerfil(id: number, dato: { nombreLocal?: string; colorHeader?: string; marca?: string; colorMarca?: string; colorBotones?: string }) {
        await this.usuarioRepository.update(id, dato);
        return this.obtenerPerfil(id);
    }
}