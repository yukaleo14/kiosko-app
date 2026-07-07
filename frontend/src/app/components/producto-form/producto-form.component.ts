import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  form: ProductoForm = { ...FORM_VACIO };
  creandoNuevaCategoria: boolean = false;

  constructor(private readonly productoService: ProductoService) {}

  ngOnChanges(): void {
    this.form = this.productoEnEdicion
      ? { ...this.productoEnEdicion }
      : { ...FORM_VACIO };
      this.creandoNuevaCategoria = false;
  }

  onCategoriaChange(valorSeleccionado: string): void {
    if (valorSeleccionado === '_NUEVA_') {
      this.creandoNuevaCategoria = true;
      
      // El setTimeout asegura que Angular termine de cambiar la vista (el *ngIf)
      // antes de limpiar la variable, evitando que el input se trabe.
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

  onSubmit(): void {
    if (!this.form.nombre.trim() || this.form.precio <= 0) {
      return;
    }
    this.guardar.emit({
      id: this.productoEnEdicion?.id ?? null,
      datos: this.form,
    });
  }
}
