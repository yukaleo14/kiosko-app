# Kiosko - ABM de productos

Base de proyecto para gestionar productos de un kiosko: alta, baja, modificación y consulta manual de precio por nombre. 

El sistema soporta múltiples kioskos (multiusuario). Cada dueño puede registrarse, personalizar el aspecto visual de su plataforma (colores y logo) y tener su propio inventario de productos aislado.

**Stack:** NestJS + TypeORM (backend) · Angular standalone (frontend) · MySQL en Docker.

```
kiosko-app/
├── docker-compose.yml      # MySQL + Adminer
├── backend/                # API REST NestJS
│   └── src/
│       ├── app.module.ts
│       ├── main.ts
│       ├── auth/           # Login, Registro y JWT
│       ├── usuario/        # Gestión y personalización del perfil
│       └── productos/      # Entidad relacionada al usuario, dto, service, controller
└── frontend/                # SPA Angular
    └── src/app/
        ├── models/
        ├── services/
        └── components/
            ├── login/             # Inicio de sesión
            ├── registro/          # Registro de nuevos kioskos
            ├── perfil/            # Personalización de colores y nombre
            ├── producto-buscar/   # Pantalla de consulta por nombre
            ├── producto-list/     # Grilla del ABM
            └── producto-form/     # Alta / Edición
```

## 1. Levantar la base de datos

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto levanta:
- **MySQL** en `localhost:3306` 
- **Adminer** en `http://localhost:8080`
Servidor: mysql
Usuario: kiosko_user
Contraseña: kiosko_pass
Base de datos: kiosko_db


## 2. Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

La API queda en `http://localhost:3000/api`. Como `synchronize: true` está activo en
`app.module.ts`, las tablas de base de datos se crearán solas la primera vez (cómodo para desarrollo; para producción conviene desactivarlo y usar migraciones de TypeORM).

### Endpoints Principales

| Método | Ruta                         | Acción                              |
|--------|------------------------------|--------------------------------------|
| POST   | `/api/auth/register`         | Registrar un nuevo usuario           |
| POST   | `/api/auth/login`            | Iniciar sesión y obtener JWT         |
| GET    | `/api/usuario/perfil`        | Obtener personalización del kiosko   |
| PATCH  | `/api/usuario/perfil`        | Modificar colores y nombre           |
| GET    | `/api/productos`             | Listar todos los productos (del usuario logueado) |
| GET    | `/api/productos/buscar?nombre=` | Consulta manual por nombre        |
| POST   | `/api/productos`             | Alta de producto                     |

## 3. Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

La app queda en `http://localhost:4200`, con las siguientes pantallas:
- **Login y Registro** (`/login` y `/registro`): Acceso a la plataforma.
- **Consultar precio** (`/consulta`): Buscador manual por nombre (requiere sesión).
- **Productos (ABM)** (`/productos`): Grilla con alta, edición y baja.
- **Editar Perfil** (`/perfil`): Personalización en tiempo real del branding del kiosko.

## Autenticación, Multiusuario y Personalización

Anteriormente la aplicación estaba diseñada para un único kiosko mediante variables de entorno. Ahora el sistema es completamente **multiusuario**:

1. **Aislamiento de Datos**: Cuando te registras e inicias sesión, el backend vincula un token JWT (que expira en unas horas). Todas tus peticiones a la API irán firmadas con este token y **sólo verás los productos de tu kiosko**.
2. **Personalización del Kiosko (Perfil)**: Cada usuario tiene configuraciones como `nombreLocal`, `marca`, `colorHeader` y `colorMarca`. 
3. **Equilibrio Visual**: Al iniciar sesión y actualizar el perfil, toda la interfaz (botones principales, navegación y topbar) hereda los colores automáticamente generando una experiencia única para cada cliente.

### Variables de Entorno del Backend
Asegúrate de tener un archivo `.env` configurado en `backend/`:

```
JWT_SECRET=una-cadena-larga-y-aleatoria-que-solo-vos-conozcas
```

## Despliegue 

Stack recomendado:
- **Base de datos MySQL** → [Aiven](https://aiven.io/free-mysql-database) (plan Free permanente, sin tarjeta)
- **Backend NestJS** → [Render](https://render.com) (Web Service, plan Free, sin tarjeta)
- **Frontend Angular** → Render (Static Site, plan Free) — también podés usar Vercel o Netlify