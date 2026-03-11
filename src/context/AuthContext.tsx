import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI, APIError } from '@/lib/api';

import { User, AuthContextType, RegistrationData, UpdateData, ChangePasswordData } from '@/types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    // Initialize token from localStorage
    return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const response = await authAPI.getMe();
          setUser(response.user);
        }
      } catch (err) {
        if (err instanceof APIError) {
          console.error('Auth init error:', err);
        }
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email?: string, password?: string, phone?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password, phone);
      setUser(response.user);
      // Token is automatically set by authAPI.login() in localStorage
      // Update the state to match
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      setToken(authToken);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.data?.message || err.message || 'Login failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData: RegistrationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(formData as any);
      
      // If the response includes a token, log them in immediately
      // (This might happen if admin-created registration bypasses approval)
      if (response.token) {
        setUser(response.user);
        const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        setToken(authToken);
      }
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.data?.message || err.message || 'Registration failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateProfile = useCallback(async (data: UpdateData) => {
    setError(null);
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.user);
    } catch (err) {
      if (err instanceof APIError) {
        const errorMsg = err.data?.message || err.message || 'Failed to update profile';
        setError(errorMsg);
      }
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (passwords: ChangePasswordData) => {
    setError(null);
    try {
      await authAPI.changePassword(passwords);
    } catch (err) {
      if (err instanceof APIError) {
        const errorMsg = err.data?.message || err.message || 'Failed to change password';
        setError(errorMsg);
      }
      throw err;
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
