import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Definimos la estructura de los datos que esperamos del backend
export interface PerfilUsuario {
    id?: number;
    mail?: string;
    nombreLocal: string;
    marca: string;
    colorHeader: string;
    colorMarca: string;
    colorBotones: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuario/perfil`;

  // BehaviorSubject actúa como una "radio" que transmite el perfil actual.
  // Cualquier componente (como tu header) que se suscriba a 'perfil$' escuchará los cambios al instante.
  private perfilSubject = new BehaviorSubject<PerfilUsuario | null>(null);
  public perfil$ = this.perfilSubject.asObservable();

  // Método GET para obtener los datos al iniciar la app
  cargarPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(this.apiUrl).pipe(
      tap((perfil) => {
        // Al recibir la respuesta, "transmitimos" el nuevo perfil a toda la app
        this.perfilSubject.next(perfil);
      })
    );
  }

  actualizarPerfil(datos: Partial<PerfilUsuario>): Observable<PerfilUsuario> {
    // Ya no enviamos el ID. El interceptor pondrá el JWT y el backend hará el resto.
    return this.http.patch<PerfilUsuario>(this.apiUrl, datos).pipe(
      tap((perfilActualizado) => {
        this.perfilSubject.next(perfilActualizado);
      })
    );
  }

  // Método para limpiar los datos al cerrar sesión
  limpiarPerfil(): void {
    this.perfilSubject.next(null);
  }
}