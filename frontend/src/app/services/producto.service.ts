import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, ProductoForm } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly baseUrl = 'http://localhost:3000/api/productos';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  // Consulta manual por nombre -> GET /api/productos/buscar?nombre=...
  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/buscar`, {
      params: { nombre },
    });
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  crear(producto: ProductoForm): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto);
  }

  actualizar(
    id: number,
    producto: Partial<ProductoForm>,
  ): Observable<Producto> {
    return this.http.patch<Producto>(`${this.baseUrl}/${id}`, producto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
