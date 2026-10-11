import { HttpErrorResponse } from '@angular/common/http';

import { ApiError } from '../../core/models/api-error.model';

// Traduce un error HTTP del backend a un mensaje legible para el usuario
export function mensajeDeError(err: HttpErrorResponse, porDefecto: string): string {
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor. ¿Está levantado el backend?';
  }
  const api = err.error as ApiError | null;
  if (err.status === 400 && api?.errores) {
    return Object.values(api.errores).join(' · ');
  }
  return api?.mensaje ?? porDefecto;
}

// Errores de validación por campo (400) que devuelve el GlobalExceptionHandler
export function erroresDeCampo(err: HttpErrorResponse): Record<string, string> {
  return (err.error as ApiError | null)?.errores ?? {};
}
