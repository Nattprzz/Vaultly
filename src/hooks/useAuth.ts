import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface AuthProfile {
  id: string;
  email: string;
  display_name: string | null;
  initials: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  show_ratings: boolean;
  show_reviews: boolean;
  share_tracker: boolean;
  role: string;
  status: string;
}

export interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  session: Session | null;
  isLoggedIn: boolean;
  loading: boolean;
}

export function useAuth(): AuthState & {
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
} {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, userEmail: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, display_name, initials, username, bio, avatar_url, is_public, show_ratings, show_reviews, share_tracker, role, status')
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email ?? '');
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email ?? '');
    }
  };

  return {
    user,
    profile,
    session,
    isLoggedIn: !!user,
    loading,
    logout,
    refreshProfile,
  };
}
