# StockMYPE – Gestión de inventario para MYPEs

Proyecto de Investigación Aplicada · **Desarrollo de Aplicaciones Web II (4697)** · Cibertec, 6to ciclo.

## Estructura

```
DAWII-4697-StockMYPE/
├── backend/     Spring Boot 3 · Java 17 · MySQL 8
├── frontend/    Angular 18 (standalone)
├── docs/        rúbrica, pruebas de la API, informe (.doc), PPT (.ppt), video
└── StockMYPE.code-workspace   <- abrir esto en VS Code
```

## Requisitos

- JDK 17+ y Maven
- Node.js 20+ y Angular CLI (`npm i -g @angular/cli@18`)
- MySQL 8 corriendo en `localhost:3306` (usuario `root` / `root`).
  Si no tienes MySQL instalado, con Docker basta: `docker compose up -d` en la raíz.

## Cómo levantar

**1. Backend** (puerto 8080). Edita usuario/password de MySQL en `backend/src/main/resources/application.properties`:

```bash
cd backend
mvn spring-boot:run
```

La BD `stockmype_db` se crea sola. El seeder crea el usuario **admin / admin123** (password cifrado con BCrypt) y 5 productos.

**2. Tests de la capa de datos** (`@DataJpaTest`: insertar, actualizar, eliminar, listar):

```bash
cd backend
mvn test
```

**3. Frontend** (puerto 4200):

```bash
cd frontend
npm install
ng serve -o
```

## Frontend: estructura

Angular 18 standalone + **Bootstrap 5**, **Bootstrap Icons** y **SweetAlert2**.

```
src/app/
├── core/        servicios HTTP (auth, productos), guards, interceptor (HTTP Basic), modelos
├── shared/      componentes reutilizables (stat-card, stock-badge, empty-state),
│                NotificacionService (SweetAlert2) y utilidades de errores de la API
├── layout/      MainLayout: navbar + footer de la zona privada
└── features/
    ├── auth/login/          pantalla de login (POST /auth/login)
    └── productos/           carga diferida (lazy loading)
        ├── pages/productos-page/      contenedor: GET, filtros, orden, paginación, DELETE
        └── components/
            ├── productos-resumen/     KPIs del inventario
            ├── productos-tabla/       tabla presentacional (emite editar/eliminar/ordenar)
            └── producto-form/         modal de alta/edición (POST / PUT)
```

La URL del backend está en `src/environments/environment.ts`.

## Endpoints

| Método | Ruta | Respuestas |
|---|---|---|
| POST | `/api/auth/login` | 200, 400, 401 |
| GET | `/api/productos` | 200 |
| GET | `/api/productos/{id}` | 200, 404 |
| POST | `/api/productos` | 201, 400, 409 |
| PUT | `/api/productos/{id}` | 200, 400, 404, 409 |
| DELETE | `/api/productos/{id}` | 204, 404 |

`/api/auth/**` es público; `/api/productos/**` requiere HTTP Basic (Angular lo envía solo después del login).
Pruebas listas en `docs/pruebas-api.http` (extensión REST Client de VS Code).
