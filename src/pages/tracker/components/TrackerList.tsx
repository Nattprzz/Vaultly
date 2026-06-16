/**
 * TrackerList.tsx — vista de lista horizontal del tracker.
 *
 * Muestra cada ítem como una fila con miniatura, título, metadatos (categoría,
 * año, género), badge de estado, puntuación y fecha de última actualización.
 * Al hover aparece un botón de edición que abre AddToTrackerModal. Complementa
 * la vista de grid; usa el mismo TrackerContext para editar y eliminar.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Contextos ────────────────────────────────────────────────────────────────

import { useTrackerContext } from '@/contexts/TrackerContext';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { EnrichedEntry } from './trackerEntryUtils';

// ─── Componentes ──────────────────────────────────────────────────────────────

import AddToTrackerModal from '@/pages/catalog/components/AddToTrackerModal';

// ─── Constantes ───────────────────────────────────────────────────────────────

import { STATUS_CONFIG, getStatusLabel } from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props de la vista de lista del tracker. */
interface Props {
  enriched: EnrichedEntry[];
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function TrackerList({ enriched }: Props) {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const { getEntry, addOrUpdate, remove } = useTrackerContext();
  const [editItem, setEditItem] = useState<EnrichedEntry | null>(null);

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <>
      <div className="flex flex-col gap-2">
        {enriched.map(item => {
          const status = item.status as CategoryStatus;
          const cfg    = STATUS_CONFIG[status];
          const label  = getStatusLabel(status, item.category);
          const updatedDate = new Date(item.updatedAt).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric',
          });

          return (
            <div
              key={item.itemId}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
            >
              {/* Miniatura de portada */}
              <Link to={`/catalog/${item.category}/${item.itemId}`} className="flex-shrink-0">
                <div className="w-12 h-16 rounded-lg overflow-hidden">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover object-top" />
                </div>
              </Link>

              {/* Título y metadatos */}
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
                    <i className={`${item.catIcon} text-xs`} />
                    {item.catLabel}
                  </div>
                  {item.year > 0 && <span className="text-xs text-zinc-400">{item.year}</span>}
                  {item.year > 0 && item.genre && <span className="text-xs text-zinc-400">·</span>}
                  {item.genre && <span className="text-xs text-zinc-400">{item.genre}</span>}
                </div>
                {item.review && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-1 italic">
                    &ldquo;{item.review}&rdquo;
                  </p>
                )}
              </div>

              {/* Badge de estado */}
              {cfg && (
                <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.badge.dot}`}
                  />
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge.cls}`}>
                    {label}
                  </span>
                </div>
              )}

              {/* Puntuación */}
              <div className="flex-shrink-0 hidden md:flex items-center gap-1 w-16 justify-center">
                {item.rating !== null ? (
                  <>
                    <i className="ri-star-fill text-amber-400 text-sm" />
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.rating}</span>
                    <span className="text-xs text-zinc-400">/10</span>
                  </>
                ) : (
                  <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
                )}
              </div>

              {/* Fecha de actualización */}
              <div className="flex-shrink-0 hidden lg:block text-xs text-zinc-400 w-24 text-right">
                {updatedDate}
              </div>

              {/* Botón de edición (visible en hover) */}
              <button
                onClick={() => setEditItem(item)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <i className="ri-edit-line text-sm" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal de edición */}
      {editItem && (
        <AddToTrackerModal
          itemId={editItem.itemId}
          category={editItem.category}
          title={editItem.title}
          cover={editItem.cover}
          existing={getEntry(editItem.itemId)}
          onSave={(status, rating, review, gd) => addOrUpdate(editItem.itemId, editItem.category, status, rating, review, gd)}
          onRemove={() => remove(editItem.itemId)}
          onClose={() => setEditItem(null)}
        />
      )}
    </>
  );
}
