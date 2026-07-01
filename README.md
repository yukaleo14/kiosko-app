# Kiosko - ABM de productos

Base de proyecto para gestionar productos de un kiosko: alta, baja, modificación
y consulta manual de precio por nombre.

**Stack:** NestJS + TypeORM (backend) · Angular standalone (frontend) · MySQL en Docker.

```
kiosko-app/
├── docker-compose.yml      # MySQL + Adminer
├── backend/                # API REST NestJS
│   └── src/
│       ├── app.module.ts
│       ├── main.ts
│       └── productos/      # entidad, dto, service, controller, module
└── frontend/                # SPA Angular
    └── src/app/
        ├── models/
        ├── services/
        └── components/
            ├── producto-buscar/   # pantalla de consulta por nombre
            ├── producto-list/     # grilla del ABM
            └── producto-form/     # alta / edición
```

## 1. Levantar la base de datos

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto levanta:
- **MySQL** en `localhost:3306` (db: `kiosko_db`, user: `kiosko_user`, pass: `kiosko_pass`)
- **Adminer** en `http://localhost:8080` (opcional, para ver las tablas desde el navegador)

## 2. Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

La API queda en `http://localhost:3000/api`. Como `synchronize: true` está activo en
`app.module.ts`, la tabla `productos` se crea sola la primera vez que el backend
se conecta a MySQL (es cómodo para desarrollo; para producción conviene
desactivarlo y usar migraciones de TypeORM).

### Endpoints

| Método | Ruta                         | Acción                              |
|--------|------------------------------|--------------------------------------|
| GET    | `/api/productos`             | Listar todos                         |
| GET    | `/api/productos/buscar?nombre=` | Consulta manual por nombre        |
| GET    | `/api/productos/:id`         | Obtener uno                          |
| POST   | `/api/productos`             | Alta                                  |
| PATCH  | `/api/productos/:id`         | Modificación                          |
| DELETE | `/api/productos/:id`         | Baja                                  |

## 3. Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

La app queda en `http://localhost:4200`, con dos pantallas:
- **Consultar precio** (`/consulta`): buscador manual por nombre.
- **Productos (ABM)** (`/productos`): grilla con alta, edición y baja.

## Próximos pasos sugeridos

- Agregar paginación y filtros (por categoría, stock bajo, etc.) en el listado.
- Reemplazar `synchronize: true` por migraciones de TypeORM antes de ir a producción.
- Agregar autenticación si la app va a ser usada por más de una persona.
- Dockerizar también el backend y el frontend para desplegar todo junto.
