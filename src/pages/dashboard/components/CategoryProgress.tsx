import { Link } from 'react-router-dom';
import type { CategoryStat } from '@/hooks/useDashboardStats';

interface Props {
  categories: CategoryStat[];
  loading: boolean;
}

export default function CategoryProgress({ categories, loading }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-bar-chart-box-line text-zinc-400"></i>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">Progreso por categoría</h3>
        </div>
        <Link to="/tracker" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer">
          Ver tracker
        </Link>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse"></div>
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <i className="ri-bar-chart-box-line text-2xl text-zinc-300 dark:text-zinc-600"></i>
            <p className="text-xs text-zinc-400 text-center">Añade ítems al tracker para ver tu progreso por categoría.</p>
          </div>
        ) : (
          categories.map(cat => {
            const completedPct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
            const inProgressPct = cat.total > 0 ? Math.round((cat.in_progress / cat.total) * 100) : 0;
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${cat.accent}20` }}>
                      <i className={`${cat.icon} text-sm`} style={{ color: cat.accent }}></i>
                    </div>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span>{cat.completed}/{cat.total}</span>
                    {cat.avg_rating != null && (
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-amber-400"></i>
                        <span>{cat.avg_rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${completedPct}%`, background: cat.accent }}></div>
                    <div className="h-full transition-all duration-700" style={{ width: `${inProgressPct}%`, background: `${cat.accent}50` }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: cat.accent }}></span>
                    Completados {completedPct}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: `${cat.accent}50` }}></span>
                    En progreso {inProgressPct}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
