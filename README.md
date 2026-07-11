# CursosAPI

Proyecto fullstack desarrollado para el Examen Práctico de **Programación 4**
(UTN San Nicolás): una plataforma de cursos online con autenticación,
autorización por roles y panel de administración con estadísticas.

El "elemento" elegido como dominio central del proyecto es el **Curso**
(título, descripción, video, material escrito, quiz de autoevaluación),
con un modelo de acceso freemium: algunos cursos son gratuitos y otros
requieren rol **Premium**.

## Estructura del repositorio (monorepo)

```
CursosAPI/
├── Backend/
│   └── Tp_Programacion/     API REST en ASP.NET Core + Entity Framework Core
├── Frontend/                 SPA en React + Vite
└── README.md                 Este archivo
```

Cada carpeta tiene su propio README con el detalle técnico:

- **[Backend/README.md](./Backend/README.md)** — stack, arquitectura en capas, modelo de datos, roles y permisos, autenticación, instalación, endpoints y ejemplos de uso.
- **[Frontend/README.md](./Frontend/README.md)** — stack, instalación, cobertura de los requisitos del enunciado, flujo de asignación de rol Premium, estructura de carpetas.

## Stack general

| Capa      | Tecnologías |
|-----------|-------------|
| Frontend  | React, Vite, wouter, axios, zustand, zod, react-hook-form, recharts, Tailwind CSS |
| Backend   | ASP.NET Core Web API, Entity Framework Core, SQL Server, AutoMapper |

## Arquitectura en capas (backend)

El backend sigue una arquitectura en capas (onion), tal como pide la
consigna: los controladores nunca acceden a la base de datos directamente,
siempre pasan por un Service, que a su vez usa un Repository.

- **Models** — entidades del dominio (`Curso`, `User`, `Role`) y sus DTOs.
- **Repository** — acceso a datos vía Entity Framework Core.
- **Services** — lógica de negocio (por ejemplo, verificar acceso a cursos pagos).
- **Controllers** — endpoints REST, validación de entrada, códigos de estado.

Ver el detalle completo en [Backend/README.md](./Backend/README.md).

## Cómo correr el proyecto (versión resumida)

El proyecto se corre íntegramente en local, con el backend y el frontend
cada uno en su propia terminal/IDE:

1. **Backend**: abrir la solución en Visual Studio y arrancar con el perfil
   `https` (ver [Backend/README.md](./Backend/README.md) para el detalle de
   migraciones y configuración de la base).
2. **Frontend**: `npm install` + `npm run dev` (ver
   [Frontend/README.md](./Frontend/README.md)).

## Autenticación y roles

A diferencia de lo sugerido en la consigna (JWT), el proyecto implementa
autenticación por **cookie httpOnly**, gestionada por ASP.NET Core. La
justificación técnica completa está en el README del Frontend, sección
"Auth: el back usa cookies, no JWT".

Roles del sistema:
- **Admin** — gestión total: usuarios, roles y cursos.
- **UserPremium** — acceso a todos los cursos (gratuitos y pagos).
- **UserGratis** — rol por defecto al registrarse, solo accede a cursos gratuitos.

## Documentación de la API

La API expone Swagger en modo desarrollo (`/swagger`), con el detalle
completo de cada endpoint, DTO y ejemplo de request/response también
disponible en [Backend/README.md](./Backend/README.md).

## Despliegue

La app de referencia para la corrección corre en local. De todas formas,
existe también una versión del frontend desplegada, a modo de muestra:

**https://cursos-api.vercel.app**

## Integrantes

const integrantes = [
  { name: "Cerdán Lázaro" },
  { name: "García Valentín" },
  { name: "Olivera Santiago" },
  { name: "Rocha Thiago" },
  { name: "Vince Agustín" },
];
