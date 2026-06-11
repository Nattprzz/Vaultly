import type { DashboardStats } from '@/hooks/useDashboardStats';

interface Props {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: Props) {
  // KPI cards intentionally share ONE visual language — neutral surface +
  // a single blue icon accent — rather than a "rainbow" of per-card colors.
  // Differentiation comes from icon + label, the way Linear/GitHub dashboards
  // keep a calm, scannable strip of numbers instead of competing hues.
  const cards = [
    { label: 'Total en tracker', value: stats?.total_tracked ?? 0, icon: 'ri-stack-line' },
    { label: 'Completados', value: stats?.completed ?? 0, icon: 'ri-checkbox-circle-line' },
    { label: 'En progreso', value: stats?.in_progress ?? 0, icon: 'ri-loader-4-line' },
    { label: 'Pendientes', value: stats?.pending ?? 0, icon: 'ri-bookmark-line' },
    { label: 'Puntuación media', value: stats?.avg_rating != null ? `${stats.avg_rating}/10` : '—', icon: 'ri-star-line' },
    { label: 'Reseñas escritas', value: stats?.reviews_written ?? 0, icon: 'ri-quill-pen-line' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(card => (
        <div key={card.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--border-strong)]">
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 dark:bg-brand-dark/15">
            <i className={`${card.icon} text-base text-brand dark:text-brand-dark`}></i>
          </div>
          {loading ? (
            <div className="mb-1 h-7 w-12 animate-pulse rounded-lg bg-[var(--surface-sunken)]"></div>
          ) : (
            <p className="mb-1 text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {card.value}
            </p>
          )}
          <p className="text-xs leading-tight text-[var(--text-secondary)]">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
