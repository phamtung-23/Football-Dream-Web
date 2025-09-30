'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types/auth';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!session && !!user;

  const refreshUser = useCallback(async () => {
    if (session?.accessToken) {
      try {
        const result = await authApi.getProfile(session.accessToken);
        
        if (result.status === 'success' && result.data) {
          setUser(result.data);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to refresh user data:', error);
      }
    }
  }, [session?.accessToken]);

  useEffect(() => {
    const initializeUser = async () => {
      if (status === 'loading') {
        setIsLoading(true);
        return;
      }

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
          role: session.user.role as 'USER' | 'ADMIN' | 'MANAGER' || 'USER',
          isEmailVerified: session.user.isEmailVerified || false,
          avatar: session.user.image || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await refreshUser();
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };

    initializeUser();
  }, [session, status, refreshUser]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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
