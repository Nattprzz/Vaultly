/**
 * WeeklyActivity.tsx — gráfico de barras de actividad semanal del dashboard.
 *
 * Renderiza un gráfico de barras vertical con los 7 días de la semana.
 * La altura de cada barra es proporcional al día con más actividad (max normalization).
 * Si no hay datos, muestra barras en 0 con opacidad reducida.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { WeeklyActivityPoint } from '@/hooks/useDashboardStats';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del componente de actividad semanal. */
interface Props {
  data: WeeklyActivityPoint[];
  loading: boolean;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function WeeklyActivity({ data, loading }: Props) {
  const max = Math.max(...data.map(d => d.count), 1);
  const total = data.reduce((a, b) => a + b.count, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <i className="ri-calendar-check-line text-zinc-400"></i>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">Actividad esta semana</h3>
        </div>
        <span className="text-xs text-zinc-400">
          {loading ? '...' : `${total} acciones`}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2 h-24">
        {(data.length > 0 ? data : Array.from({ length: 7 }, (_, index) => ({ day: ['L', 'M', 'X', 'J', 'V', 'S', 'D'][index], count: 0 }))).map(day => {
          const heightPct = max > 0 ? (day.count / max) * 100 : 0;
          return (
            <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: day.count > 0 ? '6px' : '0',
                    background: 'var(--brand-accent)',
                    opacity: day.count > 0 ? 1 : 0.15,
                  }}
                ></div>
              </div>
              <span className="text-xs text-zinc-400 font-medium">{day.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
