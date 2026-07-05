import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/ui/Loader'

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext)

  if (loading) return <Loader fullPage />

  if (!token) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
