import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE: Agregar FormsModule
import { HotToastService } from '@ngneat/hot-toast';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoForm } from '../../models/producto.model';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

// Tipo de dato para asegurar que solo se ordene por columnas válidas
type ColumnaOrden = keyof Producto;

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, ProductoFormComponent, FormsModule], // <-- Agregar aquí
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css',
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  mostrarFormulario = false;
  productoEnEdicion: Producto | null = null;
  error = '';

  categorias: string[] = [];

  // Nuevas propiedades para filtro y ordenamiento
  filtroTexto = '';
  columnaOrden: ColumnaOrden | null = null;
  ordenDescendente = false;

  paginaActual = 1;
  readonly productosPorPagina = 20;

  private toast = inject(HotToastService);

  constructor(private readonly productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargar();
    this.cargarCategorias();
  }

  cargar(): void {
    this.error = '';
    this.productoService.listar().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos. Probá de nuevo.';
      },
    });
  }
// 1. Primer paso: Filtrar y ordenar la lista completa
  get productosFiltradosYOrdenados(): Producto[] {
    let resultado = [...this.productos];

    if (this.filtroTexto.trim()) {
      const texto = this.filtroTexto.toLowerCase();
      resultado = resultado.filter((p) =>
        p.nombre.toLowerCase().includes(texto)
      );
    }

    if (this.columnaOrden) {
      resultado.sort((a, b) => {
        const valorA = a[this.columnaOrden!];
        const valorB = b[this.columnaOrden!];

        if (valorA == null) return this.ordenDescendente ? -1 : 1;
        if (valorB == null) return this.ordenDescendente ? 1 : -1;

        if (valorA < valorB) return this.ordenDescendente ? 1 : -1;
        if (valorA > valorB) return this.ordenDescendente ? -1 : 1;
        return 0;
      });
    }

    return resultado;
  }

  // 2. Segundo paso: Extraer solo el segmento de 20 productos para la pantalla
  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productosFiltradosYOrdenados.slice(inicio, fin);
  }

  // Calcula la cantidad total de páginas basándose en los productos filtrados
  get totalPaginas(): number {
    return Math.ceil(this.productosFiltradosYOrdenados.length / this.productosPorPagina) || 1;
  }

  // Genera un array de números [1, 2, 3...] para renderizar los botones de páginas
  get listaPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cargarCategorias(): void {
    this.productoService.obtenerCategorias().subscribe(
      (categorias) => this.categorias = categorias,
      (error) => console.error('Error al cargar categorías', error)
    );
  }


  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  cambiarOrden(columna: ColumnaOrden): void {
    if (this.columnaOrden === columna) {
      // Si ya estaba ordenando por esta columna, invierte el orden
      this.ordenDescendente = !this.ordenDescendente;
    } else {
      // Si es una nueva columna, ordena ascendente por defecto
      this.columnaOrden = columna;
      this.ordenDescendente = false;
    }
  }

  abrirAlta(): void {
    this.cargarCategorias(); // Actualiza la lista de categorías antes de guardar
    this.productoEnEdicion = null;
    this.mostrarFormulario = true;
  }

  abrirEdicion(producto: Producto): void {
    this.cargarCategorias();
    this.productoEnEdicion = producto;
    this.mostrarFormulario = true;
  }

  onGuardar(evento: { id: number | null; datos: ProductoForm }): void {
    const esCreacion = !evento.id;
    const peticion = evento.id
      ? this.productoService.actualizar(evento.id, evento.datos)
      : this.productoService.crear(evento.datos);

    peticion.subscribe({
      next: () => {
        this.mostrarFormulario = false;
        if (esCreacion) {
          this.toast.success('Producto creado con éxito');
        } else {
          this.toast.success('Producto actualizado con éxito');
        }
        this.cargar();
      },
      error: (error) => {
        console.error('Error al guardar producto', error);
        const detalle = error?.error?.message;
        const mensajeError = Array.isArray(detalle) ? detalle.join(', ') : (detalle || 'Error al guardar producto.');
        this.error = mensajeError;
        this.toast.error(mensajeError);
      }
    });
  }

  onCancelar(): void {
    this.mostrarFormulario = false;
  }

  onCategoriaEliminada(): void {
    this.cargarCategorias();
    this.cargar();
  }

  eliminar(producto: Producto): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      html: `¿Estás seguro de que deseas eliminar <strong>"${producto.nombre}"</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c1432b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminar(producto.id).subscribe({
          next: () => {
            this.toast.success('Producto eliminado con éxito');
            this.cargar();
            this.cargarCategorias();
          },
          error: () => {
            this.error = 'No se pudo eliminar el producto. Probá de nuevo.';
            this.toast.error('No se pudo eliminar el producto.');
          },
        });
      }
    });
  }
}