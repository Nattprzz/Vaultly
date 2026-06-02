import { Link } from 'react-router-dom';
import type { RecentActivityItem } from '@/hooks/useDashboardStats';
import { timeAgo, statusLabel } from '@/hooks/useDashboardStats';

interface Props {
  items: RecentActivityItem[];
  loading: boolean;
}

export default function RecentActivity({ items, loading }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-history-line text-zinc-400"></i>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">Actividad reciente</h3>
        </div>
        <Link to="/tracker" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer">
          Ver todo
        </Link>
      </div>

      {loading ? (
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3.5 w-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <i className="ri-history-line text-zinc-400 text-xl"></i>
          </div>
          <p className="text-sm text-zinc-500">Aún no hay actividad. ¡Añade algo al tracker!</p>
          <Link to="/catalog" className="text-xs text-violet-500 hover:text-violet-600 font-medium cursor-pointer">
            Explorar catálogo →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              {/* Category icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.accent}18` }}
              >
                <i className={`${item.icon} text-lg`} style={{ color: item.accent }}></i>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-900 dark:text-white font-medium truncate">
                  {item.item_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {statusLabel(item.status_en)}
                  {item.rating != null && <span className="ml-1">· {item.rating}/10</span>}
                </p>
              </div>

              {/* Category badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                style={{ background: `${item.accent}18`, color: item.accent }}
              >
                <span className="hidden sm:inline">{item.categoryLabel}</span>
              </div>

              {/* Rating */}
              {item.rating != null && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <i className="ri-star-fill text-amber-400 text-xs"></i>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.rating}</span>
                </div>
              )}

              {/* Time */}
              <p className="text-xs text-zinc-400 flex-shrink-0 hidden md:block">{timeAgo(item.updated_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
