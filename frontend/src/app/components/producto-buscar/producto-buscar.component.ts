import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  nombre = '';
  productos: Producto[] = [];
  resultados: Producto[] = [];
  buscoAlgunaVez = false;
  cargando = false;

  constructor(private readonly productoService: ProductoService) {}

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
}
