export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
  stock: number;
  fechaRegistro: string;
}

export interface ProductoRequest {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
  stock: number;
}

// Umbral para considerar un producto con "stock bajo"
export const STOCK_MINIMO = 5;
