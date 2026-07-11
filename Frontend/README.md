# devCursos — Frontend

Frontend en React + Vite para el TP de Programación 4 (UTN San
Nicolás), consumiendo el back [CursosAPI](https://github.com/lazk1/CursosAPI).

Proyecto 100% local: se corre con `npm install` + `npm run dev`, consumiendo
el backend en `http://localhost` (ver README del Backend para levantarlo
desde Visual Studio).

> Existe también una versión desplegada de este mismo frontend en Vercel,
> a modo de referencia:
> **https://cursos-api.vercel.app**
> _(la versión de referencia para la demo y corrección es la local)._

## Stack

- **React 18** + **Vite**
- **wouter** — ruteo del lado del cliente
- **axios** — cliente HTTP (`withCredentials: true`, ver nota de Auth)
- **zustand** — estado global de sesión (`src/store/authStore.js`)
- **zod + react-hook-form** — validación de formularios (login, registro, alta/edición de cursos)
- **React.lazy + Suspense** — `CursoDetailPage` y `AdminPage`
- **recharts** — gráfico de cursos por tipo en el panel admin (`AdminStatsTab`)
- **Tailwind CSS v4** — estilos, con la misma paleta violeta/dark del maquetado
- **lucide-react** — set de íconos

## Instalación

```bash
npm install
cp .env.example .env
# editá .env si tu back corre en otro puerto/URL
npm run dev
```

La app levanta en `http://localhost:5173` (puerto fijo en `vite.config.js`
porque el back tiene el CORS hardcodeado a ese origen).

### Build de producción

```bash
npm run build      # genera la carpeta dist/ optimizada para producción
npm run preview     # sirve dist/ localmente para probar el build
```

## Cobertura de los requisitos técnicos del enunciado

| Requisito | Dónde está |
|---|---|
| `useState` (2+ estados locales) | `App.jsx` (tema oscuro/claro), y en cada tab de `pages/admin/*` (filtros, modales abiertos, loading) |
| `useEffect` | `App.jsx` (aplicar clase de tema, revalidar sesión al montar), `CursosPage`/`AdminPage` (fetch inicial de datos) |
| `wouter` | Rutas `/`, `/login`, `/cursos`, `/cursos/:id`, `/admin` definidas en `App.jsx` |
| `axios` | Toda llamada HTTP pasa por `src/lib/api.js` (instancia única con `withCredentials`) |
| Lazy loading | `CursoDetailPage` y `AdminPage`, con `React.lazy` + `Suspense` (`App.jsx`) |
| `zustand` | `src/store/authStore.js`, sesión y datos del usuario logueado |
| `zod` + `react-hook-form` | `src/schemas/index.js` + formularios de login, registro y alta/edición de curso (`@hookform/resolvers/zod`) |

## ⚠️ Auth: el back usa cookies, no JWT

El enunciado sugiere JWT, pero `CursosAPI` implementa autenticación por
**cookie httpOnly** (`AddCookie` + `SignInAsync` en `AuthService.SetCookie`).
Por eso:

- No hay ningún token que guardar ni mandar en `Authorization`. El navegador
  maneja la cookie sola.
- Todas las llamadas de axios van con `withCredentials: true`
  (`src/lib/api.js`), y el back tiene `AllowCredentials()` en su CORS.
- El store de auth (`authStore.js`) persiste únicamente los datos del
  usuario devuelto por el back (para evitar un parpadeo al recargar la
  página), y en el montaje de `App` se revalida siempre contra
  `GET /api/auth/me` (`checkSession`).

Al correr todo en `localhost`, el navegador trata la conexión como contexto
seguro, así que la cookie funciona sin necesidad de HTTPS real.

## Cómo pasar un usuario de Free a Premium

Es la funcionalidad clave del proyecto. Flujo implementado en
`pages/admin/AdminUsuariosTab.jsx`:

1. El admin entra a `/admin` → pestaña **Usuarios**.
2. El front trae `GET /api/roles` (para saber los `id` de `UserGratis` /
   `UserPremium`) y `GET /api/users`.
3. Al togglear el switch de Premium, se llama a
   `PUT /api/auth/update-roles/{userId}` con
   `{ roleIds: [...idsActuales_sin_freePremium, idPremium] }`.

Ojo: ese endpoint **reemplaza** la lista completa de roles del usuario (no
"agrega"), así que el front arma el array preservando cualquier otro rol que
tuviera (ej. si en el futuro un user es Admin + Premium a la vez). Los
usuarios con rol Admin, y el propio usuario logueado, no muestran el
toggle (no se puede sacar permisos a uno mismo por accidente).

## Quiz y reproducción de video

Dos partes del dominio "Curso" que tienen lógica propia, separada en `lib/`:

- **`lib/quiz.js`** — el backend guarda las preguntas del quiz como un
  array de strings (`preguntasQuiz: string[]`). Para soportar preguntas de
  opción múltiple sin tocar el modelo del backend, cada pregunta se
  serializa como un string JSON con un prefijo (`__QUIZ__{...}`). Este
  archivo expone las funciones para crear, serializar y parsear esas
  preguntas. Si encuentra una pregunta en el formato viejo (texto plano),
  la muestra igual, pero solo como informativa (no autocorregible).
  - `QuizBuilder.jsx` — usa estas funciones para armar el formulario donde
    el admin carga las preguntas al crear/editar un curso.
  - `QuizPlayer.jsx` — usa estas funciones para renderizar el quiz al
    alumno y corregir sus respuestas.

- **`lib/video.js`** — recibe la URL de video cargada por el admin y
  detecta de qué proveedor es (YouTube, Vimeo, o un archivo `.mp4`/`.webm`
  directo), devolviendo cómo embeberla en la página en vez de abrirla en
  una pestaña aparte. Si no reconoce el formato, cae a un link normal.
  - `VideoPlayer.jsx` — consume `resolveVideoEmbed()` para renderizar el
    video incrustado en la vista de detalle del curso.

## Estructura

```
src/
  components/
    Navbar.jsx           Barra de navegación superior
    CourseCard.jsx        Tarjeta de curso (usada en el listado)
    ProtectedRoute.jsx    Guard de rutas (login / admin requerido)
    Toast.jsx             Sistema de notificaciones (éxito/error)
    Loader.jsx            Spinners / loaders de página
    QuizBuilder.jsx        Formulario admin para cargar preguntas del quiz
    QuizPlayer.jsx          Renderizado y corrección del quiz para el alumno
    VideoPlayer.jsx         Reproductor embebido de video del curso
  lib/
    api.js                instancia de axios + parseo de errores del back
    quiz.js               serialización/parseo de preguntas del quiz
    video.js               detección y armado de embeds de video
  pages/
    HomePage.jsx
    LoginPage.jsx
    CursosPage.jsx
    CursoDetailPage.jsx    (lazy)
    AdminPage.jsx          (lazy)
    admin/
      AdminCursosTab.jsx    listado/alta/edición de cursos
      AdminUsuariosTab.jsx  gestión de usuarios y rol Premium
      AdminStatsTab.jsx     estadísticas (recharts)
      CursoFormModal.jsx    modal de alta/edición de curso
  schemas/
    index.js               esquemas zod (login, registro, curso)
  services/
    authService.js          llamadas a /api/auth
    cursoService.js          llamadas a /api/cursos
    adminServices.js         llamadas a /api/users y /api/roles
  store/
    authStore.js             estado global de sesión (zustand)
  styles/
    index.css                estilos globales (Tailwind)
```

## Decisiones de diseño / cosas para mencionar en el informe

- Las rutas de listado/detalle se llamaron `/cursos` y `/cursos/:id` en vez
  de `/elementos` (literal del enunciado), porque el dominio elegido es
  "Curso". Si el profesor quiere el nombre literal `/elementos`, es un
  cambio de una línea en `App.jsx`.
- El botón "Ver solución"/roles de bug tracker del maquetado de referencia
  (sección "Bugs") no se implementó: no está en los requisitos funcionales
  del enunciado, solo era parte del estilo visual de referencia (midu.dev).
- Feedback visual: toasts propios (`components/Toast.jsx`), skeletons de
  carga (`components/Loader.jsx`), y estados vacíos/error en cada página,
  según pide la sección de UX del enunciado.
- El quiz soporta preguntas de opción múltiple con corrección automática,
  serializadas dentro del campo `preguntasQuiz` sin necesitar cambios en el
  modelo del backend (ver sección "Quiz y reproducción de video").

## Pendiente / bonus no implementado

- Interceptor de refresh de token (no aplica: no hay JWT).
- Tests automatizados.
- Swagger — ya está expuesto por el back en desarrollo (`/swagger`).
