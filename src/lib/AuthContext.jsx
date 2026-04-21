import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          if (mounted) {
            setUser(data);
            setIsAuthenticated(true);
          }
        } else if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials = {}) => {
    const mode = credentials.mode || 'local';
    if (mode === 'entra') {
      const params = new URLSearchParams();
      if (credentials.email) {
        params.set('login_hint', credentials.email);
      }
      params.set('return_to', window.location.pathname);
      window.location.href = `/api/auth/login?${params.toString()}`;
      return;
    }
    const response = await fetch('/api/local-auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: credentials.email || '',
        password: credentials.password || ''
      })
    });
    if (!response.ok) {
      let message = 'Login fehlgeschlagen';
      try {
        const data = await response.json();
        message = data?.error || message;
      } catch (error) {
        // ignore
      }
      throw new Error(message);
    }
    const data = await response.json();
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => login();

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      login,
      logout,
      navigateToLogin
    }}>
      {children}
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
