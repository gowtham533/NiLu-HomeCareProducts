import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token')

  if (!token) {
    // Not logged in → redirect to login page
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute