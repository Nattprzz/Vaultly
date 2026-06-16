/**
 * PublicProfileStats.tsx — estadísticas públicas del perfil de otro usuario.
 *
 * Muestra el resumen global, desglose por categoría y distribución de
 * puntuaciones del tracker público del usuario visitado. Respeta los flags
 * de privacidad: oculta el estado de ítems o las reseñas si así lo ha
 * configurado el propietario del perfil.
 */

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { usePublicTracker } from '@/hooks/usePublicTracker';
import { useCategories }    from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { PublicPrivacyFlags } from '@/types/privacy';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del panel de estadísticas públicas. */
interface Props {
  userId:  string | null;
  privacy: PublicPrivacyFlags;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function PublicProfileStats({ userId, privacy }: Props) {
  // ─── Datos derivados ──────────────────────────────────────────────────────

  const CATEGORIES = useCategories();
  const { entries, loading, hidden } = usePublicTracker(userId, privacy);

  // ─── Renderizado ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="h-5 w-40 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mb-5"></div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (hidden) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <i className="ri-lock-line text-3xl text-zinc-300 dark:text-zinc-600 mb-3"></i>
        <p className="text-sm text-zinc-500">Este usuario ha ocultado sus estadísticas públicas.</p>
      </div>
    );
  }

  const showStatus     = privacy.show_item_status !== false;
  const completed      = showStatus ? entries.filter(e => e.status === 'completed').length : 0;
  const inProgress     = showStatus ? entries.filter(e => e.status === 'in_progress').length : 0;
  const pending        = showStatus ? entries.filter(e => e.status === 'pending').length : 0;
  const dropped        = showStatus ? entries.filter(e => e.status === 'dropped').length : 0;
  const completionRate = entries.length > 0 ? Math.round((completed / entries.length) * 100) : 0;

  const rated      = entries.filter(e => e.rating !== null);
  const avgRating  = rated.length > 0
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—';

  const ratingDist = Array.from({ length: 10 }, (_, i) => {
    const score = i + 1;
    const count = rated.filter(e => e.rating === score).length;
    return { score, count };
  });
  const maxCount = Math.max(...ratingDist.map(r => r.count), 1);

  const catStats = CATEGORIES.map(cat => {
    const catEntries   = entries.filter(e => e.category === cat.id);
    if (catEntries.length === 0) return null;
    const catCompleted = showStatus ? catEntries.filter(e => e.status === 'completed').length : 0;
    const catRated     = catEntries.filter(e => e.rating !== null);
    const catAvg       = catRated.length > 0
      ? (catRated.reduce((s, e) => s + (e.rating ?? 0), 0) / catRated.length).toFixed(1)
      : null;
    const pct = showStatus ? Math.round((catCompleted / catEntries.length) * 100) : 0;
    return { ...cat, total: catEntries.length, completed: catCompleted, avg: catAvg, pct };
  }).filter(Boolean) as (typeof CATEGORIES[0] & { total: number; completed: number; avg: string | null; pct: number })[];

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <i className="ri-bar-chart-box-line text-3xl text-zinc-300 dark:text-zinc-600 mb-3"></i>
        <p className="text-sm text-zinc-500">Sin estadísticas todavía.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Resumen global */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
          <i className="ri-pie-chart-line text-brand dark:text-brand-dark"></i>
          Resumen global
        </h3>
        {showStatus ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Tasa de finalización</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{completionRate}%</span>
              </div>
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-brand dark:bg-brand-dark transition-all duration-700" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Completados', value: completed,  color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: 'ri-checkbox-circle-line' },
                { label: 'En progreso', value: inProgress, color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-950/30',     icon: 'ri-loader-4-line'        },
                { label: 'Pendientes',  value: pending,    color: 'text-zinc-500',     bg: 'bg-zinc-100 dark:bg-zinc-800',         icon: 'ri-bookmark-line'        },
                { label: 'Abandonados', value: dropped,    color: 'text-red-500',      bg: 'bg-red-50 dark:bg-red-950/30',         icon: 'ri-close-circle-line'    },
              ].map(s => (
                <div key={s.label} className={`flex flex-col items-center gap-1.5 py-4 rounded-xl ${s.bg}`}>
                  <i className={`${s.icon} ${s.color} text-xl`}></i>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</span>
                  <span className="text-xs text-zinc-500">{s.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <i className="ri-lock-line text-zinc-400"></i>
            El usuario ha ocultado el estado de sus items.
          </div>
        )}
      </div>

      {/* Desglose por categoría */}
      {catStats.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
            <i className="ri-bar-chart-box-line text-brand dark:text-brand-dark"></i>
            Por categoría
          </h3>
          <div className="flex flex-col gap-4">
            {catStats.map(cat => (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${cat.accent}20` }}>
                      <i className={`${cat.icon} text-sm`} style={{ color: cat.accent }}></i>
                    </div>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    {showStatus ? <span>{cat.completed}/{cat.total}</span> : <span>{cat.total} items</span>}
                    {cat.avg && (
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-amber-400"></i>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{cat.avg}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.pct}%`, background: cat.accent }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribución de puntuaciones */}
      {rated.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
            <i className="ri-star-line text-amber-400"></i>
            Distribución de puntuaciones
          </h3>
          <div className="flex items-end gap-2 h-28">
            {ratingDist.map(({ score, count }) => (
              <div key={score} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-zinc-500">{count > 0 ? count : ''}</span>
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height:    `${(count / maxCount) * 80}px`,
                    minHeight: count > 0 ? '4px' : '0',
                    background: count > 0 ? (score >= 9 ? '#10b981' : score >= 7 ? '#f59e0b' : '#f43f5e') : '#f4f4f5',
                  }}
                ></div>
                <span className="text-xs text-zinc-400">{score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tarjetas de datos destacados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: 'ri-star-fill',    iconColor: 'text-amber-400',             bg: 'bg-amber-50 dark:bg-amber-950/30',          value: avgRating,                                                                                                                         label: 'Puntuación media'    },
          { icon: 'ri-quill-pen-line', iconColor: 'text-brand dark:text-brand-dark', bg: 'bg-brand/10 dark:bg-brand-dark/15',   value: !privacy.show_reviews ? '—' : entries.filter(e => e.review?.trim()).length, label: 'Reseñas escritas'     },
          { icon: 'ri-trophy-line',  iconColor: 'text-emerald-500',           bg: 'bg-emerald-50 dark:bg-emerald-950/30',      value: `${completionRate}%`,                                                                                                              label: 'Tasa de finalización'},
        ].filter(f => showStatus || f.icon !== 'ri-trophy-line').map(f => (
          <div key={f.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${f.bg} mx-auto mb-3`}>
              <i className={`${f.icon} ${f.iconColor} text-lg`}></i>
            </div>
            <p className="text-2xl font-black text-zinc-900 dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.value}</p>
            <p className="text-xs text-zinc-500">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
