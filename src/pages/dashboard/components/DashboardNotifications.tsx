import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardStats, RecentActivityItem } from '@/hooks/useDashboardStats';
import { useTracker } from '@/hooks/useTracker';

interface Props {
  stats: DashboardStats | null;
  recentActivity: RecentActivityItem[];
  loading: boolean;
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  icon: string;
  title: string;
  description: string;
  action?: { label: string; to: string };
  dismissible: boolean;
}

const TYPE_STYLES = {
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-500',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  info: {
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    border: 'border-sky-200 dark:border-sky-800',
    icon: 'text-sky-500',
    badge: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  },
  tip: {
    bg: 'bg-brand/[0.06] dark:bg-brand-dark/10',
    border: 'border-brand/20 dark:border-brand-dark/25',
    icon: 'text-brand dark:text-brand-dark',
    badge: 'bg-brand/10 dark:bg-brand-dark/20 text-brand dark:text-brand-dark',
  },
};

export default function DashboardNotifications({ stats, recentActivity, loading }: Props) {
  const { entries } = useTracker();

  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('vaultly_dismissed_notifications');
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => {
      const next = new Set([...prev, id]);
      try {
        localStorage.setItem('vaultly_dismissed_notifications', JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const notifications = useMemo((): Notification[] => {
    if (!stats || loading) return [];

    const allEntries = Object.values(entries);
    const result: Notification[] = [];

    // 1. Completed items without rating
    const completedNoRating = allEntries.filter(
      e => e.status === 'completed' && e.rating === null
    );
    if (completedNoRating.length > 0) {
      result.push({
        id: 'no-rating',
        type: 'warning',
        icon: 'ri-star-line',
        title: `${completedNoRating.length} ítem${completedNoRating.length > 1 ? 's' : ''} sin puntuar`,
        description: `Has completado ${completedNoRating.length} ítem${completedNoRating.length > 1 ? 's' : ''} pero aún no ${completedNoRating.length > 1 ? 'les has puesto' : 'le has puesto'} puntuación. ¿Qué te parecieron?`,
        action: { label: 'Ir al tracker', to: '/tracker' },
        dismissible: true,
      });
    }

    // 2. Completed items without review
    const completedNoReview = allEntries.filter(
      e => e.status === 'completed' && (!e.review || e.review.trim().length === 0)
    );
    if (completedNoReview.length >= 3) {
      result.push({
        id: 'no-review',
        type: 'info',
        icon: 'ri-quill-pen-line',
        title: `${completedNoReview.length} ítems sin reseña`,
        description: 'Tienes varios ítems completados sin reseña. Añadir tu opinión mejora tu historial personal.',
        action: { label: 'Explorar mis completados', to: '/tracker' },
        dismissible: true,
      });
    }

    // 3. Many items in progress (more than 5)
    if (stats.in_progress > 5) {
      result.push({
        id: 'too-many-in-progress',
        type: 'tip',
        icon: 'ri-loader-4-line',
        title: `${stats.in_progress} ítems en progreso a la vez`,
        description: 'Tienes muchos ítems en progreso simultáneamente. Considera completar algunos antes de empezar nuevos.',
        action: { label: 'Ver en progreso', to: '/tracker' },
        dismissible: true,
      });
    }

    // 4. Milestone: first completion
    if (stats.completed === 1) {
      result.push({
        id: 'first-completion',
        type: 'success',
        icon: 'ri-trophy-line',
        title: '¡Primer ítem completado!',
        description: 'Has completado tu primer ítem en Vaultly. ¡Sigue así y construye tu vault cultural!',
        dismissible: true,
      });
    }

    // 5. Milestone: 10 completions
    if (stats.completed === 10) {
      result.push({
        id: 'ten-completions',
        type: 'success',
        icon: 'ri-medal-line',
        title: '¡10 ítems completados!',
        description: 'Llevas 10 ítems completados. Tu vault está creciendo. ¿Has compartido tu perfil público?',
        action: { label: 'Ver mi perfil', to: '/profile' },
        dismissible: true,
      });
    }

    // 6. High pending count
    if (stats.pending > 10) {
      result.push({
        id: 'high-pending',
        type: 'tip',
        icon: 'ri-bookmark-line',
        title: `${stats.pending} ítems pendientes acumulados`,
        description: 'Tu lista de pendientes está creciendo. ¿Cuál es el siguiente que vas a empezar?',
        action: { label: 'Ver pendientes', to: '/tracker' },
        dismissible: true,
      });
    }

    // 7. Profile tip (if no reviews at all)
    if (stats.reviews_written === 0 && stats.completed >= 3) {
      result.push({
        id: 'write-first-review',
        type: 'tip',
        icon: 'ri-chat-quote-line',
        title: 'Escribe tu primera reseña',
        description: 'Has completado varios ítems pero aún no has escrito ninguna reseña. Añade tu opinión a tu historial.',
        action: { label: 'Ir al catálogo', to: '/catalog' },
        dismissible: true,
      });
    }

    return result;
  }, [stats, entries, loading]);

  const visible = notifications.filter(n => !dismissed.has(n.id));

  if (loading || visible.length === 0) return null;

  return (
    <div className="mb-8 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <i className="ri-notification-3-line text-zinc-400 text-sm"></i>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Notificaciones
        </h2>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold">
          {visible.length}
        </span>
      </div>

      {visible.map(notif => {
        const styles = TYPE_STYLES[notif.type];
        return (
          <div
            key={notif.id}
            className={`flex items-start gap-4 px-5 py-4 rounded-2xl border ${styles.bg} ${styles.border} transition-all`}
          >
            {/* Icon */}
            <div className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 ${styles.badge}`}>
              <i className={`${notif.icon} text-base`}></i>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{notif.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{notif.description}</p>
              {notif.action && (
                <Link
                  to={notif.action.to}
                  className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold ${styles.icon} hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  {notif.action.label}
                  <i className="ri-arrow-right-line text-xs"></i>
                </Link>
              )}
            </div>

            {/* Dismiss */}
            {notif.dismissible && (
              <button
                onClick={() => dismiss(notif.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Descartar"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
