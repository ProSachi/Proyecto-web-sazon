import { AuthProvider } from '@/core/context/AuthContext'
import AppRouter from '@/core/router/AppRouter'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
