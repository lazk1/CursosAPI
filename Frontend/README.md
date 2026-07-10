# devCursos — Frontend

Frontend en React + Vite + TypeScript para el TP de Programación 4 (UTN San
Nicolás), consumiendo el back [CursosAPI](https://github.com/lazk1/CursosAPI).

## Stack

- **React 18** + **Vite** + **TypeScript**
- **wouter** — ruteo (`/`, `/login`, `/cursos`, `/cursos/:id`, `/admin`)
- **axios** — cliente HTTP (`withCredentials: true`, ver nota de Auth)
- **zustand** — estado global de sesión (`src/store/authStore.ts`)
- **zod + react-hook-form** — validación de formularios (login, registro, alta/edición de cursos)
- **React.lazy + Suspense** — `CursoDetailPage` y `AdminPage`
- **recharts** — gráfico de cursos por tipo en el panel admin
- **Tailwind CSS v4** — estilos, con la misma paleta violeta/dark del maquetado

## Instalación

```bash
npm install
cp .env.example .env
# editá .env si tu back corre en otro puerto/URL
npm run dev
```

La app levanta en `http://localhost:5173` (puerto fijo en `vite.config.ts`
porque el back tiene el CORS hardcodeado a ese origen).

## ⚠️ Auth: el back usa cookies, no JWT

El enunciado sugiere JWT, pero `CursosAPI` implementa autenticación por
**cookie httpOnly** (`AddCookie` + `SignInAsync` en `AuthService.SetCookie`).
Por eso:

- No hay ningún token que guardar ni mandar en `Authorization`. El navegador
  maneja la cookie solo.
- Todas las llamadas de axios van con `withCredentials: true`
  (`src/lib/api.ts`), y el back tiene `AllowCredentials()` en su CORS.
- El store de auth (`authStore.ts`) persiste únicamente los datos del
  `UserDTO` (para evitar un parpadeo al recargar la página), y en el montaje
  de `App` se revalida siempre contra `GET /api/auth/me`.

**Importante para el deploy:** la cookie se configura con
`SecurePolicy = Always` y `SameSite = None`. Eso significa que **el back
tiene que estar servido por HTTPS** (o `localhost`, que los navegadores
tratan como contexto seguro) para que la cookie se guarde y se reenvíe. Si
despliegan el back en un dominio público sin HTTPS, el login "funciona" (200
OK) pero el navegador descarta la cookie silenciosamente y las siguientes
peticiones autenticadas van a fallar con 401. Antes de la entrega, prueben el
flujo completo contra la URL de producción, no solo en local.

## Cómo pasar un usuario de Free a Premium

Es la funcionalidad clave del proyecto. Flujo implementado en
`AdminUsuariosTab.tsx`:

1. El admin entra a `/admin` → pestaña **Usuarios**.
2. El front trae `GET /api/roles` (para saber los `id` de `UserGratis` /
   `UserPremium`) y `GET /api/users`.
3. Al tocar **"Hacer Premium"**, se llama a
   `PUT /api/auth/update-roles/{userId}` con
   `{ roleIds: [...idsActuales_sin_freePremium, idPremium] }`.

Ojo: ese endpoint **reemplaza** la lista completa de roles del usuario (no
"agrega"), así que el front arma el array preservando cualquier otro rol que
tuviera (ej. si en el futuro un user es Admin + Premium a la vez).

## Estructura

```
src/
  components/     Navbar, CourseCard, ProtectedRoute, Toast, Loader
  lib/api.ts       instancia de axios + parseo de errores del back
  pages/           HomePage, LoginPage, CursosPage, CursoDetailPage, AdminPage
  pages/admin/     pestañas del panel: Cursos, Usuarios, Estadísticas
  schemas/         esquemas zod (login, registro, curso)
  services/        llamadas a la API (auth, cursos, roles, usuarios)
  store/           authStore (zustand)
  types/           tipos que espejan los DTOs de C#
```

## Decisiones de diseño / cosas para mencionar en el informe

- Las rutas de listado/detalle se llamaron `/cursos` y `/cursos/:id` en vez
  de `/elementos` (literal del enunciado), porque el dominio elegido es
  "Curso". Si el profesor quiere el nombre literal `/elementos`, es un
  cambio de una línea en `App.tsx`.
- El botón "Ver solución"/roles de bug tracker del maquetado de referencia
  (sección "Bugs") no se implementó: no está en los requisitos funcionales
  del enunciado, solo era parte del estilo visual de referencia (midu.dev).
- Feedback visual: toasts propios (`components/Toast.tsx`), skeletons de
  carga, y estados vacíos/error en cada página, según pide la sección de UX
  del enunciado.

## Pendiente / bonus no implementado

- Interceptor de refresh de token (no aplica: no hay JWT).
- Tests automatizados.
- Swagger — ya está expuesto por el back en desarrollo (`/swagger`).
