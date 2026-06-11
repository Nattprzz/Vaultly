import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTracker } from '@/hooks/useTracker';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const STORAGE_KEY = 'vaultly_dismissed_notifications';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  icon: string;
  title: string;
  description: string;
  action?: { label: string; to: string };
}

const TYPE_STYLES = {
  warning: { dot: 'bg-amber-400', icon: 'text-amber-500', iconBg: 'bg-amber-100 dark:bg-amber-900/40' },
  info: { dot: 'bg-sky-400', icon: 'text-sky-500', iconBg: 'bg-sky-100 dark:bg-sky-900/40' },
  success: { dot: 'bg-emerald-400', icon: 'text-emerald-500', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  tip: { dot: 'bg-brand-dark', icon: 'text-brand dark:text-brand-dark', iconBg: 'bg-brand/10 dark:bg-brand-dark/15' },
};

function getDismissed(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function saveDismissed(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch { /* ignore */ }
}

export default function NotificationBell() {
  const { entries } = useTracker();
  const { stats, loading } = useDashboardStats();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(getDismissed);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const notifications = useMemo((): Notification[] => {
    if (!stats || loading) return [];
    const allEntries = Object.values(entries);
    const result: Notification[] = [];

    const completedNoRating = allEntries.filter(e => e.status === 'completed' && e.rating === null);
    if (completedNoRating.length > 0) {
      result.push({
        id: 'no-rating',
        type: 'warning',
        icon: 'ri-star-line',
        title: `${completedNoRating.length} ítem${completedNoRating.length > 1 ? 's' : ''} sin puntuar`,
        description: `Tienes ${completedNoRating.length} ítem${completedNoRating.length > 1 ? 's completados' : ' completado'} sin puntuación.`,
        action: { label: 'Ir al tracker', to: '/tracker' },
      });
    }

    const completedNoReview = allEntries.filter(
      e => e.status === 'completed' && (!e.review || e.review.trim().length === 0)
    );
    if (completedNoReview.length >= 3) {
      result.push({
        id: 'no-review',
        type: 'info',
        icon: 'ri-quill-pen-line',
        title: `${completedNoReview.length} ítems sin reseña`,
        description: 'Añade tu opinión a tu historial personal.',
        action: { label: 'Ver completados', to: '/tracker' },
      });
    }

    if (stats.in_progress > 5) {
      result.push({
        id: 'too-many-in-progress',
        type: 'tip',
        icon: 'ri-loader-4-line',
        title: `${stats.in_progress} ítems en progreso`,
        description: 'Considera completar algunos antes de empezar nuevos.',
        action: { label: 'Ver tracker', to: '/tracker' },
      });
    }

    if (stats.completed === 1) {
      result.push({
        id: 'first-completion',
        type: 'success',
        icon: 'ri-trophy-line',
        title: '¡Primer ítem completado!',
        description: '¡Sigue así y construye tu vault cultural!',
      });
    }

    if (stats.completed === 10) {
      result.push({
        id: 'ten-completions',
        type: 'success',
        icon: 'ri-medal-line',
        title: '¡10 ítems completados!',
        description: '¿Has compartido tu perfil público?',
        action: { label: 'Ver perfil', to: '/profile' },
      });
    }

    if (stats.pending > 10) {
      result.push({
        id: 'high-pending',
        type: 'tip',
        icon: 'ri-bookmark-line',
        title: `${stats.pending} pendientes acumulados`,
        description: '¿Cuál es el siguiente que vas a empezar?',
        action: { label: 'Ver pendientes', to: '/tracker' },
      });
    }

    if (stats.reviews_written === 0 && stats.completed >= 3) {
      result.push({
        id: 'write-first-review',
        type: 'tip',
        icon: 'ri-chat-quote-line',
        title: 'Escribe tu primera reseña',
        description: 'Has completado varios ítems sin reseñas aún.',
        action: { label: 'Ir al catálogo', to: '/catalog' },
      });
    }

    return result;
  }, [stats, entries, loading]);

  const visible = useMemo(
    () => notifications.filter(n => !dismissed.has(n.id)),
    [notifications, dismissed]
  );

  const dismiss = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(prev => {
      const next = new Set([...prev, id]);
      saveDismissed(next);
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    const next = new Set([...dismissed, ...visible.map(n => n.id)]);
    saveDismissed(next);
    setDismissed(next);
    setOpen(false);
  }, [dismissed, visible]);

  const count = visible.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        aria-label="Notificaciones"
      >
        <i className="ri-notification-3-line text-lg"></i>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden z-50"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <i className="ri-notification-3-line text-zinc-500 text-sm"></i>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">Notificaciones</span>
              {count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold">
                  {count}
                </span>
              )}
            </div>
            {count > 0 && (
              <button
                onClick={dismissAll}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <i className="ri-checkbox-circle-line text-xl text-zinc-400"></i>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">Todo al día, no hay notificaciones pendientes.</p>
              </div>
            ) : (
              visible.map((notif, idx) => {
                const styles = TYPE_STYLES[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group ${idx < visible.length - 1 ? 'border-b border-zinc-50 dark:border-zinc-800' : ''}`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5 ${styles.iconBg}`}>
                      <i className={`${notif.icon} text-sm ${styles.icon}`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-snug">{notif.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{notif.description}</p>
                      {notif.action && (
                        <Link
                          to={notif.action.to}
                          onClick={() => setOpen(false)}
                          className={`inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold ${styles.icon} hover:opacity-75 transition-opacity cursor-pointer`}
                        >
                          {notif.action.label}
                          <i className="ri-arrow-right-line text-[10px]"></i>
                        </Link>
                      )}
                    </div>

                    {/* Dismiss */}
                    <button
                      onClick={(e) => dismiss(notif.id, e)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100 mt-0.5"
                      aria-label="Descartar"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Ver en el dashboard
              <i className="ri-arrow-right-line text-xs"></i>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
