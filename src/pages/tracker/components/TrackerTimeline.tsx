/**
 * TrackerTimeline.tsx — línea de tiempo de actividad reciente del tracker.
 *
 * Consume `useDashboardStats()` directamente (sin recibir props) para mostrar
 * los últimos ítems modificados como eventos en una línea de tiempo vertical.
 * Cada evento muestra el icono y color del estado, el texto de acción via
 * `getActionText()`, el título del ítem y su categoría. El hilo vertical
 * entre eventos se renderiza con un `::before` absoluto excepto en el último.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useDashboardStats, timeAgo } from '@/hooks/useDashboardStats';

// ─── Constantes ───────────────────────────────────────────────────────────────

import { STATUS_CONFIG, getActionText } from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function TrackerTimeline() {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const { recentActivity, loading } = useDashboardStats();

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-2">
          <i className="ri-time-line text-[var(--text-secondary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Actividad reciente</h3>
        </div>
        <Link
          to="/dashboard"
          className="text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--brand-accent)]"
        >
          Ver todo
        </Link>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex flex-col gap-0 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 pb-5 last:pb-0">
              <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-[var(--surface-sunken)]" />
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <div className="h-3.5 w-3/4 animate-pulse rounded-lg bg-[var(--surface-sunken)]" />
                <div className="h-3 w-1/2 animate-pulse rounded-lg bg-[var(--surface-sunken)]" />
              </div>
            </div>
          ))}
        </div>
      ) : recentActivity.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-sunken)]">
            <i className="ri-history-line text-xl text-[var(--text-tertiary)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Aún no hay actividad.</p>
          <Link
            to="/catalog"
            className="text-xs font-semibold text-[var(--brand-accent)] hover:underline"
          >
            Explorar catálogo →
          </Link>
        </div>
      ) : (
        /* Lista de eventos con hilo vertical */
        <div className="p-5">
          {recentActivity.map((item, i) => {
            const statusKey = item.status_en as CategoryStatus;
            const cfg   = STATUS_CONFIG[statusKey];
            const color = cfg?.color ?? '#94a3b8';
            const icon  = cfg?.icon  ?? 'ri-bookmark-line';
            const text  = getActionText(item.status_en);
            const isLast = i === recentActivity.length - 1;

            return (
              <div key={item.id} className="relative flex gap-3.5">
                {/* Hilo vertical entre eventos */}
                {!isLast && (
                  <div className="absolute left-[17px] top-10 bottom-0 w-px bg-[var(--border)]" />
                )}

                <div
                  className="relative z-10 mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${color}14`, border: `1.5px solid ${color}30` }}
                >
                  <i className={`${icon} text-sm`} style={{ color }} />
                </div>

                <div className={`flex-1 min-w-0 pt-1 ${isLast ? '' : 'pb-5'}`}>
                  <p className="text-sm leading-snug text-[var(--text-primary)]">
                    <span className="font-semibold">{text}</span>{' '}
                    <span className="font-medium text-[var(--brand-accent)]">{item.title}</span>
                    {item.rating !== null && (
                      <span className="text-[var(--text-secondary)]"> · {item.rating}/10</span>
                    )}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: `${item.accent}15`, color: item.accent }}
                    >
                      {item.categoryLabel}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {timeAgo(item.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
