# CursosAPI — Backend

API REST para una plataforma de cursos online, desarrollada en **ASP.NET Core 8** con **Entity Framework Core** y **SQL Server**. Permite gestionar cursos, usuarios y roles, con autenticación basada en cookies y un modelo de acceso freemium (cursos gratuitos vs. pagos).

Proyecto 100% local: se corre desde **Visual Studio**, con el perfil `https`, contra una instancia de SQL Server / LocalDB en tu propia máquina.

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura y estructura del proyecto](#arquitectura-y-estructura-del-proyecto)
- [Modelo de datos](#modelo-de-datos)
- [Roles y permisos](#roles-y-permisos)
- [Autenticación](#autenticación)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno y configuración](#variables-de-entorno-y-configuración)
- [Endpoints](#endpoints)
- [Manejo de errores](#manejo-de-errores)
- [Notas y consideraciones](#notas-y-consideraciones)

## Stack tecnológico

- **.NET 8 / ASP.NET Core Web API**
- **Entity Framework Core** (SqlServer provider) — ORM y migraciones
- **AutoMapper** — mapeo entre entidades y DTOs
- **Cookie Authentication** (`Microsoft.AspNetCore.Authentication.Cookies`) — sesión vía cookie HttpOnly
- **BCrypt** (`BC.HashPassword` / `BC.Verify`) — hash y verificación de contraseñas
- **HandlebarsDotNet** — templating de los emails HTML
- **Swagger / Swashbuckle** — documentación interactiva de la API (solo en desarrollo)

## Arquitectura y estructura del proyecto

El proyecto sigue una arquitectura en capas clásica:

```
Controllers/     → Endpoints HTTP, validación de entrada, códigos de estado
Services/        → Lógica de negocio
Repository/       → Acceso a datos genérico sobre EF Core (patrón Repository)
Models/          → Entidades de dominio (Curso, User, Role) y sus DTOs
Config/          → AppDbContext y perfiles de AutoMapper
Enums/           → Constantes de roles (ROLES)
Utils/           → Excepciones, respuestas estándar, helpers de templates
Templates/        → Plantillas HTML de los emails (Handlebars)
Migrations/      → Migraciones de EF Core
```

**Patrón Repository genérico**: `Repository<T>` implementa `IRepository<T>` con operaciones CRUD básicas (`GetAll`, `GetOne`, `CreateOne`, `UpdateOne`, `DeleteOne`, `Save`) usando expresiones LINQ como filtro. `CursoRepository` y `UserRepository` heredan de esta base; `UserRepository` sobrescribe `GetOne`/`GetAll` para incluir (`Include`) los roles del usuario.

**Servicios**: cada entidad tiene un service (`CursoService`, `UserService`, `RoleService`) que contiene las reglas de negocio (por ejemplo, verificar acceso a cursos pagos) y delega la persistencia al repository correspondiente. `AuthService` orquesta login, registro, manejo de cookies de sesión y recuperación de contraseña, apoyándose en `UserService`, `RoleService`, `IEncoderService` y `EmailService`.

## Modelo de datos

### Curso
| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | PK autogenerada |
| Titulo | string | Requerido, 5–100 caracteres |
| Descripcion | string | Requerido, 10–500 caracteres |
| ImagenPortadaUrl | string | URL válida |
| IsActivo | bool | Default `true` |
| EsPago | bool | Default `false`. Define si el curso requiere Premium |
| FechaCreacion | DateTime | UTC |
| MaterialEscrito | string | Contenido escrito del curso |
| VideoUrl | string | URL válida |
| PreguntasQuiz | List\<string\> | Preguntas del quiz final |
| PorcentajeAprobacion | int | 1–100, default 70 |

### User
| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | PK autogenerada |
| UserName | string | Único |
| Email | string | Único |
| Password | string | Hasheada con BCrypt |
| PhoneNumber | string | — |
| PasswordToken | string? | Token temporal para reset de contraseña |
| Roles | List\<Role\> | Relación muchos a muchos |

### Role
| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | PK autogenerada |
| Name | string | Único |

Los tres roles se siembran (`HasData`) automáticamente en la migración inicial:

| Id | Name | Constante en `ROLES` |
|---|---|---|
| 1 | Admin | `ROLES.Admin` |
| 2 | UserGratis | `ROLES.Free` |
| 3 | UserPremium | `ROLES.Premium` |

## Roles y permisos

La lógica de acceso a cursos se centraliza en `CursoController.TieneAccesoTotal()`:

- **Admin** y **UserPremium** → acceso total (cursos gratuitos y pagos).
- **UserGratis** y usuarios anónimos → solo cursos gratuitos (`EsPago = false`).
- Al registrarse, todo usuario nuevo recibe automáticamente el rol **UserGratis**.
- Solo un **Admin** puede reasignar roles a otros usuarios (`PUT /api/auth/update-roles/{userId}`), crear/editar/eliminar cursos, y administrar roles y usuarios.

| Endpoint | Anónimo | UserGratis | UserPremium | Admin |
|---|:---:|:---:|:---:|:---:|
| `GET /api/cursos` | ❌ | ✅ (solo gratis) | ✅ (todos) | ✅ (todos) |
| `GET /api/cursos/{id}` | ✅ (solo gratis) | ✅ (solo gratis) | ✅ (todos) | ✅ (todos) |
| `POST/PUT/DELETE /api/cursos` | ❌ | ❌ | ❌ | ✅ |
| `/api/users/*` | ❌ | ❌ | ❌ | ✅ |
| `/api/roles/*` | ❌ | ❌ | ❌ | ✅ |
| `/api/auth/register`, `/login` | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/logout`, `/me`, `/check-auth` | ❌ | ✅ | ✅ | ✅ |
| `/api/auth/update-roles/{userId}` | ❌ | ❌ | ❌ | ✅ |

## Autenticación

La autenticación **no usa JWT**, sino **cookies de sesión** (`CookieAuthenticationDefaults`):

- Cookie `HttpOnly`, `Secure` siempre, `SameSite=None` (pensada para consumirse desde un frontend en otro origen, con `credentials: include`).
- Al hacer login exitoso, el server emite la cookie con claims de `id` de usuario y un claim de `Role` por cada rol asignado.
- Los redirects por defecto de ASP.NET (a páginas de login) están deshabilitados: en su lugar la API devuelve `401` o `403` en JSON, como corresponde a una API REST.
- Recuperación de contraseña: se genera un `PasswordToken` (GUID) asociado al usuario, se envía por email (con template Handlebars) y se valida contra `/api/auth/verify-pwdtoken`.

## Instalación y puesta en marcha

### Requisitos previos

- **Visual Studio 2022** (o superior), con la carga de trabajo **ASP.NET y desarrollo web**.
- **SQL Server** (LocalDB alcanza — viene incluido con Visual Studio) o una instancia completa administrada con **SQL Server Management Studio**.

### Pasos

1. Abrí la solución (`Tp_Programacion.slnx`) en Visual Studio.
2. Configurá la connection string en `appsettings.json` si tu instancia de SQL Server no es la default (ver sección siguiente).
3. Aplicá las migraciones (crea la base de datos y siembra los roles). Desde `Tools` → `NuGet Package Manager` → `Package Manager Console`:

   ```powershell
   Update-Database
   ```

4. Arrancá el proyecto con el botón de ejecución (▶), seleccionando el perfil **`https`** en el desplegable de al lado.

Visual Studio abre el navegador automáticamente en Swagger (`/swagger`), en una URL del tipo `https://localhost:7279/swagger`.

## Variables de entorno y configuración

| Variable / Config | Ubicación | Descripción |
|---|---|---|
| `ConnectionStrings:devConnection` | `appsettings.json` | Cadena de conexión a SQL Server / LocalDB |
| `RESEND_APITOKEN` | Variable de entorno del sistema | Token de la API de Resend, usado para el envío de emails de recuperación de contraseña |

CORS está configurado explícitamente para aceptar únicamente `http://localhost:5173` (frontend en Vite) con credenciales habilitadas. Si el frontend corre en otro origen, hay que actualizar `app.UseCors(...)` en `Program.cs`.

> ⚠️ La connection string incluida en `appsettings.json` apunta a un `(localdb)\MSSQLLocalDB` local. Si preferís usar una instancia completa de SQL Server administrada con SSMS en vez de LocalDB, reemplazá la connection string por una con `Trusted_Connection=True` (autenticación de Windows) o `User Id`/`Password` (autenticación de SQL Server), apuntando al nombre de tu instancia.

## Endpoints

### `/api/auth`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registra un usuario nuevo (rol `UserGratis` por defecto) |
| POST | `/api/auth/login` | Público | Autentica y setea la cookie de sesión |
| POST | `/api/auth/logout` | Autenticado | Cierra la sesión |
| GET | `/api/auth/me` | Autenticado | Devuelve el usuario autenticado |
| GET | `/api/auth/check-auth` | Autenticado | Verifica si la sesión es válida |
| PUT | `/api/auth/update-roles/{userId}` | Admin | Reasigna los roles de un usuario (recibe `{ roleIds: number[] }`) |
| PUT | `/api/auth/generate-pwdtoken` | Autenticado | Genera y envía por mail un token de reset de contraseña |
| GET | `/api/auth/verify-pwdtoken?userId=&token=` | Autenticado | Verifica el token de reset |
| GET | `/api/auth/health` | Público | Health check |

### `/api/cursos`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/cursos` | Autenticado | Lista cursos (marca `TieneAcceso` según el rol) |
| GET | `/api/cursos/{id}` | Público | Detalle de un curso (403 si es pago y no hay acceso) |
| POST | `/api/cursos` | Admin | Crea un curso |
| PUT | `/api/cursos/{id}` | Admin | Actualiza un curso |
| DELETE | `/api/cursos/{id}` | Admin | Elimina un curso |

### `/api/users` (todo el controller requiere rol Admin)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Lista usuarios |
| GET | `/api/users/{id}` | Detalle de un usuario |
| PUT | `/api/users/{id}` | Actualiza username/email/teléfono |
| DELETE | `/api/users/{id}` | Elimina un usuario |

### `/api/roles` (todo el controller requiere rol Admin)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/roles` | Lista roles |
| GET | `/api/roles/{id}` | Detalle de un rol |
| POST | `/api/roles` | Crea un rol |
| PUT | `/api/roles/{id}` | Actualiza un rol |
| DELETE | `/api/roles/{id}` | Elimina un rol |

### Ejemplo — Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "userName": "juanperez",
  "email": "juan@mail.com",
  "password": "supersecreta1",
  "confirmPassword": "supersecreta1",
  "phoneNumber": "+541122334455"
}
```

### Ejemplo — Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "juanperez",
  "password": "supersecreta1"
}
```

Respuesta:

```json
{
  "user": {
    "id": 1,
    "userName": "juanperez",
    "email": "juan@mail.com",
    "roles": ["UserGratis"]
  }
}
```

### Ejemplo — Reasignar roles (Admin)

```http
PUT /api/auth/update-roles/5
Content-Type: application/json

{
  "roleIds": [2, 3]
}
```

> Este endpoint **reemplaza** la lista completa de roles del usuario (no
> "agrega" un rol nuevo), por lo que el array debe incluir todos los roles
> que el usuario debe tener después de la actualización.

## Manejo de errores

La API centraliza los errores de negocio en la excepción `ErrorResponse`, que lleva un `HttpStatusCode` y un mensaje; los controllers la capturan y devuelven el status code correspondiente junto a un `ResponseMessage`. Los errores no controlados devuelven `500` con el mensaje de la excepción.

Los errores de validación de modelo (`[Required]`, `[MinLength]`, `[Url]`, etc.) se interceptan globalmente en `Program.cs` y se devuelven como `400 Bad Request` con el siguiente formato:

```json
{
  "errors": {
    "Titulo": ["The Titulo field is required."]
  }
}
```

## Notas y consideraciones

- La autenticación es 100% por cookie (no hay soporte de tokens Bearer/JWT), por lo que el frontend debe hacer las requests con `credentials: 'include'` (o `withCredentials: true` en axios).
- CORS solo permite el origen `http://localhost:5173`; ajustar según el puerto real del frontend si difiere.
- El proyecto se ejecuta enteramente en local para esta entrega: backend desde Visual Studio (perfil `https`) y frontend con `npm run dev`, ambos consumiéndose entre sí en `localhost`.
