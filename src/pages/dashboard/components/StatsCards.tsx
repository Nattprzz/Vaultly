import type { DashboardStats } from '@/hooks/useDashboardStats';

interface Props {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: Props) {
  const cards = [
    {
      label: 'Total en tracker',
      value: stats?.total_tracked ?? 0,
      icon: 'ri-stack-line',
      color: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      text: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Completados',
      value: stats?.completed ?? 0,
      icon: 'ri-checkbox-circle-line',
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'En progreso',
      value: stats?.in_progress ?? 0,
      icon: 'ri-loader-4-line',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Pendientes',
      value: stats?.pending ?? 0,
      icon: 'ri-bookmark-line',
      color: 'from-sky-500 to-cyan-600',
      bg: 'bg-sky-50 dark:bg-sky-950/30',
      text: 'text-sky-600 dark:text-sky-400',
    },
    {
      label: 'Puntuación media',
      value: stats?.avg_rating != null ? `${stats.avg_rating}/10` : '—',
      icon: 'ri-star-line',
      color: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-600 dark:text-rose-400',
    },
    {
      label: 'Reseñas escritas',
      value: stats?.reviews_written ?? 0,
      icon: 'ri-quill-pen-line',
      color: 'from-zinc-500 to-zinc-700',
      bg: 'bg-zinc-100 dark:bg-zinc-800/50',
      text: 'text-zinc-600 dark:text-zinc-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(card => (
        <div key={card.label} className={`rounded-2xl p-5 ${card.bg}`}>
          <div className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
            <i className={`${card.icon} text-white text-base`}></i>
          </div>
          {loading ? (
            <div className="h-7 w-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse mb-1"></div>
          ) : (
            <p className={`text-2xl font-black mb-1 ${card.text}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {card.value}
            </p>
          )}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
