import { Outlet } from 'react-router-dom'
import styles from './PublicLayout.module.css'

function PublicLayout() {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  )
}

export default PublicLayout