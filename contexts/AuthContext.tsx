// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const token = Cookies.get('auth_token');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      // Verify token with backend
      const response = await fetch('/api/auth/verify-session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } else {
        // Invalid token
        Cookies.remove('auth_token');
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  const login = (token: string) => {
    // Store token in cookie (expires in 24 hours)
    Cookies.set('auth_token', token, { 
      expires: 1, // 1 day
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
    Cookies.remove('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}