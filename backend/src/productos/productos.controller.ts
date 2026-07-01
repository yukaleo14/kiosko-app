import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // POST /productos -> Alta
  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  // GET /productos -> Listado completo (grilla del ABM)
  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  // GET /productos/buscar?nombre=coca -> Consulta manual por nombre
  // OJO: esta ruta debe declararse ANTES que "GET /productos/:id"
  @Get('buscar')
  buscarPorNombre(@Query('nombre') nombre: string) {
    return this.productosService.buscarPorNombre(nombre);
  }

  // GET /productos/:id -> Detalle de un producto
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // PATCH /productos/:id -> Modificación
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, dto);
  }

  // DELETE /productos/:id -> Baja
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
