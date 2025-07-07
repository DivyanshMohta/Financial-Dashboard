/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api';

type User = { id: string; username: string };

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load, check for token and validate it
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.user);
        } catch (error: any) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Login: call backend, store token, set user
  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  // Register: call backend, optionally auto-login or redirect
  const register = async (username: string, password: string) => {
    await api.post('/auth/register', { username, password });
  };

  // Logout: remove token and user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
