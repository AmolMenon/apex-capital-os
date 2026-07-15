'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Workspace {
  id: number;
  name: string;
  slug: string;
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';

  useEffect(() => {
    if (!isAuthEnabled) {
      // Mock user for demo mode
      setUser({ id: 1, email: 'demo@apexcapital.com', name: 'Demo User', role: 'admin' });
      setWorkspaces([{ id: 1, name: 'Demo Workspace', slug: 'demo' }]);
      setActiveWorkspace({ id: 1, name: 'Demo Workspace', slug: 'demo' });
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [isAuthEnabled]);

  const fetchUser = async (token: string) => {
    try {
      const apiUrl = 'http://127.0.0.1:8000';
      const userRes = await fetch(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        
        const wsRes = await fetch(`${apiUrl}/api/auth/workspaces`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (wsRes.ok) {
          const wsData = await wsRes.json();
          setWorkspaces(wsData);
          if (wsData.length > 0) {
            setActiveWorkspace(wsData[0]);
          }
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      // In production, logging handled by APM
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, workspaces, activeWorkspace, login, logout, isLoading }}>
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
