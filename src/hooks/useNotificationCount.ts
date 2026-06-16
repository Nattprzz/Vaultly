/**
 * useNotificationCount.ts — contador de notificaciones activas del usuario.
 *
 * Calcula cuántas notificaciones inteligentes están pendientes de ser vistas,
 * excluyendo las que el usuario ya ha descartado. Comparte la misma lógica
 * de generación de notificaciones que NotificationBell para mantener consistencia.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useMemo } from 'react';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useTracker } from '@/hooks/useTracker';
import { useDashboardStats } from '@/hooks/useDashboardStats';

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Clave de localStorage compartida con NotificationBell para leer las notificaciones descartadas. */
const STORAGE_KEY = 'vaultly_dismissed_notifications';

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function getDismissed(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Devuelve el número de notificaciones activas y no descartadas.
 * Se usa para mostrar el badge numérico sobre el icono de campana.
 *
 * Las notificaciones se basan en el estado del tracker y las estadísticas
 * del dashboard. La lista de IDs debe mantenerse sincronizada con
 * NotificationBell para que el contador sea coherente con el panel.
 */
export function useNotificationCount(): number {
  const { entries } = useTracker();
  const { stats, loading } = useDashboardStats();

  return useMemo(() => {
    if (!stats || loading) return 0;

    const dismissed = getDismissed();
    const allEntries = Object.values(entries);
    const activeIds: string[] = [];

    const completedNoRating = allEntries.filter(
      e => e.status === 'completed' && e.rating === null
    );
    if (completedNoRating.length > 0) activeIds.push('no-rating');

    const completedNoReview = allEntries.filter(
      e => e.status === 'completed' && (!e.review || e.review.trim().length === 0)
    );
    if (completedNoReview.length >= 3) activeIds.push('no-review');

    if (stats.in_progress > 5) activeIds.push('too-many-in-progress');

    if (stats.completed === 1) activeIds.push('first-completion');

    if (stats.completed === 10) activeIds.push('ten-completions');

    if (stats.pending > 10) activeIds.push('high-pending');

    if (stats.reviews_written === 0 && stats.completed >= 3) activeIds.push('write-first-review');

    return activeIds.filter(id => !dismissed.has(id)).length;
  }, [stats, entries, loading]);
}
