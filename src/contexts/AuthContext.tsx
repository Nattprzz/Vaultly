/**
 * AuthContext.tsx — contexto global de autenticación de Vaultly.
 *
 * Centraliza toda la lógica de sesión en un único Provider, eliminando
 * las suscripciones duplicadas a onAuthStateChange que ocurrían cuando
 * múltiples componentes llamaban a useAuth() como hook independiente.
 *
 * Expone:
 * - AuthProvider: monta una única suscripción a Supabase Auth.
 * - useAuthContext: hook que lee el contexto; lanza si se usa fuera del Provider.
 *
 * Los tipos AuthProfile y AuthState se re-exportan desde aquí; useAuth.ts
 * los re-exporta a su vez para mantener la API existente sin cambios.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ─── Librerías externas ──────────────────────────────────────────────────────

import type { User, Session } from '@supabase/supabase-js';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import {
  clearPasswordRecoveryPending,
  markPasswordRecoveryPending,
  PASSWORD_RECOVERY_ROUTE,
} from '@/lib/passwordRecovery';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Datos del perfil del usuario almacenados en la tabla `profiles`. */
export interface AuthProfile {
  id: string;
  email: string;
  display_name: string | null;
  initials: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  backdrop_url: string | null;
  is_public: boolean;
  show_ratings: boolean;
  show_reviews: boolean;
  share_tracker: boolean;
  role: string;
  status: string;
}

/** Estado global de autenticación expuesto por el contexto. */
export interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  session: Session | null;
  isLoggedIn: boolean;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ─── Contexto ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * Monta una única suscripción a supabase.auth.onAuthStateChange y expone
 * el estado de autenticación a todos los componentes descendientes.
 * Debe envolver la aplicación dentro de BrowserRouter.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, userEmail: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, display_name, initials, username, bio, avatar_url, backdrop_url, is_public, show_ratings, show_reviews, share_tracker, role, status')
      .eq('id', userId)
      .maybeSingle();

    if (data?.status === 'suspended') {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      return;
    }

    if (data) {
      setProfile(data as AuthProfile);
    } else {
      setProfile({
        id: userId,
        email: userEmail,
        display_name: userEmail.split('@')[0],
        initials: userEmail.slice(0, 2).toUpperCase(),
        username: userEmail.split('@')[0],
        bio: null,
        avatar_url: null,
        backdrop_url: null,
        is_public: true,
        show_ratings: true,
        show_reviews: true,
        share_tracker: true,
        role: 'user',
        status: 'active',
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email ?? '').finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') {
        markPasswordRecoveryPending();
        if (window.location.pathname !== PASSWORD_RECOVERY_ROUTE) {
          if (window.REACT_APP_NAVIGATE) {
            window.REACT_APP_NAVIGATE(PASSWORD_RECOVERY_ROUTE, { replace: true });
          } else {
            window.location.replace(PASSWORD_RECOVERY_ROUTE);
          }
        }
      } else if (event === 'SIGNED_IN') {
        clearPasswordRecoveryPending();
      }

      setLoading(true);
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email ?? '').finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id, user.email ?? '');
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoggedIn: !!user, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within <AuthProvider>');
  return ctx;
}
