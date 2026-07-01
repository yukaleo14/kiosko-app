import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  // ALTA
  async create(dto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create(dto);
    return this.productoRepository.save(producto);
  }

  // LISTAR TODOS (para la grilla del ABM)
  findAll(): Promise<Producto[]> {
    return this.productoRepository.find({ order: { nombre: 'ASC' } });
  }

  // OBTENER UNO POR ID
  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`No existe el producto con id ${id}`);
    }
    return producto;
  }

  // CONSULTA MANUAL POR NOMBRE (búsqueda parcial, sin importar mayúsculas)
  async buscarPorNombre(nombre: string): Promise<Producto[]> {
    if (!nombre || nombre.trim().length === 0) {
      return [];
    }
    return this.productoRepository.find({
      where: { nombre: Like(`%${nombre.trim()}%`) },
      order: { nombre: 'ASC' },
    });
  }

  // MODIFICACIÓN
  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    const actualizado = this.productoRepository.merge(producto, dto);
    return this.productoRepository.save(actualizado);
  }

  // BAJA
  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }
}
