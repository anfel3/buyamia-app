import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { AuthUser, SignInRequest, SignUpRequest } from '../services/local/auth';
import * as localAuth from '../services/local/auth';
import { LocalStorageError } from '../services/local/storage';

type AuthContextValue = {
  error: string;
  loading: boolean;
  refreshSession: () => Promise<void>;
  signIn: (request: SignInRequest, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (request: SignUpRequest, redirectTo?: string) => Promise<void>;
  submitting: boolean;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function messageFromError(error: unknown) {
  if (error instanceof LocalStorageError) {
    return 'Local account storage could not be read or updated.';
  }
  if (error instanceof localAuth.LocalAuthError || error instanceof Error) {
    return error.message;
  }

  return 'Unexpected authentication error.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setUser(await localAuth.getCurrentUser());
    } catch (sessionError) {
      setUser(null);
      setError(messageFromError(sessionError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const submitAuth = useCallback(
    async (operation: () => Promise<AuthUser>, redirectTo?: string) => {
      if (submitting) {
        return;
      }

      setSubmitting(true);
      setError('');

      try {
        const nextUser = await operation();
        setUser(nextUser);
        router.replace((redirectTo || '/') as Href);
      } catch (authError) {
        setUser(null);
        setError(messageFromError(authError));
        throw authError;
      } finally {
        setSubmitting(false);
      }
    },
    [router, submitting],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      error,
      loading,
      refreshSession,
      signOut: async () => {
        setSubmitting(true);
        setError('');

        try {
          await localAuth.signOut();
          setUser(null);
          router.replace('/');
        } catch (authError) {
          setError(messageFromError(authError));
          throw authError;
        } finally {
          setSubmitting(false);
        }
      },
      signIn: (request, redirectTo) => submitAuth(() => localAuth.signIn(request), redirectTo),
      signUp: (request, redirectTo) => submitAuth(() => localAuth.signUp(request), redirectTo),
      submitting,
      user,
    }),
    [error, loading, refreshSession, router, submitAuth, submitting, user],
  );

  return <AuthContext.Provider value={value}>{loading ? null : children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
