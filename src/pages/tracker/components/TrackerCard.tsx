/**
 * TrackerCard.tsx — tarjeta individual del tracker en vista póster.
 *
 * Muestra la portada del ítem en formato 2:3 con tres capas de información:
 * - Badge de categoría (arriba izquierda) con icono y color acento.
 * - Puntuación (arriba derecha) si existe.
 * - Badge de estado (abajo izquierda) con dot de color y etiqueta.
 * Al pasar el ratón aparece un overlay con botones de Editar (abre
 * AddToTrackerModal) y Eliminar. La tarjeta enlaza al detalle del catálogo.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Contextos ────────────────────────────────────────────────────────────────

import { useTrackerContext } from '@/contexts/TrackerContext';

// ─── Componentes ──────────────────────────────────────────────────────────────

import AddToTrackerModal from '@/pages/catalog/components/AddToTrackerModal';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { EnrichedEntry } from './trackerEntryUtils';

// ─── Constantes ───────────────────────────────────────────────────────────────

import { STATUS_CONFIG, getStatusLabel, getStatusIcon } from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props de la tarjeta del tracker. */
interface Props {
  item: EnrichedEntry;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function TrackerCard({ item }: Props) {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const { getEntry, addOrUpdate, remove } = useTrackerContext();
  const [editing, setEditing] = useState(false);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const status = item.status as CategoryStatus;
  const cfg    = STATUS_CONFIG[status];
  const label  = getStatusLabel(status, item.category);
  const icon   = getStatusIcon(status, item.category);

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <>
      <div className="group relative">
        {/* Enlace al detalle del catálogo (ocupa toda la portada) */}
        <Link to={`/catalog/${item.category}/${item.itemId}`} className="block">
          <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl bg-[var(--surface-sunken)] shadow-[var(--shadow-md)]">

            {/* Portada o placeholder con icono de categoría */}
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

            {/* Gradientes para mejorar la legibilidad de los badges */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Badge de categoría — arriba izquierda */}
            <div
              className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm"
              style={{
                background: `${item.catAccent}28`,
                color: item.catAccent,
                border: `1px solid ${item.catAccent}45`,
              }}
            >
              <i className={item.catIcon} />
              <span className="hidden sm:inline">{item.catLabel}</span>
            </div>

            {/* Puntuación — arriba derecha */}
            {item.rating !== null && (
              <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-xl bg-black/75 px-2 py-1 backdrop-blur-sm">
                <i className="ri-star-fill text-[10px] text-amber-400" />
                <span className="text-xs font-black text-white">{item.rating}</span>
              </div>
            )}

            {/* Badge de estado — abajo izquierda */}
            {cfg && (
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 backdrop-blur-sm">
                <span
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: cfg.color }}
                />
                <i className={`${icon} text-[9px]`} style={{ color: cfg.color }} />
                <span className="text-[10px] font-semibold text-white">{label}</span>
              </div>
            )}

            {/* Overlay con acciones al hover */}
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

        {/* Información bajo la portada */}
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

      {/* Modal de edición */}
      {editing && (
        <AddToTrackerModal
          itemId={item.itemId}
          category={item.category}
          title={item.title}
          cover={item.cover}
          existing={getEntry(item.itemId)}
          onSave={(s, r, rev, gd) => addOrUpdate(item.itemId, item.category, s, r, rev, gd)}
          onRemove={() => remove(item.itemId)}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
