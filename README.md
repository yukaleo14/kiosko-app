# Kiosko - Gestión y Consulta de Productos

Aplicación web integral para la administración y consulta de inventario para kioscos y comercios: alta, baja, modificación, control de stock y búsqueda de precios en tiempo real.

El sistema es **multiusuario (multitenant)**: cada comerciante se registra con su propio usuario, gestiona un catálogo de productos totalmente aislado y puede personalizar la apariencia visual de la plataforma (colores institucionales, marca y nombre del local).

**Stack Tecnológico:**
- **Backend:** NestJS 10 + TypeORM + PostgreSQL + Passport JWT
- **Frontend:** Angular 17 (Standalone Components, Signals/RxJS, SweetAlert2, Hot-Toast)
- **Base de Datos & Entorno Local:** PostgreSQL 16 + Adminer en Docker Compose

---

## Estructura del Proyecto

```
kiosko-app/
├── docker-compose.yml          # PostgreSQL 16 y Adminer
├── backend/                    # API REST con NestJS
│   └── src/
│       ├── app.module.ts       # Configuración global y conexión a PostgreSQL
│       ├── main.ts             # Configuración de CORS y ValidationPipe global
│       ├── auth/               # Autenticación (Login, Registro, JWT 24h)
│       ├── usuario/            # Perfil y personalización visual (colores y marca)
│       └── productos/          # ABM de productos, categorías y búsqueda
└── frontend/                   # Single Page Application con Angular 17
    └── src/app/
        ├── models/             # Interfaces TypeScript
        ├── services/           # Servicios HTTP (Auth, Usuario, Producto)
        ├── guards/             # Protección de rutas con JWT
        └── components/
            ├── login/          # Inicio de sesión con persistencia y autocompletado
            ├── registro/       # Registro de nuevos kioskos
            ├── perfil/         # Personalización en vivo de marca y paleta de colores
            ├── producto-buscar/# Consulta de precios reactiva en tiempo real
            ├── producto-list/  # Grilla ABM con ordenamiento, paginación y SweetAlert2
            └── producto-form/  # Formulario modal de producto y gestión de categorías
```

---

## 1. Base de Datos Local (Docker Compose)

Para iniciar el contenedor de PostgreSQL y la herramienta de administración web (Adminer):

```bash
docker compose up -d
```

### Servicios incluidos:
- **PostgreSQL 16:** Disponible en `localhost:5433` (mapeado al puerto interno 5432 para evitar conflictos con instancias existentes en el sistema).
- **Adminer:** Disponible en `http://localhost:8080`.

#### Conexión a Adminer:
| Campo | Valor |
|-------|-------|
| **Sistema** | PostgreSQL |
| **Servidor** | `db` |
| **Usuario** | `kiosko_user` |
| **Contraseña** | `kiosko_pass` |
| **Base de datos** | `kiosko_db` |

---

## 2. Backend (NestJS)

### Instalación y ejecución:

```bash
cd backend
npm install
npm run start:dev
```

La API estará disponible en `http://localhost:3000/api`.

### Variables de Entorno (`backend/.env`):
Crea un archivo `.env` en la raíz de `backend/` con la siguiente estructura de ejemplo:

```env
PORT=3000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=kiosko_user
DB_PASSWORD=kiosko_pass
DB_DATABASE=kiosko_db
DB_SSL=false

# Orígenes permitidos (CORS)
CORS_ORIGIN=http://localhost:4200

# Seguridad y Autenticación
JWT_SECRET=tu_clave_secreta_jwt_segura_y_aleatoria
JWT_EXPIRES_IN=24h
```

### Endpoints Principales

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro de usuario/kiosko |
| `POST` | `/api/auth/login` | Inicio de sesión (retorna token JWT con vigencia de 24h) |
| `GET` | `/api/usuario/perfil` | Obtiene el perfil y colores del kiosko autenticado |
| `PATCH` | `/api/usuario/perfil` | Actualiza colores y datos del kiosko |
| `GET` | `/api/productos` | Lista todos los productos pertenecientes al usuario |
| `GET` | `/api/productos/buscar?nombre=` | Búsqueda parcial por nombre insensible a mayúsculas (`ILike`) |
| `GET` | `/api/productos/categorias` | Lista categorías únicas asociadas a los productos del usuario |
| `POST` | `/api/productos` | Crea un nuevo producto |
| `PATCH` | `/api/productos/:id` | Actualiza un producto existente |
| `DELETE` | `/api/productos/:id` | Elimina un producto |
| `DELETE` | `/api/productos/categorias?nombre=` | Desasigna y elimina una categoría existente |

---

## 3. Frontend (Angular 17)

### Instalación y ejecución:

```bash
cd frontend
npm install
npm start
```

La aplicación se abrirá en `http://localhost:4200`.

### Vistas y Funcionalidades:
- **Consulta de Precios (`/consulta`):** Pantalla principal y rápida de atención al cliente. Filtra productos de forma reactiva a medida que se escribe cada letra.
- **Gestión de Inventario (`/productos`):** Grilla completa con paginación, filtros dinámicos, ordenamiento por columnas y diálogo de confirmación interactivo vía SweetAlert2 para eliminar productos.
- **Formulario de Producto (`app-producto-form`):** Alta y edición con selector de categorías y opción rápida para eliminar categorías no deseadas.
- **Inicio de Sesión y Registro (`/login`, `/registro`):** Autenticación por nombre de usuario con opción *"Recordar mi sesión"*, soporte para gestores de contraseñas de navegador y redirección automática.
- **Personalización de Perfil (`/perfil`):** Editor visual para nombre del local, submarca y paleta de colores (`colorHeader`, `colorMarca`, botones y tipografías), reflejado al instante en toda la aplicación.
- **Notificaciones:** Integración de alertas emergentes con `@ngneat/hot-toast` para confirmar operaciones de forma limpia y moderna.

---

## 4. Despliegue en Producción

Arquitectura cloud recomendada:
- **Base de datos:** Servicio administrado PostgreSQL (por ejemplo [Aiven](https://aiven.io), Supabase, Neon o Render PostgreSQL).
- **Backend:** [Render](https://render.com) (Web Service) o Railway.
- **Frontend:** [Render](https://render.com) (Static Site), Vercel o Netlify.

> **Seguridad:** En entornos de producción, define contraseñas seguras, activa `DB_SSL=true` y especifica un `JWT_SECRET` robusto y exclusivo mediante variables de entorno en tu panel de hosting. Nunca expongas credenciales o tokens en repositorios públicos.
