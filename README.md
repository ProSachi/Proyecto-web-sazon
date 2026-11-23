# Sazón

Aplicación web construida con **React**, **Vite** y **JavaScript**, diseñada bajo una arquitectura modular (**Core + Features**) para permitir el trabajo paralelo y escalable de múltiples equipos de desarrollo.

---

##  Stack Tecnológico

* **Core:** React 18+ (JavaScript ES6+)
* **Empaquetador:** Vite
* **Estilos:** CSS Modules (`*.module.css`) + Variables CSS globales (`global.css`)
* **Enrutamiento:** React Router DOM (Rutas centralizadas + Lazy Loading)
* **Estado Global & Auth:** React Context API
* **Cliente HTTP:** Axios (conectado inicialmente a MockAPI mediante variables de entorno)

---

##  Puesta en Marcha (Instalación)

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base el archivo `.env.example`:
```bash
cp .env.example .env
```
Abre el archivo `.env` y asigna la URL base de tu entorno (MockAPI en desarrollo):
```env
VITE_API_URL=https://mockapi.io
```
> **Importante:** En Vite, todas las variables de entorno expuestas al cliente deben iniciar obligatoriamente con el prefijo `VITE_`.

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

##  Mapa del Encarpetado

El proyecto separa estrictamente la **infraestructura compartida (`core/`)** de los **módulos de negocio de cada equipo (`features/`)**.

```text
mi-proyecto-vite/
├── CONTRIBUTING.md
├── .env                        # Variables de entorno locales (Ignorado en Git)
├── .env.example                # Plantilla de variables de entorno
├── .github/
│   └── copilot-instructions.md # Reglas de arquitectura y buenas prácticas para Copilot
├── public/
│   └── favicon.ico             # Archivos estáticos públicos
├── src/
│   ├── assets/                 # Imágenes y recursos globales compartidos
│   │   └── images/
│   ├── styles/                 # Único archivo de estilos globales (Variables y Resets)
│   │   └── global.css
│   ├── core/                   # 🏛️ INFRAESTRUCTURA CENTRAL (Compartida)
│   │   ├── api/
│   │   │   └── axiosClient.js  # Instancia única de Axios + Interceptores (Token y 401)
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Estado global de autenticación (login, logout, user)
│   │   ├── layouts/
│   │   │   ├── AuthLayout/     # Estructura visual para usuarios autenticados
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   └── AuthLayout.module.css
│   │   │   └── PublicLayout/   # Estructura visual para visitantes (Login, Registro)
│   │   │       ├── PublicLayout.jsx
│   │   │       └── PublicLayout.module.css
│   │   └── router/
│   │       ├── AppRouter.jsx   # Definición centralizada de todas las rutas y Layouts
│   │       └── ProtectedRoute.jsx # Guardián de rutas privadas
│   ├── features/               # DOMINIOS POR EQUIPO (Trabajo aislado)
│   │   ├── auth/               # Módulo de inicio de sesión y registro
│   │   ├── equipo-ventas/      # Ejemplo: Carpeta exclusiva del Equipo 1
│   │   │   ├── components/     # Componentes UI propios del equipo (*.jsx + *.module.css)
│   │   │   ├── hooks/          # Custom Hooks con lógica de negocio (useVentas.js)
│   │   │   ├── services/       # Peticiones HTTP usando axiosClient (ventasService.js)
│   │   │   ├── pages/          # Vistas principales que se conectan al AppRouter
│   │   │   └── assets/         # Imágenes exclusivas de este equipo
│   │   └── equipo-soporte/     # Ejemplo: Carpeta exclusiva del Equipo 2
│   ├── App.jsx                 # Raíz que envuelve AppRouter con AuthProvider
│   └── main.jsx                # Punto de entrada (Importa global.css)
├── index.html
└── vite.config.js              # Configuración de Vite y alias de rutas (@/)
```

---

##  Guía de Trabajo para Equipos

Para evitar conflictos al hacer *merge* y mantener la escalabilidad del proyecto, todos los equipos deben seguir estas reglas:

1. **Aislamiento de código:** Trabaja únicamente dentro de tu carpeta `src/features/<tu-equipo>/`. **Nunca** importes componentes, hooks o servicios desde la carpeta `features/` de otro equipo.
2. **Importaciones limpias con `@/`:** Usa siempre el alias `@` que apunta a `src/` en lugar de rutas relativas largas:
   * ✅ `import axiosClient from '@/core/api/axiosClient'`
   * ❌ `import axiosClient from '../../../core/api/axiosClient'`
3. **Consumo de API (Axios + MockAPI):**
   * No importes `axios` directamente; usa siempre `@/core/api/axiosClient.js`.
   * Crea tus funciones de petición dentro de `features/<tu-equipo>/services/` retornando `response.data`. De este modo, cuando pasemos de **MockAPI** al backend real, solo cambiaremos la variable `VITE_API_URL` sin tocar tus componentes.
4. **Estilos aislados:**
   * Cada componente debe tener su propio archivo `NombreComponente.module.css`.
   * Usa las variables CSS definidas en `src/styles/global.css` (colores, fuentes, espaciados) para mantener la identidad visual unificada. No crees archivos CSS globales adicionales.
5. **Registro de Rutas:**
   * Cuando termines una vista en `features/<tu-equipo>/pages/`, regístrala en `src/core/router/AppRouter.jsx` usando `React.lazy()` dentro de `PublicLayout` o `AuthLayout` según corresponda.
6. **Asistente de IA (GitHub Copilot):**
   * El repositorio cuenta con `.github/copilot-instructions.md`. GitHub Copilot leerá automáticamente este archivo para sugerir código alineado con nuestros principios SOLID, CSS Modules y arquitectura.
7. **Manual Operativo:** 
   * Antes de escribir código, lee detenidamente la [**Guía de Desarrollo por Célula (`CONTRIBUTING.md`)**](./CONTRIBUTING.md). Allí encontrarás el paso a paso para conectar tus vistas a los Layouts (`<Outlet />`), estructurar tus servicios con `axiosClient` (MockAPI → Spring Boot), manejar acciones protegidas y aplicar estilos Mobile-First.

---

##  Scripts Disponibles

* `npm run dev` — Inicia el servidor de desarrollo local.
* `npm run build` — Compila y optimiza la aplicación para producción en la carpeta `dist/`.
* `npm run preview` — Previsualiza localmente la versión compilada de producción.
* `npm run lint` — Ejecuta el linter para detectar errores de sintaxis y estilo de código.
