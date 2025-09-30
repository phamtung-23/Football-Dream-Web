import { useAuth } from '@/contexts/auth-context';
import { useSession } from 'next-auth/react';

export function useAuthData() {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const { data: session, status } = useSession();

  return {
    user,
    session,
    isLoading: isLoading || status === 'loading',
    isAuthenticated,
    refreshUser,
  };
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuthData();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized: isAuthenticated && user,
  };
}
