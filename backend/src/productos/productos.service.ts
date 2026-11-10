import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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
  async create(dto: CreateProductoDto, usuarioId: number): Promise<Producto> {
    const producto = this.productoRepository.create({
      ...dto,
      usuario: { id: usuarioId } 
  });
    return this.productoRepository.save(producto);
  }

  // LISTAR TODOS (para la grilla del ABM)
  findAll(usuarioId: number): Promise<Producto[]> {
    return this.productoRepository.find({ 
      where: { usuario: { id: usuarioId } }, 
      order: { nombre: 'ASC' } });
  }

  findAllCategorias(usuarioId: number): Promise<string[]> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .select('DISTINCT producto.categoria', 'categoria')
      .where("producto.usuario = :usuarioId AND producto.categoria IS NOT NULL AND TRIM(producto.categoria) != ''", { usuarioId })
      .orderBy('producto.categoria', 'ASC')
      .getRawMany()
      .then((result) =>
        result
          .map((row) => row.categoria)
          .filter((cat): cat is string => Boolean(cat && cat.trim())),
      );
  }

  async eliminarCategoria(nombre: string, usuarioId: number): Promise<{ mensaje: string; actualizados: number }> {
    if (!nombre) {
      return { mensaje: 'Categoría no especificada', actualizados: 0 };
    }
    const resultado = await this.productoRepository
      .createQueryBuilder()
      .update(Producto)
      .set({ categoria: null })
      .where('usuario_id = :usuarioId AND categoria = :nombre', { usuarioId, nombre })
      .execute();

    return {
      mensaje: `Categoría "${nombre}" eliminada`,
      actualizados: resultado.affected || 0,
    };
  }

  // OBTENER UNO POR ID
  async findOne(id: number, usuarioId: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id, usuario: { id: usuarioId } });
    if (!producto) {
      throw new NotFoundException(`No existe el producto con id ${id}`);
    }
    return producto;
  }

  // CONSULTA MANUAL POR NOMBRE (búsqueda parcial case-insensitive en Postgres)
  async buscarPorNombre(nombre: string, usuarioId: number): Promise<Producto[]> {
    if (!nombre || nombre.trim().length === 0) {
      return [];
    }
    return this.productoRepository.find({
      where: { nombre: ILike(`%${nombre.trim()}%`), usuario: { id: usuarioId } },
      order: { nombre: 'ASC' },
    });
  }

  // MODIFICACIÓN
  async update(id: number, dto: UpdateProductoDto, usuarioId: number): Promise<Producto> {
    const producto = await this.findOne(id, usuarioId);
    const actualizado = this.productoRepository.merge(producto, dto);
    return this.productoRepository.save(actualizado);
  }

  // BAJA
  async remove(id: number, usuarioId: number): Promise<void> {
    const producto = await this.findOne(id, usuarioId);
    await this.productoRepository.remove(producto);
  }

  // MIGRACION: Asignar productos sin usuario
  async migrarProductosHuerfanos(usuarioId: number): Promise<{ mensaje: string; actualizados: number }> {
    const resultado = await this.productoRepository
      .createQueryBuilder()
      .update(Producto)
      .set({ usuario: { id: usuarioId } })
      .where('usuario_id IS NULL')
      .execute();

    return {
      mensaje: 'Migración exitosa',
      actualizados: resultado.affected || 0
    };
  }
}
