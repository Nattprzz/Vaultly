/**
 * TrackerStats.tsx — grid de 6 tarjetas KPI del tracker.
 *
 * Muestra totales de: ítems totales, completados, en progreso, pendientes,
 * abandonados y puntuación media. Los conteos usan SEMANTIC_GROUPS de
 * tracker-statuses para agrupar estados cross-categoría bajo conceptos
 * unificados (p. ej. "played"/"watched"/"read" → completed).
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { TrackerEntry } from '@/hooks/useTracker';

// ─── Constantes ───────────────────────────────────────────────────────────────

import { SEMANTIC_GROUPS } from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del componente de estadísticas del tracker. */
interface Props {
  entries: Record<string, TrackerEntry>;
  /** Categoría activa; `'all'` para mostrar todas las categorías. */
  activeCategory?: string;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function TrackerStats({ entries, activeCategory = 'all' }: Props) {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const all = Object.values(entries).filter(e =>
    activeCategory === 'all' || e.category === activeCategory,
  );

  const total      = all.length;
  const completed  = all.filter(e => SEMANTIC_GROUPS.completed.includes(e.status as CategoryStatus)).length;
  const inProgress = all.filter(e => SEMANTIC_GROUPS.active.includes(e.status as CategoryStatus)).length;
  const pending    = all.filter(e => SEMANTIC_GROUPS.pending.includes(e.status as CategoryStatus)).length;
  const abandoned  = all.filter(e => SEMANTIC_GROUPS.abandoned.includes(e.status as CategoryStatus)).length;
  const rated      = all.filter(e => e.rating !== null);
  const avgRating  = rated.length > 0
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : null;

  const cards = [
    { label: 'Total',          value: total,              icon: 'ri-stack-line',             accent: '#2563EB', bg: 'rgba(37,99,235,0.10)'   },
    { label: 'Completados',    value: completed,          icon: 'ri-checkbox-circle-line',    accent: '#16a34a', bg: 'rgba(22,163,74,0.10)'   },
    { label: 'En progreso',    value: inProgress,         icon: 'ri-play-circle-line',        accent: '#3b82f6', bg: 'rgba(59,130,246,0.10)'  },
    { label: 'Pendientes',     value: pending,            icon: 'ri-bookmark-line',           accent: '#f59e0b', bg: 'rgba(245,158,11,0.10)'  },
    { label: 'Abandonados',    value: abandoned,          icon: 'ri-close-circle-line',       accent: '#ef4444', bg: 'rgba(239,68,68,0.10)'   },
    { label: 'Media personal', value: avgRating ?? '—',   icon: 'ri-star-line',               accent: '#f59e0b', bg: 'rgba(245,158,11,0.10)'  },
  ];

  // ─── Renderizado ──────────────────────────────────────────────────────────

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
