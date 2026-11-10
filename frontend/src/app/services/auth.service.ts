import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credenciales: any, recordar: boolean = true) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(res => {
        if (recordar) {
          localStorage.setItem('token', res.accessToken);
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('token', res.accessToken);
          localStorage.removeItem('token');
        }
      })
    );
  }

  register(datos: any) {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  obtenerDatosUsuario(): {sub: number, usuario: string, nombreLocal: string} | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = atob(payloadBase64);
      return JSON.parse(payloadDecoded);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
    }
}
