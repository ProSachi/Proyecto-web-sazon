import { useNavigate } from 'react-router-dom'
import fondoImage from '@/assets/images/fondo.jpg'
import styles from './HomeLandingPage.module.css'

function HomeLandingPage() {
  const navigate = useNavigate()

  return (
    <section className={styles.hero}>
      <img src={fondoImage} alt="" aria-hidden className={styles.bgImage} />
      <div className={styles.overlay}>
        <div className={styles.copy}>
          <h1>El Sabor que nos Une</h1>
          <p>
            Inspírate con preparaciones memorables, organiza tu despensa y descubre recetas
            oficiales con la calidad y tradición de nuestras marcas familiares.
          </p>
        </div>

        <button type="button" className={styles.cta} onClick={() => navigate('/catalogo')}>
          Explora
        </button>
      </div>
    </section>
  )
}

export default HomeLandingPage
