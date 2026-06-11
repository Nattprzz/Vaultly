import type { TrackerEntry } from '@/hooks/useTracker';

interface Props {
  entries: Record<string, TrackerEntry>;
  activeCategory?: string;
}

export default function TrackerStats({ entries, activeCategory = 'all' }: Props) {
  const all = Object.values(entries).filter(e =>
    activeCategory === 'all' || e.category === activeCategory
  );

  const total      = all.length;
  const completed  = all.filter(e => e.status === 'completed').length;
  const inProgress = all.filter(e => e.status === 'in_progress').length;
  const pending    = all.filter(e => e.status === 'pending').length;
  const dropped    = all.filter(e => e.status === 'dropped').length;
  const rated      = all.filter(e => e.rating !== null);
  const avgRating  = rated.length > 0
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : null;

  const cards = [
    { label: 'Total',         value: total,                  icon: 'ri-stack-line',             accent: '#2563EB', bg: 'rgba(37,99,235,0.10)'   },
    { label: 'Completados',   value: completed,              icon: 'ri-checkbox-circle-line',    accent: '#22c55e', bg: 'rgba(34,197,94,0.10)'   },
    { label: 'En progreso',   value: inProgress,             icon: 'ri-loader-4-line',           accent: '#f97316', bg: 'rgba(249,115,22,0.10)'  },
    { label: 'Pendientes',    value: pending,                icon: 'ri-bookmark-line',           accent: '#94a3b8', bg: 'rgba(148,163,184,0.10)' },
    { label: 'Abandonados',   value: dropped,                icon: 'ri-close-circle-line',       accent: '#ef4444', bg: 'rgba(239,68,68,0.10)'   },
    { label: 'Media personal',value: avgRating ?? '—',       icon: 'ri-star-line',               accent: '#f59e0b', bg: 'rgba(245,158,11,0.10)'  },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map(card => (
        <div
          key={card.label}
          className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--border-strong)]"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: card.bg }}
          >
            <i className={`${card.icon} text-base`} style={{ color: card.accent }} />
          </div>
          <div>
            <p
              className="text-2xl font-black leading-none text-[var(--text-primary)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {card.value}
            </p>
            <p className="mt-1 text-xs leading-tight text-[var(--text-secondary)]">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
