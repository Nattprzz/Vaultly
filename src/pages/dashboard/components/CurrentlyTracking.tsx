import { Link } from 'react-router-dom';
import type { CurrentlyTrackingItem } from '@/hooks/useDashboardStats';

interface Props {
  items: CurrentlyTrackingItem[];
  loading: boolean;
}

export default function CurrentlyTracking({ items, loading }: Props) {
  if (!loading && items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-loader-4-line text-zinc-400"></i>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">En progreso ahora</h3>
        </div>
        <Link to="/tracker" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer">
          Ver tracker
        </Link>
      </div>

      <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[3/4] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
              <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
            </div>
          ))
        ) : (
          items.map(item => (
            <Link
              key={item.id}
              to={`/tracker/${item.category}`}
              className="group cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden mb-3 aspect-[3/4]"
                style={{ background: `${item.accent}15` }}>
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ background: `${item.accent}25` }}>
                        <i className={`${item.icon} text-2xl`} style={{ color: item.accent }}></i>
                      </div>
                    </div>
                  </div>
                )}
                {/* In progress badge */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-white text-xs font-semibold" style={{ background: item.accent }}>
                  <i className="ri-loader-4-line"></i>
                </div>
              </div>
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-2 mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-400">En progreso</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
