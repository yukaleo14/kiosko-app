import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { LoginResponse } from '../models/auth.model';

const STORAGE_KEY = 'kiosko_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  // Señal reactiva para que el navbar/guards sepan si hay sesión activa
  readonly logueada = signal<boolean>(this.hayTokenGuardado());

  constructor(private readonly http: HttpClient) {}

  login(usuario: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { usuario, password })
      .pipe(
        tap((respuesta) => {
          localStorage.setItem(STORAGE_KEY, respuesta.accessToken);
          this.logueada.set(true);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.logueada.set(false);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  private hayTokenGuardado(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }
}
