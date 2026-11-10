import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import Swal from 'sweetalert2';
import { Producto, ProductoForm } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

const FORM_VACIO: ProductoForm = {
  nombre: '',
  codigo: '',
  precio: 0,
  stock: 0,
  categoria: '',
  activo: true,
};

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css',
})
export class ProductoFormComponent implements OnChanges {
  @Input() productoEnEdicion: Producto | null = null;
  @Input() categorias: string[] = [];

  @Output() guardar = new EventEmitter<{
    id: number | null;
    datos: ProductoForm;
  }>();
  @Output() cancelar = new EventEmitter<void>();
  @Output() categoriaEliminada = new EventEmitter<string>();

  form: ProductoForm = { ...FORM_VACIO };
  creandoNuevaCategoria: boolean = false;

  private toast = inject(HotToastService);

  constructor(private readonly productoService: ProductoService) { }

  ngOnChanges(): void {
    if (this.productoEnEdicion) {
      this.form = {
        nombre: this.productoEnEdicion.nombre,
        codigo: this.productoEnEdicion.codigo ?? '',
        precio: Number(this.productoEnEdicion.precio) || 0,
        stock: Number(this.productoEnEdicion.stock) || 0,
        categoria: this.productoEnEdicion.categoria ?? '',
        activo: this.productoEnEdicion.activo ?? true,
      };
    } else {
      this.form = { ...FORM_VACIO };
    }
    this.creandoNuevaCategoria = false;
  }

  onCategoriaChange(valorSeleccionado: string): void {
    if (valorSeleccionado === '_NUEVA_') {
      this.creandoNuevaCategoria = true;

      setTimeout(() => {
        this.form.categoria = '';
      });
    } else {
      this.form.categoria = valorSeleccionado;
    }
  }

  cancelarNuevaCategoria(): void {
    this.creandoNuevaCategoria = false;
    this.form.categoria = '';
  }

  confirmarEliminarCategoria(categoria: string): void {
    if (!categoria || categoria === '_NUEVA_') {
      return;
    }

    Swal.fire({
      title: '¿Eliminar categoría?',
      html: `¿Estás seguro de que deseas eliminar la categoría <strong>"${categoria}"</strong>?<br><br><span style="font-size: 13px; color: #666;">Los productos asignados a esta categoría quedarán sin categoría.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c1432b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarCategoria(categoria).subscribe({
          next: () => {
            this.form.categoria = '';
            this.toast.success(`Categoría "${categoria}" eliminada`);
            this.categoriaEliminada.emit(categoria);
          },
          error: (err) => {
            console.error('Error al eliminar categoría:', err);
            this.toast.error('No se pudo eliminar la categoría');
          },
        });
      }
    });
  }

  onSubmit(): void {
    if (!this.form.nombre?.trim() || Number(this.form.precio) <= 0) {
      return;
    }

    const datosLimpios: ProductoForm = {
      nombre: this.form.nombre.trim(),
      precio: Number(this.form.precio),
      stock: Number(this.form.stock) || 0,
      categoria: this.form.categoria?.trim() || '',
      activo: this.form.activo !== false,
    };

    if (this.form.codigo?.trim()) {
      datosLimpios.codigo = this.form.codigo.trim();
    }

    this.guardar.emit({
      id: this.productoEnEdicion?.id ?? null,
      datos: datosLimpios,
    });
  }
}
