export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  nombre: string;
  rol: string;
  mensaje: string;
}

export interface Sesion extends LoginResponse {
  token: string;
}
