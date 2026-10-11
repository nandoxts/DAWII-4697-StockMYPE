import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Sesion } from '../models/auth.model';

const CLAVE_SESION = 'stockmype_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);

  readonly sesion = signal<Sesion | null>(this.leerSesion());
  readonly autenticado = computed(() => this.sesion() !== null);

  // POST /api/auth/login
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(res => {
        const sesion: Sesion = {
          ...res,
          token: this.codificarBase64(`${request.username}:${request.password}`)
        };
        sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
        this.sesion.set(sesion);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(CLAVE_SESION);
    this.sesion.set(null);
  }

  get token(): string | null {
    return this.sesion()?.token ?? null;
  }

  private leerSesion(): Sesion | null {
    try {
      const raw = sessionStorage.getItem(CLAVE_SESION);
      return raw ? JSON.parse(raw) as Sesion : null;
    } catch {
      return null;
    }
  }

  // Base64 en UTF-8 (soporta tildes y ñ)
  private codificarBase64(texto: string): string {
    const bytes = new TextEncoder().encode(texto);
    let binario = '';
    bytes.forEach(b => binario += String.fromCharCode(b));
    return btoa(binario);
  }
}
