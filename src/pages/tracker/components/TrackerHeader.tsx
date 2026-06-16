/**
 * TrackerHeader.tsx — cabecera con estadísticas rápidas del tracker.
 *
 * Muestra el título "Mi Tracker" con el nombre de usuario y el total de ítems,
 * junto a cuatro tarjetas de stats calculadas en línea: completados, en progreso,
 * pendientes y puntuación media. Incluye un CTA directo al catálogo.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { TrackerEntry } from '@/hooks/useTracker';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props de la cabecera del tracker. */
interface Props {
  entries: Record<string, TrackerEntry>;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function TrackerHeader({ entries }: Props) {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const { profile, user } = useAuth();
  const all = Object.values(entries);
  const completed = all.filter(e => e.status === 'completed').length;
  const inProgress = all.filter(e => ['playing', 'watching', 'reading'].includes(e.status)).length;
  const pending = all.filter(e => e.status === 'pending').length;
  const rated = all.filter(e => e.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—';

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Tu vault personal</p>
          <h1
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Mi Tracker
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            @{profile?.username ?? user?.email?.split('@')[0] ?? 'usuario'} · {all.length} ítems en total
          </p>
        </div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <i className="ri-add-line"></i>
          Añadir contenido
        </Link>
      </div>

      {/* Tarjetas de estadísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Completados',      value: completed,  icon: 'ri-checkbox-circle-line', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'En progreso',      value: inProgress, icon: 'ri-loader-4-line',         color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-950/30'    },
          { label: 'Pendientes',       value: pending,    icon: 'ri-bookmark-line',          color: 'text-zinc-500',    bg: 'bg-zinc-100 dark:bg-zinc-800/50'     },
          { label: 'Puntuación media', value: avgRating,  icon: 'ri-star-line',              color: 'text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30'   },
        ].map(stat => (
          <div key={stat.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${stat.bg}`}>
            <i className={`${stat.icon} text-xl ${stat.color}`}></i>
            <div>
              <p className="text-lg font-black text-zinc-900 dark:text-white leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
