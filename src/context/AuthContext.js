import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiMe, apiLogout } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start, check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem('kuisine_token');
    if (token) {
      apiMe()
        .then(u => setUser(u))
        .catch(() => { localStorage.removeItem('kuisine_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('kuisine_token', token);
    setUser(userData);
  };

  const logout = async () => {
    try { await apiLogout(); } catch {}
    localStorage.removeItem('kuisine_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isStudent: user?.role === 'student', isStaff: user?.role === 'staff' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
