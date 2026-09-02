import { Controller, Get, Patch, Body, UseGuards, Request } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @UseGuards(JwtAuthGuard)
    @Get('perfil')
    obtenerPerfil(@Request() req) {
        return this.usuarioService.obtenerPerfil(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('perfil')
    actualizarPerfil(
        @Request() req, 
        @Body() dato: { nombreLocal?: string; colorHeader?: string; marca?: string; colorMarca?: string; colorBotones?: string }
    ) {
        return this.usuarioService.actualizarPerfil(req.user.sub, dato);
    }
}