import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTracker } from '@/hooks/useTracker';
import type { EnrichedEntry } from './trackerEntryUtils';
import AddToTrackerModal from '@/pages/catalog/components/AddToTrackerModal';
import { TrackerStatus } from '@/hooks/useTracker';

const STATUS_BADGE: Record<TrackerStatus, { label: string; cls: string; dot: string }> = {
  pending:     { label: 'Pendiente',    cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500',                              dot: 'bg-zinc-400' },
  in_progress: { label: 'En progreso', cls: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',    dot: 'bg-amber-400' },
  completed:   { label: 'Completado',  cls: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-400' },
  dropped:     { label: 'Abandonado',  cls: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400',                  dot: 'bg-red-400' },
};

interface Props {
  enriched: EnrichedEntry[];
}

export default function TrackerList({ enriched }: Props) {
  const { getEntry, addOrUpdate, remove } = useTracker();
  const [editItem, setEditItem] = useState<EnrichedEntry | null>(null);

  return (
    <>
      <div className="flex flex-col gap-2">
        {enriched.map(item => {
          const badge = STATUS_BADGE[item.status];
          const updatedDate = new Date(item.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
          return (
            <div
              key={item.itemId}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
            >
              {/* Cover */}
              <Link to={`/catalog/${item.category}/${item.itemId}`} className="flex-shrink-0">
                <div className="w-12 h-16 rounded-lg overflow-hidden">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover object-top" />
                </div>
              </Link>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <Link to={`/catalog/${item.category}/${item.itemId}`} className="cursor-pointer">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight hover:text-brand dark:hover:text-brand-dark transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${item.catAccent}15`, color: item.catAccent }}
                  >
                    <i className={`${item.catIcon} text-xs`}></i>
                    {item.catLabel}
                  </div>
                  <span className="text-xs text-zinc-400">{item.year}</span>
                  <span className="text-xs text-zinc-400">·</span>
                  <span className="text-xs text-zinc-400">{item.genre}</span>
                </div>
                {item.review && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-1 italic">
                    &ldquo;{item.review}&rdquo;
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>

              {/* Rating */}
              <div className="flex-shrink-0 hidden md:flex items-center gap-1 w-16 justify-center">
                {item.rating !== null ? (
                  <>
                    <i className="ri-star-fill text-amber-400 text-sm"></i>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.rating}</span>
                    <span className="text-xs text-zinc-400">/10</span>
                  </>
                ) : (
                  <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
                )}
              </div>

              {/* Date */}
              <div className="flex-shrink-0 hidden lg:block text-xs text-zinc-400 w-24 text-right">
                {updatedDate}
              </div>

              {/* Edit button */}
              <button
                onClick={() => setEditItem(item)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <i className="ri-edit-line text-sm"></i>
              </button>
            </div>
          );
        })}
      </div>

      {editItem && (
        <AddToTrackerModal
          itemId={editItem.itemId}
          category={editItem.category}
          title={editItem.title}
          cover={editItem.cover}
          existing={getEntry(editItem.itemId)}
          onSave={(status, rating, review) => addOrUpdate(editItem.itemId, editItem.category, status, rating, review)}
          onRemove={() => remove(editItem.itemId)}
          onClose={() => setEditItem(null)}
        />
      )}
    </>
  );
}
