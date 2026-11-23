import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/context/useAuth'
import styles from './LoginPage.module.css'

function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const nextPath = location.state?.from || '/dashboard'

  if (isAuthenticated) return <Navigate to={nextPath} replace />

  const handleDemoLogin = () => {
    login('demo-token', { name: 'Invitado Sazón', role: 'viewer' })
    navigate(nextPath, { replace: true })
  }

  return (
    <section className={styles.wrapper}>
      <article className={styles.card}>
        <h1>Iniciar sesión</h1>
        <p>Accede al ecosistema completo de Sazón y desbloquea tus módulos personalizados.</p>
        <button type="button" onClick={handleDemoLogin}>
          Ingresar en modo demo
        </button>
      </article>
    </section>
  )
}

export default LoginPage
