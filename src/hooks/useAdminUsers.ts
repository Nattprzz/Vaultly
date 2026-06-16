/**
 * useAdminUsers.ts — gestión de usuarios desde el panel de administración.
 *
 * Carga la lista de usuarios registrados junto con sus contadores de ítems
 * y reseñas, y expone métodos para modificar el rol y el estado de cada cuenta.
 * Todas las modificaciones se registran en admin_audit_logs via auditLog.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useState } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Estado posible de la cuenta de un usuario. */
export type AdminUserStatus = 'active' | 'suspended' | 'pending';

/** Rol posible de un usuario en Vaultly. */
export type AdminUserRole = 'admin' | 'user';

/**
 * Fila de usuario tal como la consume el panel de administración.
 * Combina datos de `profiles` con contadores calculados.
 */
export interface AdminUserRow {
  /** UUID del usuario */
  id: string;
  /** Nombre de usuario único */
  username: string;
  /** Nombre visible */
  display_name: string;
  /** Iniciales para el avatar */
  initials: string;
  /** Correo electrónico */
  email: string;
  /** Rol en la aplicación */
  role: AdminUserRole;
  /** Estado de la cuenta */
  status: AdminUserStatus;
  /** Fecha de registro */
  joined: string;
  /** Fecha de última actividad */
  last_active: string;
  /** Total de ítems en el tracker */
  tracked_items: number;
  /** Total de reseñas escritas */
  reviews: number;
  /** Color de acento para el avatar (asignado por posición) */
  accent: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Paleta de colores para los avatares de la lista de usuarios. */
const ACCENTS = ['#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899', '#6366f1', '#14b8a6'];

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function formatDate(date?: string | null) {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Genera las iniciales de un nombre de usuario para el avatar de texto.
 *
 * @param value Nombre completo o de usuario.
 * @returns Dos iniciales en mayúsculas.
 */
function initialsFrom(value: string) {
  return value
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'US';
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona los usuarios del panel de administración.
 *
 * Responsabilidades:
 * - Cargar todos los perfiles con sus contadores de ítems y reseñas.
 * - Exponer operaciones para cambiar el rol o el estado de un usuario.
 * - Aplicar actualizaciones optimistas con rollback ante error.
 * - Registrar cada modificación en admin_audit_logs.
 */
export function useAdminUsers() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Carga de datos ──────────────────────────────────────────────────────────

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

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Modifica el rol o el estado de un usuario con actualización optimista.
   * Registra la acción en admin_audit_logs.
   *
   * @param id UUID del usuario a modificar.
   * @param updates Campos a actualizar (role y/o status).
   */
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

  // ─── Datos derivados ──────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    /** Total de usuarios registrados */
    total: users.length,
    /** Usuarios con cuenta activa */
    active: users.filter(user => user.status === 'active').length,
    /** Usuarios con cuenta suspendida */
    suspended: users.filter(user => user.status === 'suspended').length,
    /** Usuarios con cuenta pendiente de verificación */
    pending: users.filter(user => user.status === 'pending').length,
  }), [users]);

  return { users, stats, loading, savingId, error, refresh: fetchUsers, updateUser };
}
