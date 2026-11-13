import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-buscar.component.html',
  styleUrl: './producto-buscar.component.css',
})
export class ProductoBuscarComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly toast = inject(HotToastService);

  nombre = '';
  productos: Producto[] = [];
  resultados: Producto[] = [];
  buscoAlgunaVez = false;
  cargando = false;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
        if (this.nombre.trim()) {
          this.filtrar();
        }
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  filtrar(): void {
    const termino = this.nombre.trim().toLowerCase();
    if (!termino) {
      this.resultados = [];
      this.buscoAlgunaVez = false;
      return;
    }

    this.buscoAlgunaVez = true;
    this.resultados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(termino)
    );
  }

  buscar(): void {
    this.filtrar();
  }

  editarPrecio(producto: Producto): void {
    const colorBoton =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-botones')
        .trim() || '#0A207D';

    Swal.fire({
      title: 'Modificar precio',
      html: `
        <div style="text-align: center; margin-bottom: 10px;">
          <p style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 4px 0;">${producto.nombre}</p>
          ${producto.categoria ? `<span style="font-size: 13px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 6px;">${producto.categoria}</span>` : ''}
        </div>
      `,
      input: 'number',
      inputValue: producto.precio,
      inputLabel: 'Nuevo precio ($)',
      inputAttributes: {
        step: 'any',
        min: '0',
        inputmode: 'decimal',
        placeholder: '0.00',
      },
      showCloseButton: true,
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      confirmButtonText: 'Guardar precio',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: colorBoton,
      cancelButtonColor: '#64748b',
      reverseButtons: true,
      didOpen: () => {
        const input = Swal.getInput();
        if (input) {
          input.select();
        }
      },
      inputValidator: (value) => {
        if (!value || isNaN(Number(value))) {
          return 'Ingresá un precio válido';
        }
        if (Number(value) < 0) {
          return 'El precio no puede ser negativo';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoPrecio = Number(result.value);
        if (nuevoPrecio === Number(producto.precio)) {
          return;
        }

        this.productoService
          .actualizar(producto.id, { precio: nuevoPrecio })
          .subscribe({
            next: (prodActualizado) => {
              producto.precio = prodActualizado.precio;
              const prodEnLista = this.productos.find(
                (p) => p.id === producto.id,
              );
              if (prodEnLista) {
                prodEnLista.precio = prodActualizado.precio;
              }
              this.toast.success(
                `Precio de "${producto.nombre}" actualizado a $${prodActualizado.precio}`,
              );
            },
            error: (err) => {
              console.error('Error al actualizar precio:', err);
              this.toast.error('No se pudo actualizar el precio');
            },
          });
      }
    });
  }
}
