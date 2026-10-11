export interface ApiError {
  status: number;
  error: string;
  mensaje: string;
  errores?: Record<string, string>;
}
