import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrackerStatus, useTracker } from '@/hooks/useTracker';
import AddToTrackerModal from '@/pages/catalog/components/AddToTrackerModal';
import type { EnrichedEntry } from './trackerEntryUtils';

const STATUS_BADGE: Record<TrackerStatus, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500' },
  in_progress: { label: 'En progreso', cls: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' },
  completed: { label: 'Completado', cls: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
  dropped: { label: 'Abandonado', cls: 'bg-rose-100 dark:bg-rose-950/40 text-rose-500' },
};

interface Props {
  enriched: EnrichedEntry[];
}

export default function TrackerGrid({ enriched }: Props) {
  const { getEntry, addOrUpdate, remove } = useTracker();
  const [editItem, setEditItem] = useState<EnrichedEntry | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {enriched.map(item => {
          const badge = STATUS_BADGE[item.status];
          return (
            <div key={item.itemId} className="group relative">
              <Link to={`/catalog/${item.category}/${item.itemId}`} className="block">
                <div className="relative mb-2.5 aspect-[2/3] overflow-hidden rounded-xl">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-2 top-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  {item.rating !== null && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm">
                      <i className="ri-star-fill text-xs text-amber-400"></i>
                      <span className="text-xs font-semibold text-white">{item.rating}</span>
                    </div>
                  )}
                  <div className="absolute right-2 top-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-lg backdrop-blur-sm"
                      style={{ background: `${item.catAccent}30` }}
                    >
                      <i className={`${item.catIcon} text-xs`} style={{ color: item.catAccent }}></i>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={e => { e.preventDefault(); setEditItem(item); }}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900"
                    >
                      <i className="ri-edit-line mr-1"></i>Editar
                    </button>
                  </div>
                </div>
              </Link>
              <h3 className="mb-0.5 line-clamp-2 text-xs font-semibold leading-tight text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400">{item.year} · {item.genre}</p>
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
