'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  onIdTokenChanged,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import {
  accountDisplayName,
  accountInitials,
} from '@/lib/firebase/session';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  displayName: string;
  email: string | null;
  initials: string;
  refreshSessionCookie: (user: User | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistSession(user: User | null) {
  if (!user) {
    await fetch('/api/auth/session', { method: 'DELETE' });
    return;
  }
  const idToken = await user.getIdToken();
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);

  const refreshSessionCookie = useCallback(async (nextUser: User | null) => {
    try {
      await persistSession(nextUser);
    } catch {
      // Cookie refresh failing should not crash the UI; proxy will re-check next navigation.
    }
  }, []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      setUser(nextUser);
      await refreshSessionCookie(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [configured, refreshSessionCookie]);

  const value = useMemo<AuthContextValue>(() => {
    const email = user?.email ?? null;
    const displayName = accountDisplayName(user?.displayName, email);
    return {
      user,
      loading,
      configured,
      displayName,
      email,
      initials: accountInitials(displayName, email),
      refreshSessionCookie,
    };
  }, [user, loading, configured, refreshSessionCookie]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
}
