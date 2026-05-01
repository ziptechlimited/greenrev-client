"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'customer' | 'vendor' | 'mechanic' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('greenrev-auth-mock');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse auth data', e);
      }
    }
  }, []);

  const login = (email: string, role: UserRole) => {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };
    setUser(newUser);
    localStorage.setItem('greenrev-auth-mock', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greenrev-auth-mock');
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
