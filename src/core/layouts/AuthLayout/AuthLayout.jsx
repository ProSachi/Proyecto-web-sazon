import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import coronaLogo from '@/assets/images/corona.svg'
import doriaLogo from '@/assets/images/doriapng.png'
import jetLogo from '@/assets/images/jet.svg'
import noelLogo from '@/assets/images/noel.svg'
import novaventaLogo from '@/assets/images/novaventapng.png'
import nutresaLogo from '@/assets/images/nutresa.png'
import pietranLogo from '@/assets/images/pietran.png'
import zenuLogo from '@/assets/images/zenu.png'
import { useAuth } from '@/core/context/useAuth'
import styles from './AuthLayout.module.css'

const SIDEBAR_PIN_KEY = 'sazon.sidebar.pinned'

const brandLogos = [
  { src: zenuLogo, alt: 'Zenú' },
  { src: pietranLogo, alt: 'Pietrán' },
  { src: nutresaLogo, alt: 'Nutresa' },
  { src: novaventaLogo, alt: 'Novaventa' },
  { src: noelLogo, alt: 'Noel' },
  { src: jetLogo, alt: 'Jet' },
  { src: doriaLogo, alt: 'Doria' },
  { src: coronaLogo, alt: 'Corona' },
]

const navItems = [
  { label: 'Mi Perfil', path: '/perfil', private: true, icon: '◉' },
  { label: 'Catálogo Nutresa', path: '/catalogo', private: false, icon: '▣' },
  { label: 'Recetario y Contenido', path: '/recetario', private: false, icon: '☰' },
  { label: 'Despensa Virtual', path: '/despensa', private: true, icon: '▤' },
  { label: 'Nutrición y Perfiles', path: '/nutricion', private: true, icon: '⚕' },
  { label: 'Planificador y Lista', path: '/planificacion', private: true, icon: '✓' },
  { label: 'Comunidad y Reseñas', path: '/comunidad', private: true, icon: '◎' },
  { label: 'Campañas y Puntos', path: '/mercadeo', private: true, icon: '◈' },
]

const breadcrumbMap = {
  perfil: { label: 'Mi Perfil', icon: '◉' },
  catalogo: { label: 'Catálogo Nutresa', icon: '▣' },
  recetario: { label: 'Recetario y Contenido', icon: '☰' },
  despensa: { label: 'Despensa Virtual', icon: '▤' },
  nutricion: { label: 'Nutrición y Perfiles', icon: '⚕' },
  planificacion: { label: 'Planificador y Lista', icon: '✓' },
  comunidad: { label: 'Comunidad y Reseñas', icon: '◎' },
  mercadeo: { label: 'Campañas y Puntos', icon: '◈' },
}

function AuthLayout() {
  const { isAuthenticated, user, theme, toggleTheme } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [openSidebarPath, setOpenSidebarPath] = useState(null)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const [isPinned, setIsPinned] = useState(() => localStorage.getItem(SIDEBAR_PIN_KEY) === 'true')

  useEffect(() => {
    localStorage.setItem(SIDEBAR_PIN_KEY, String(isPinned))
  }, [isPinned])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const syncDesktop = (event) => {
      setIsDesktop(event.matches)
      if (!event.matches) {
        setIsPinned(false)
        setOpenSidebarPath(null)
      }
    }

    media.addEventListener('change', syncDesktop)
    return () => media.removeEventListener('change', syncDesktop)
  }, [])

  useEffect(() => {
    const handlePopState = () => setOpenSidebarPath(null)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const activeModule = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const first = segments[0]
    return breadcrumbMap[first] || { label: 'Catálogo Nutresa', icon: '▣' }
  }, [location.pathname])

  const isSidebarOpen = openSidebarPath === location.pathname
  const isSidebarVisible = isSidebarOpen || (isDesktop && isPinned)
  const showOverlay = isSidebarVisible && !(isDesktop && isPinned)

  const toggleSidebar = () =>
    setOpenSidebarPath((current) => (current === location.pathname ? null : location.pathname))
  const closeSidebar = () => setOpenSidebarPath(null)
  const togglePin = () => {
    const nextPinned = !isPinned
    setIsPinned(nextPinned)
    setOpenSidebarPath(isDesktop && nextPinned ? location.pathname : null)
  }

  return (
    <div className={`${styles.shell} ${isDesktop && isPinned ? styles.shellPinned : ''}`}>
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <button type="button" className={styles.menuButton} onClick={toggleSidebar}>
            <span className={styles.menuIcon}>☰</span>
            <span className={styles.menuText}>Menú</span>
          </button>

          <Link to="/catalogo" className={styles.topBrand}>
            <span className={styles.topBadge} aria-hidden>
              <span>i</span>
            </span>
            <strong className={styles.logo}>Sa·zón</strong>
          </Link>
        </div>

        <label className={styles.searchWrap}>
          <input
            type="search"
            placeholder="Buscar recetas, productos Nutresa, módulos..."
            className={styles.searchInput}
          />
        </label>

        <div className={styles.topRight}>
          <button type="button" className={styles.iconButton} aria-label="Notificaciones">
            🔔
          </button>
          {isAuthenticated ? (
            <button type="button" className={styles.profileButton}>
              {user?.name || 'Mi perfil'}
            </button>
          ) : (
            <button type="button" className={styles.loginButton} onClick={() => navigate('/login')}>
              <span className={styles.loginMobile}>Iniciar</span>
              <span className={styles.loginDesktop}>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </header>

      <div className={styles.breadcrumbBar}>
        <Link to="/catalogo" className={styles.breadcrumbHome}>
          <span aria-hidden className={styles.breadcrumbIcon}>
            ⌂
          </span>
          <span>Inicio</span>
        </Link>
        <span className={styles.breadcrumbSeparator} aria-hidden>
          &gt;
        </span>
        <span className={styles.breadcrumbCurrent}>
          <span aria-hidden className={styles.breadcrumbIcon}>
            {activeModule.icon}
          </span>
          <strong>{activeModule.label}</strong>
        </span>
      </div>

      <aside className={`${styles.sidebar} ${isSidebarVisible ? styles.sidebarOpen : ''}`} aria-hidden={!isSidebarVisible}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarBrand}>
            <div className={styles.brandText}>
              <strong>Sa·zón</strong>
              <small>ECOSISTEMA NUTRESA</small>
            </div>
          </div>

          <div className={styles.sidebarActions}>
            <button
              type="button"
              className={styles.pinButton}
              title="Fijar barra lateral"
              aria-label="Fijar barra lateral"
              onClick={togglePin}
            >
              {isPinned ? '📍' : '📌'}
            </button>
            <button type="button" onClick={closeSidebar} className={styles.closeButton} aria-label="Cerrar menú">
              X
            </button>
          </div>
        </div>

        <p className={styles.modulesCaption}>MÓDULOS DEL SISTEMA</p>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''} ${
                  item.private && !isAuthenticated ? styles.navLinkLocked : ''
                }`
              }
              onClick={(event) => {
                if (item.private && !isAuthenticated) {
                  event.preventDefault()
                  navigate('/login', { state: { from: item.path } })
                }
                if (!isPinned) closeSidebar()
              }}
            >
              <span aria-hidden className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.themePill} role="group" aria-label="Selector de tema">
            <button
              type="button"
              className={`${styles.themeOption} ${theme === 'light' ? styles.themeOptionActive : ''}`}
              onClick={() => {
                if (theme !== 'light') toggleTheme()
              }}
              aria-pressed={theme === 'light'}
            >
              ☀ Día
            </button>
            <button
              type="button"
              className={`${styles.themeOption} ${theme === 'dark' ? styles.themeOptionActive : ''}`}
              onClick={() => {
                if (theme !== 'dark') toggleTheme()
              }}
              aria-pressed={theme === 'dark'}
            >
              🌙 Noche
            </button>
          </div>
        </div>
      </aside>

      {showOverlay ? (
        <button className={styles.overlay} onClick={closeSidebar} aria-label="Cerrar menú" />
      ) : null}

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerText}>
            <strong>Equipo de Desarrollo Sa·zón</strong>
            <p>Copyright © 2026 Grupo Nutresa · Todos los derechos reservados</p>
          </div>
          <div className={styles.logoRow} aria-label="Marcas Nutresa">
            {brandLogos.map((logo) => (
              <div key={logo.alt} className={styles.logoChip}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthLayout
