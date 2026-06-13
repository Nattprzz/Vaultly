import { useTracker } from '@/hooks/useTracker';
import { useCategories } from '@/hooks/useCategoryColors';
import { SEMANTIC_GROUPS } from '@/constants/tracker-statuses';

export default function ProfileStats() {
  const CATEGORIES = useCategories();
  const { entries } = useTracker();
  const all = Object.values(entries);

  const globalCompleted = all.filter(e => e.status === 'completed').length;
  const globalInProgress = all.filter(e => (SEMANTIC_GROUPS.active as readonly string[]).includes(e.status)).length;
  const globalPending = all.filter(e => e.status === 'pending').length;
  const globalDropped = all.filter(e => (SEMANTIC_GROUPS.abandoned as readonly string[]).includes(e.status)).length;
  const completionRate = all.length > 0 ? Math.round((globalCompleted / all.length) * 100) : 0;

  const rated = all.filter(e => e.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—';

  // Top rated item
  const topRated = [...all].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Global overview */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
          <i className="ri-pie-chart-line text-brand dark:text-brand-dark"></i>
          Resumen global
        </h3>

        {/* Completion bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Tasa de finalización</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">{completionRate}%</span>
          </div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-brand dark:bg-brand-dark transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Completados', value: globalCompleted, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: 'ri-checkbox-circle-line' },
            { label: 'En progreso', value: globalInProgress, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: 'ri-loader-4-line' },
            { label: 'Pendientes',  value: globalPending,    color: 'text-zinc-500',   bg: 'bg-zinc-100 dark:bg-zinc-800',       icon: 'ri-bookmark-line' },
            { label: 'Abandonados', value: globalDropped,    color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-950/30',     icon: 'ri-close-circle-line' },
          ].map(s => (
            <div key={s.label} className={`flex flex-col items-center gap-1.5 py-4 rounded-xl ${s.bg}`}>
              <i className={`${s.icon} ${s.color} text-xl`}></i>
              <span className="text-2xl font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</span>
              <span className="text-xs text-zinc-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
          <i className="ri-bar-chart-box-line text-brand dark:text-brand-dark"></i>
          Por categoría
        </h3>
        <div className="flex flex-col gap-4">
          {CATEGORIES.map(cat => {
            const catEntries = all.filter(e => e.category === cat.id);
            if (catEntries.length === 0) return null;
            const catCompleted = catEntries.filter(e => e.status === 'completed').length;
            const catRated = catEntries.filter(e => e.rating !== null);
            const catAvg = catRated.length > 0
              ? (catRated.reduce((s, e) => s + (e.rating ?? 0), 0) / catRated.length).toFixed(1)
              : '—';
            const pct = catEntries.length > 0 ? Math.round((catCompleted / catEntries.length) * 100) : 0;

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${cat.accent}20` }}>
                      <i className={`${cat.icon} text-sm`} style={{ color: cat.accent }}></i>
                    </div>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>{catCompleted}/{catEntries.length}</span>
                    {catAvg !== '—' && (
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-amber-400"></i>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{catAvg}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: cat.accent }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fun facts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 mx-auto mb-3">
            <i className="ri-star-fill text-amber-400 text-lg"></i>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{avgRating}</p>
          <p className="text-xs text-zinc-500">Puntuación media</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand/10 dark:bg-brand-dark/15 mx-auto mb-3">
            <i className="ri-quill-pen-line text-brand dark:text-brand-dark text-lg"></i>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {all.filter(e => e.review?.trim()).length}
          </p>
          <p className="text-xs text-zinc-500">Reseñas escritas</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 text-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 mx-auto mb-3">
            <i className="ri-trophy-line text-emerald-500 text-lg"></i>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{completionRate}%</p>
          <p className="text-xs text-zinc-500">Tasa de finalización</p>
        </div>
      </div>
    </div>
  );
}

