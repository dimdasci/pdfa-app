import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Redirect to main site if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = 'https://dimosaic.dev';
    }
  }, [isLoading, isAuthenticated]);

  const value = {
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 