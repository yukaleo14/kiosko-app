import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credenciales: any) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(res => localStorage.setItem('token', res.accessToken))
    );
  }

  register(datos: any) {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  obtenerDatosUsuario(): {sub: number, mail: string, nombreLocal: string} | null {
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
