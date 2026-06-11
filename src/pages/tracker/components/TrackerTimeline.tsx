import { Link } from 'react-router-dom';
import { useDashboardStats, timeAgo } from '@/hooks/useDashboardStats';

const ACTION_ICON: Record<string, string> = {
  completed:   'ri-checkbox-circle-fill',
  in_progress: 'ri-play-circle-fill',
  pending:     'ri-bookmark-fill',
  dropped:     'ri-close-circle-fill',
};

const ACTION_COLOR: Record<string, string> = {
  completed:   '#22c55e',
  in_progress: '#f97316',
  pending:     '#94a3b8',
  dropped:     '#ef4444',
};

const ACTION_TEXT: Record<string, string> = {
  completed:   'Completaste',
  in_progress: 'Empezaste',
  pending:     'Añadiste',
  dropped:     'Abandonaste',
};

export default function TrackerTimeline() {
  const { recentActivity, loading } = useDashboardStats();

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      {/* Header */}
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

      {/* Content */}
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
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-sunken)]">
            <i className="ri-history-line text-xl text-[var(--text-tertiary)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Aún no hay actividad.
          </p>
          <Link
            to="/catalog"
            className="text-xs font-semibold text-[var(--brand-accent)] hover:underline"
          >
            Explorar catálogo →
          </Link>
        </div>
      ) : (
        <div className="p-5">
          {recentActivity.map((item, i) => {
            const iconKey = item.status_en in ACTION_ICON ? item.status_en : 'pending';
            const color = ACTION_COLOR[iconKey];
            const text = ACTION_TEXT[iconKey] ?? 'Actualizaste';
            const icon = ACTION_ICON[iconKey];
            const isLast = i === recentActivity.length - 1;

            return (
              <div key={item.id} className="relative flex gap-3.5">
                {/* Vertical connector line */}
                {!isLast && (
                  <div className="absolute left-[17px] top-10 bottom-0 w-px bg-[var(--border)]" />
                )}

                {/* Status icon */}
                <div
                  className="relative z-10 mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `${color}14`,
                    border: `1.5px solid ${color}30`,
                  }}
                >
                  <i className={`${icon} text-sm`} style={{ color }} />
                </div>

                {/* Text content */}
                <div className={`flex-1 min-w-0 pt-1 ${isLast ? '' : 'pb-5'}`}>
                  <p className="text-sm leading-snug text-[var(--text-primary)]">
                    <span className="font-semibold">{text}</span>{' '}
                    <span className="font-medium text-[var(--brand-accent)]">
                      {item.title}
                    </span>
                    {item.rating !== null && (
                      <span className="text-[var(--text-secondary)]"> · {item.rating}/10</span>
                    )}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: `${item.accent}15`,
                        color: item.accent,
                      }}
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
