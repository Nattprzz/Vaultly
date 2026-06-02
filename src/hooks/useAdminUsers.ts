import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';

export type AdminUserStatus = 'active' | 'suspended' | 'pending';
export type AdminUserRole = 'admin' | 'user';

export interface AdminUserRow {
  id: string;
  username: string;
  display_name: string;
  initials: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joined: string;
  last_active: string;
  tracked_items: number;
  reviews: number;
  accent: string;
}

const ACCENTS = ['#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899', '#6366f1', '#14b8a6'];

function formatDate(date?: string | null) {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function initialsFrom(value: string) {
  return value
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'US';
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, initials, email, role, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const ids = (profiles ?? []).map(profile => profile.id);
      const [trackingRes, reviewsRes] = await Promise.all([
        ids.length
          ? supabase.from('user_item_tracking').select('user_id, review').in('user_id', ids)
          : Promise.resolve({ data: [], error: null }),
        ids.length
          ? supabase.from('user_item_tracking').select('user_id').in('user_id', ids).not('review', 'is', null)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (trackingRes.error) throw trackingRes.error;
      if (reviewsRes.error) throw reviewsRes.error;

      const trackedCounts = new Map<string, number>();
      const reviewCounts = new Map<string, number>();

      (trackingRes.data ?? []).forEach(row => {
        trackedCounts.set(row.user_id, (trackedCounts.get(row.user_id) ?? 0) + 1);
      });
      (reviewsRes.data ?? []).forEach(row => {
        reviewCounts.set(row.user_id, (reviewCounts.get(row.user_id) ?? 0) + 1);
      });

      setUsers((profiles ?? []).map((profile, index) => {
        const displayName = profile.display_name || profile.username || profile.email?.split('@')[0] || 'Usuario';
        return {
          id: profile.id,
          username: profile.username || profile.email?.split('@')[0] || 'usuario',
          display_name: displayName,
          initials: profile.initials || initialsFrom(displayName),
          email: profile.email,
          role: (profile.role ?? 'user') as AdminUserRole,
          status: (profile.status ?? 'active') as AdminUserStatus,
          joined: formatDate(profile.created_at),
          last_active: formatDate(profile.updated_at),
          tracked_items: trackedCounts.get(profile.id) ?? 0,
          reviews: reviewCounts.get(profile.id) ?? 0,
          accent: ACCENTS[index % ACCENTS.length],
        };
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  const updateUser = useCallback(async (id: string, updates: Partial<Pick<AdminUserRow, 'role' | 'status'>>) => {
    setSavingId(id);
    setError(null);

    const previous = users.find(user => user.id === id);
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      await auditLog('update', 'profiles', id, updates);
    } catch (err) {
      if (previous) setUsers(prev => prev.map(user => user.id === id ? previous : user));
      setError((err as Error).message);
    } finally {
      setSavingId(null);
    }
  }, [users]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(user => user.status === 'active').length,
    suspended: users.filter(user => user.status === 'suspended').length,
    pending: users.filter(user => user.status === 'pending').length,
  }), [users]);

  return { users, stats, loading, savingId, error, refresh: fetchUsers, updateUser };
}
