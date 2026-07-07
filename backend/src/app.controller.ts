import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Responde en "/" (fuera del prefijo /api). Sirve para que Render
  // confirme que el servicio está vivo y para chequeos manuales rápidos.
  @Get()
  health() {
    return { status: 'ok', servicio: 'kiosko-backend' };
  }
}
