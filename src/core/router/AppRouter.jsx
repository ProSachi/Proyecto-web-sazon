import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

const PublicLayout = lazy(() => import('@/core/layouts/PublicLayout/PublicLayout'))
const AdaptiveLayout = lazy(() => import('@/core/layouts/AdaptiveLayout/AdaptiveLayout'))
const AuthLayout = lazy(() => import('@/core/layouts/AuthLayout/AuthLayout'))
const ProtectedRoute = lazy(() => import('@/core/router/ProtectedRoute'))

const HomeLandingPage = lazy(() => import('@/features/auth/pages/HomeLandingPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const PerfilPage = lazy(() => import('@/features/auth/pages/PerfilPage'))

const CatalogoPage = lazy(() => import('@/features/catalogo/CatalogoPage'))
const RecetarioPage = lazy(() => import('@/features/recetario/RecetarioPage'))
const DespensaPage = lazy(() => import('@/features/despensa/DespensaPage'))
const NutricionPage = lazy(() => import('@/features/nutricion/NutricionPage'))
const PlanificacionPage = lazy(() => import('@/features/planificacion/PlanificacionPage'))
const ComunidadPage = lazy(() => import('@/features/comunidad/ComunidadPage'))
const MercadeoPage = lazy(() => import('@/features/mercadeo/MercadeoPage'))

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: '1rem' }}>Cargando...</div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomeLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<AdaptiveLayout />}>
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/recetario" element={<RecetarioPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/despensa" element={<DespensaPage />} />
              <Route path="/nutricion" element={<NutricionPage />} />
              <Route path="/planificacion" element={<PlanificacionPage />} />
              <Route path="/comunidad" element={<ComunidadPage />} />
              <Route path="/mercadeo" element={<MercadeoPage />} />         
            </Route>
          </Route>

          <Route path="/dashboard" element={<Navigate to="/catalogo" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter