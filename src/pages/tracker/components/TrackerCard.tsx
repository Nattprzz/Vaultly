import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrackerStatus, useTracker } from '@/hooks/useTracker';
import AddToTrackerModal from '@/pages/catalog/components/AddToTrackerModal';
import type { EnrichedEntry } from './trackerEntryUtils';

const STATUS_CONFIG: Record<TrackerStatus, { label: string; dot: string; ring: string }> = {
  completed:   { label: 'Completado',  dot: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
  in_progress: { label: 'En progreso', dot: 'bg-orange-500',  ring: 'ring-orange-500/30' },
  pending:     { label: 'Pendiente',   dot: 'bg-slate-400',   ring: 'ring-slate-400/30' },
  dropped:     { label: 'Abandonado',  dot: 'bg-red-500',     ring: 'ring-red-500/30' },
};

interface Props {
  item: EnrichedEntry;
}

export default function TrackerCard({ item }: Props) {
  const { getEntry, addOrUpdate, remove } = useTracker();
  const [editing, setEditing] = useState(false);
  const status = STATUS_CONFIG[item.status];

  return (
    <>
      <div className="group relative">
        {/* Poster */}
        <Link to={`/catalog/${item.category}/${item.itemId}`} className="block">
          <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl bg-[var(--surface-sunken)] shadow-[var(--shadow-md)]">

            {/* Cover image */}
            {item.cover ? (
              <img
                src={item.cover}
                alt={item.title}
                className="h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-105 group-hover:brightness-60"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <i
                  className={`${item.catIcon} text-5xl opacity-15`}
                  style={{ color: item.catAccent }}
                />
              </div>
            )}

            {/* Persistent top gradient for badges */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
            {/* Bottom gradient for status */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Category badge — top left */}
            <div
              className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm"
              style={{
                background: `${item.catAccent}28`,
                color: item.catAccent,
                border: `1px solid ${item.catAccent}45`,
              }}
            >
              <i className={`${item.catIcon}`} />
              <span className="hidden sm:inline">{item.catLabel}</span>
            </div>

            {/* Rating — top right */}
            {item.rating !== null && (
              <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-xl bg-black/75 px-2 py-1 backdrop-blur-sm">
                <i className="ri-star-fill text-[10px] text-amber-400" />
                <span className="text-xs font-black text-white">{item.rating}</span>
              </div>
            )}

            {/* Status — bottom left */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 backdrop-blur-sm">
              <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${status.dot}`} />
              <span className="text-[10px] font-semibold text-white">{status.label}</span>
            </div>

            {/* Hover overlay with actions */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                onClick={e => { e.preventDefault(); setEditing(true); }}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-zinc-900 shadow-lg transition-colors hover:bg-zinc-100"
              >
                <i className="ri-edit-line" />
                Editar
              </button>
              <button
                onClick={async e => { e.preventDefault(); await remove(item.itemId); }}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-500/90 px-4 py-2 text-xs font-bold text-white shadow-lg transition-colors hover:bg-red-600"
              >
                <i className="ri-delete-bin-line" />
                Eliminar
              </button>
            </div>
          </div>
        </Link>

        {/* Info below poster */}
        <div className="px-0.5">
          <h3 className="mb-0.5 line-clamp-1 text-sm font-bold leading-tight text-[var(--text-primary)]">
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
            {item.year > 0 && <span>{item.year}</span>}
            {item.year > 0 && item.genre && <span>·</span>}
            {item.genre && <span className="truncate">{item.genre}</span>}
          </div>
        </div>
      </div>

      {editing && (
        <AddToTrackerModal
          itemId={item.itemId}
          category={item.category}
          title={item.title}
          cover={item.cover}
          existing={getEntry(item.itemId)}
          onSave={(s, r, rev) => addOrUpdate(item.itemId, item.category, s, r, rev)}
          onRemove={() => remove(item.itemId)}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
