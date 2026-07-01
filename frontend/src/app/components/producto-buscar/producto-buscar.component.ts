import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoForm } from '../../models/producto.model';


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
    this.productoService.listar().subscribe((productos) => {
      this.productos = productos;
    });
  }

  buscar(): void {
    if (!this.nombre.trim()) {
      this.resultados = [];
      return;
    }
    this.cargando = true;
    this.buscoAlgunaVez = true;
    this.productoService.buscarPorNombre(this.nombre).subscribe({
      next: (productos) => {
        this.resultados = productos;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

}
