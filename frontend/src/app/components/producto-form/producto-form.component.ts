import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, ProductoForm } from '../../models/producto.model';

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
  @Output() guardar = new EventEmitter<{
    id: number | null;
    datos: ProductoForm;
  }>();
  @Output() cancelar = new EventEmitter<void>();

  form: ProductoForm = { ...FORM_VACIO };

  ngOnChanges(): void {
    this.form = this.productoEnEdicion
      ? { ...this.productoEnEdicion }
      : { ...FORM_VACIO };
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
