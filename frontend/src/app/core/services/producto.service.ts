import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Producto, ProductoRequest } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/productos`;

  // GET /api/productos
  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  // GET /api/productos/{id}
  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  // POST /api/productos
  crear(producto: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.url, producto);
  }

  // PUT /api/productos/{id}
  actualizar(id: number, producto: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, producto);
  }

  // DELETE /api/productos/{id}
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
