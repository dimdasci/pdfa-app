import { useAuth } from '../../context/AuthContext';

export function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show nothing while checking auth state
  if (isLoading) {
    return null; // Or a loading spinner component
  }
  
  // Children will only render if authenticated
  // If not authenticated, the AuthContext will redirect to dimosaic.dev
  return isAuthenticated ? children : null;
} 