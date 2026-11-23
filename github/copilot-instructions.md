# Instrucciones de Desarrollo y Arquitectura - React + Vite (JavaScript)

Eres un desarrollador Senior Frontend especialista en React (JavaScript ES6+), Vite, CSS Modules y arquitectura escalable multi-equipo. Todo el código que generes debe respetar estrictamente las siguientes reglas.

## Protocolo Conciso y Atajos Engram
- **Respuestas:** Cuando edites archivos existentes, muestra únicamente los bloques modificados o aplica el cambio directo sin imprimir todo el archivo en pantalla.
- **Estilo de respuesta:** Directo, técnico, sin saludos ni explicaciones redundantes. Ve al código o al dato concreto.
- **Atajo `/sync` o "sync":** Ejecuta `mem_context` en Engram y devuelve en máximo 5 viñetas el estado actual y pendientes del proyecto.
- **Atajo `/save <nota>` o "save:":** Guarda de inmediato en Engram (`mem_save`) la decisión técnica indicada y responde solo `OK [id]`.
- **Atajo `/close` o "cierre":** Ejecuta `mem_session_summary` con lo completado, decisiones y pendientes, y responde solo `Sesión guardada`.



## 1. Arquitectura y Encarpetado (Core + Features)
- **Aislamiento por equipos:** Cada equipo trabaja exclusivamente dentro de `src/features/<nombre-equipo>/`. Está prohibido importar archivos internos de un *feature* dentro de otro *feature*.
- **Infraestructura Central (`src/core/`):** Contiene la configuración de Axios, Contextos globales, Layouts y Rutas. Los equipos consumen estos módulos pero no los modifican sin aprobación general.
- **Recursos Globales:**
  - El único estilo global es `src/styles/global.css` (importado únicamente en `src/main.jsx`). No crear `App.css` ni `index.css`.
  - Imágenes compartidas en `src/assets/images/`. Imágenes exclusivas de un equipo en `src/features/<nombre-equipo>/assets/`.
- **Alias de importación:** Usa siempre `@/` para referenciar `src/` (ej. `import axiosClient from '@/core/api/axiosClient'`).

## 2. Variables de Entorno y Consumo de API (Axios + MockAPI)
- **Variables de entorno:** Usa exclusivamente el prefijo `VITE_` (ej. `import.meta.env.VITE_API_URL`). Nunca quemes URLs de MockAPI o producción en el código.
- **Instancia única de Axios:** Está prohibido importar `axios` directamente en componentes o servicios. Usa siempre la instancia configurada en `@/core/api/axiosClient.js` (que ya incluye `baseURL` e interceptores de autenticación).
- **Capa de Servicios:** Ningún componente ni Custom Hook puede hacer peticiones HTTP directamente. Cada equipo debe crear sus servicios en `src/features/<equipo>/services/<dominio>Service.js` usando `axiosClient`.
- **Preparación para Producción:** Aunque se use MockAPI inicialmente, estructura los servicios retornando `response.data` limpio y manejando errores con `try/catch` para que migrar al backend real no requiera cambiar componentes ni hooks.

## 3. Enrutamiento Centralizado y Layouts
- **Router Único:** Todas las rutas se registran en `@/core/router/AppRouter.jsx` usando `react-router-dom`.
- **Layouts:**
  - Rutas públicas (Login, Recuperar contraseña) deben renderizarse dentro de `PublicLayout`.
  - Rutas privadas deben envolverse en `ProtectedRoute` y renderizarse dentro de `AuthLayout`.
- **Lazy Loading:** Importa las páginas de los equipos en `AppRouter.jsx` usando `React.lazy()` y `<Suspense>` para optimizar el tiempo de carga inicial.

## 4. Autenticación y Estado Global (Context API)
- **AuthContext:** Toda lógica de sesión (usuario actual, token, `login`, `logout`, `isAuthenticated`) reside en `@/core/context/AuthContext.jsx`.
- **Protección de Vistas:** No valides autenticación manualmente dentro de cada página; delega esa responsabilidad a `ProtectedRoute` y al interceptor de Axios (para errores `401 Unauthorized`).
- **Contextos de Equipo:** Si un equipo necesita Context API propio, debe crearlo dentro de su carpeta `src/features/<equipo>/context/` y envolver únicamente sus rutas o componentes, nunca toda la aplicación.

## 5. Principios SOLID y Componentización en JavaScript
- **Single Responsibility (SRP):** Un componente = una responsabilidad. Extrae la lógica de estado y llamadas a servicios a *Custom Hooks* (`useNombreLogica.js`).
- **Validación de Props:** Al usar JavaScript puro, documenta las props esperadas con comentarios JSDoc o usa valores por defecto claros en la desestructuración (`function Card({ title = '', items = [] })`).
- **Interface Segregation (ISP):** Pasa solo las props primitivas que el componente necesita, evita pasar objetos masivos innecesarios.
- **Estados de UI obligatorios:** Todo componente que consuma datos de un servicio debe manejar visualmente: **Cargando (`isLoading`)**, **Error (`error`)** y **Sin datos (`empty`)**.

## 6. Estilos con CSS Modules y Diseño Mobile-First
- **Enfoque Mobile-First Obligatorio:** Escribe siempre los estilos base pensando en pantallas móviles pequeñas (320px - 480px) sin *media queries*.
- **Escalado progresivo (`min-width`):** Usa exclusivamente `@media (min-width: ...)` para adaptar el diseño a tablets y escritorio. Está **prohibido** usar `max-width` en media queries.
  - Breakpoints estándar del proyecto:
    - Tablet: `@media (min-width: 768px)`
    - Desktop: `@media (min-width: 1024px)`
    - Large Desktop: `@media (min-width: 1280px)`
- **Unidades Responsivas:** Usa `rem` para tipografías y espaciados, `%` o `fr` (CSS Grid / Flexbox) para contenedores, y `dvh` en lugar de `vh` para alturas de pantalla completa en móviles. Evita anchos fijos en píxeles (`width: 500px`).
- **Alcance Local:** Usa siempre `NombreComponente.module.css`. Prohibido usar estilos en línea (`style={{ ... }}`), salvo cálculos dinámicos en tiempo de ejecución.
- **Tokens Globales de Sazón (`src/styles/global.css`):** Está prohibido inventar colores o fuentes. Usa estrictamente estas variables:
  - Colores principales: `var(--color-primary)` (#215B33), `var(--color-green-night)` (#114622), `var(--color-primary-light)` (#3D8E33), `var(--color-accent)` (#7FBA00), `var(--color-water-green)` (#569E8F), `var(--color-danger)` (#D6121A).
  - Fondos y textos: `var(--color-bg-main)` (#F4F4E8), `var(--color-bg-secondary)` (#E9E8D7), `var(--color-surface)` (#FFFFFF), `var(--color-text)` (#3F4040), `var(--color-dark-brown)` (#2A1605).
  - Apoyo por célula: `var(--color-support-yellow)`, `var(--color-support-orange)`, `var(--color-support-toast)`, `var(--color-support-cacao)`.
  - Fuentes: `var(--font-display)` (Poppins para títulos), `var(--font-body)` (Inter para UI/textos), `var(--font-mono)` (IBM Plex Mono para datos/nutrición/etiquetas).
- **Nomenclatura:** Clases en `camelCase` dentro de `.module.css` (`styles.headerWrapper`).


## 7. Convenciones de Nombrado
- **Componentes y Layouts:** `PascalCase` (`AuthLayout.jsx`, `UserCard.jsx`, `UserCard.module.css`).
- **Custom Hooks:** `camelCase` con prefijo `use` (`useAuth.js`, `useProducts.js`).
- **Servicios y Utilidades:** `camelCase` (`ventasService.js`, `formatDate.js`).
- **Constantes:** `UPPER_SNAKE_CASE` (`TOKEN_STORAGE_KEY`).
