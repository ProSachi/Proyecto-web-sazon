# Guía de Desarrollo por Célula - Proyecto Sazón

Este documento establece el estándar técnico y el flujo paso a paso que cada célula debe seguir para construir su módulo en React y conectarlo a la plataforma sin generar conflictos con otros equipos.

---

## 1. Construcción de Vistas y Relación con los Layouts

### ¿Qué debes construir y qué NO?
* **Tu alcance:** Cada célula diseña **únicamente el contenido central** de su vista dentro de `src/features/<tu-celula>/pages/`.
* **Fuera de tu alcance:** **Nunca** incluyas barras de navegación (`<header>`), menús laterales (`<aside>`) ni pies de página (`<footer>`) dentro de tus páginas. La plataforma ya cuenta con `PublicLayout` (visitantes) y `AuthLayout` (usuarios autenticados) que envuelven automáticamente tu vista.

### ¿Cómo se conecta tu vista al Layout?
1. Crea tu vista principal (ej. `src/features/despensa/pages/DespensaPage.jsx`) exportándola por defecto (`export default function DespensaPage()`).
2. Registra la ruta en el archivo central `src/core/router/AppRouter.jsx` usando `React.lazy()`.
3. Ubica tu `<Route>` dentro del grupo correspondiente:
   * **Rutas públicas** (ej. Landing, Login): Dentro de `PublicLayout`.
   * **Rutas de exploración libre** (ej. Catálogo, Recetas): Dentro de `AdaptiveLayout` (se adapta solo según si el usuario inició sesión o no).
   * **Rutas privadas** (ej. Despensa, Planificador): Dentro de `ProtectedRoute` + `AuthLayout`.
4. React Router inyectará automáticamente tu página dentro del `<Outlet />` del Layout asignado.

---

## 2. Consumo de Datos: Axios y Capa de Servicios

Para evitar refactorizaciones masivas cuando migremos de **MockAPI** al backend real en **Spring Boot**, está prohibido hacer peticiones HTTP dentro de los componentes visuales.

### Flujo obligatorio de datos
```text
Componente (.jsx) ──▶ Custom Hook (useNombre.js) ──▶ Servicio (nombreService.js) ──▶ axiosClient.js ──▶ API
```

1. **Cliente único (`axiosClient`):** Nunca importes `axios` directamente desde `node_modules`. Importa siempre nuestra instancia configurada:
   `import axiosClient from '@/core/api/axiosClient';`
2. **Capa de Servicios (`src/features/<tu-celula>/services/`):**
   * Crea un archivo por entidad (ej. `despensaService.js`).
   * Utiliza rutas relativas (ej. `axiosClient.get('/despensa')`); la URL base ya viene configurada desde `.env` (`VITE_API_URL`).
   * Retorna siempre `response.data` limpio.
3. **Custom Hooks (`src/features/<tu-celula>/hooks/`):**
   * Encapsula la llamada al servicio, el estado de los datos y los **3 estados obligatorios de interfaz**: carga (`isLoading`), error (`error`) y lista vacía (`empty`).

---

## 3. Autenticación y Autorización

* **No valides sesiones manualmente en tus páginas:** Si una vista requiere que el usuario esté autenticado, basta con registrarla dentro de `<ProtectedRoute>` en `AppRouter.jsx`.
* **Envío automático del Token (JWT):** No necesitas agregar el header `Authorization: Bearer ...` en tus servicios. `axiosClient` cuenta con un interceptor que adjunta el token automáticamente en cada petición y redirige al `/login` si la sesión expira (error `401`).
* **Acciones híbridas (Visitante vs. Autenticado):** Si tu vista es pública (como el detalle de una receta) pero tiene un botón de acción privada (ej. *"Guardar en favoritos"* o *"Agregar a mi despensa"*), consulta el estado `isAuthenticated` desde `useAuth()` (`@/core/context/AuthContext`). Si es `false`, redirige al usuario a `/login` pasando su ubicación actual para devolverlo al terminar.

---

## 4. Estilos: Mobile-First y CSS Modules

1. **Aislamiento total:** Todo componente o página debe tener su propio archivo `NombreComponente.module.css` en la misma carpeta. Está prohibido escribir estilos en línea (`style={{ ... }}`).
2. **Mobile-First estricto:**
   * Escribe los estilos base pensando en pantallas móviles pequeñas (`320px - 480px`) **sin** *media queries*.
   * Para adaptar a pantallas grandes, usa **únicamente** `@media (min-width: ...)` con los breakpoints oficiales: `768px` (Tablet), `1024px` (Desktop) y `1280px` (Wide).
3. **Identidad de marca (`global.css`):** No quemes códigos hexadecimales ni nombres de fuentes. Consume siempre las variables globales de Sazón (`var(--color-primary)`, `var(--color-bg-main)`, `var(--font-display)`, `var(--space-md)`, etc.).

---

## 5. Checklist antes de hacer un Pull Request

Antes de subir tu rama `feature/<tu-celula>/HU-XX` hacia `develop`, verifica:
- [ ] ¿Trabajé únicamente dentro de `src/features/<tu-celula>/` (y el registro de mi ruta en `AppRouter.jsx`)?
- [ ] ¿No importé ningún archivo interno de la carpeta `features/` de otra célula?
- [ ] ¿Todas mis peticiones pasan por `services/` usando `@/core/api/axiosClient`?
- [ ] ¿Mi interfaz se ve bien en móvil (`375px`) sin scroll horizontal y escala correctamente a escritorio?
- [ ] ¿Utilicé variables CSS de `global.css` en lugar de colores quemados?
