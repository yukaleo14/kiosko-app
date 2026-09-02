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
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('buscar')
  buscarPorNombre(@Query('nombre') nombre: string, @Request() req) {
    return this.productosService.buscarPorNombre(nombre, req.user.sub);
  }

  // POST /productos -> Alta
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() CreateProductoDto: CreateProductoDto, @Request() req) {
    return this.productosService.create(CreateProductoDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.productosService.findAll(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/categorias')
  findAllCategorias(@Request() req) {
    return this.productosService.findAllCategorias(req.user.sub);
  }

  // GET /productos/:id -> Detalle de un producto
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.productosService.findOne(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
    @Request() req
  ) {
    return this.productosService.update(id, dto, req.user.sub);
  }

  // DELETE /productos/:id -> Baja
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.productosService.remove(id, req.user.sub);
  }

  // MIGRACION TEMPORAL
  @UseGuards(JwtAuthGuard)
  @Post('migrar-huerfanos')
  migrarHuerfanos(@Request() req) {
    return this.productosService.migrarProductosHuerfanos(req.user.sub);
  }
}
