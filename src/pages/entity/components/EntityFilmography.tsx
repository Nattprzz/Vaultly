/**
 * EntityFilmography.tsx — filmografía y obras de una entidad del catálogo.
 *
 * Muestra todos los ítems vinculados a la entidad con filtro por categoría,
 * ordenación por año/rating/título y cambio de vista entre cuadrícula y lista.
 * En vista de cuadrícula muestra portadas con badges de rating y categoría.
 * En vista de lista muestra una tabla con miniatura, título, año y rating.
 * Si hay más de 12 (cuadrícula) / 15 (lista) ítems, ofrece un botón "Ver más".
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import type { EntityItem } from '@/hooks/useEntity';
import { useCategories } from '@/hooks/useCategoryColors';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { toAppCategory } from '@/lib/categories';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del componente principal. */
interface Props {
  /** Lista de ítems vinculados a la entidad. */
  items: EntityItem[];
  /** Nombre de la entidad, usado en el subtítulo "X obras de Y". */
  entityName: string;
}

/** Clave de ordenación disponible. */
type SortKey = 'year_desc' | 'year_asc' | 'rating_desc' | 'rating_asc' | 'title_asc';

/** Modo de visualización: cuadrícula de portadas o lista con rango. */
type ViewMode = 'grid' | 'list';

// ─── Constantes ──────────────────────────────────────────────────────────────

/** Opciones de ordenación con etiqueta e icono Remix. */
const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'year_desc',   label: 'Más reciente',   icon: 'ri-sort-desc' },
  { key: 'year_asc',    label: 'Más antiguo',     icon: 'ri-sort-asc' },
  { key: 'rating_desc', label: 'Mejor valorado',  icon: 'ri-star-fill' },
  { key: 'rating_asc',  label: 'Menor rating',    icon: 'ri-star-line' },
  { key: 'title_asc',   label: 'A → Z',           icon: 'ri-sort-alphabet-asc' },
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Extrae el rating numérico de un ítem.
 *
 * @param item - Ítem del catálogo.
 * @returns Número del rating o `null` si no existe.
 */
function getItemRating(item: EntityItem): number | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r) : null;
}

/**
 * Extrae el año de lanzamiento de un ítem como cadena de 4 dígitos.
 *
 * @param item - Ítem del catálogo.
 * @returns Año como string o cadena vacía.
 */
function getItemYear(item: EntityItem): string {
  return item.release_date?.slice(0, 4) ?? '';
}

/**
 * Extrae el primer género del ítem desde `metadata.genres` o `metadata.genre`.
 *
 * @param item - Ítem del catálogo.
 * @returns Nombre del género o cadena vacía.
 */
function getItemGenre(item: EntityItem): string {
  const g = item.metadata?.genres ?? item.metadata?.genre;
  if (Array.isArray(g)) return g[0] ?? '';
  return String(g ?? '');
}

/**
 * Ordena una copia del array de ítems según la clave de ordenación indicada.
 *
 * @param items - Lista original (no se muta).
 * @param sort  - Clave de ordenación.
 * @returns Nueva lista ordenada.
 */
function sortItems(items: EntityItem[], sort: SortKey): EntityItem[] {
  return [...items].sort((a, b) => {
    switch (sort) {
      case 'year_desc':   return (Number(getItemYear(b)) || 0) - (Number(getItemYear(a)) || 0);
      case 'year_asc':    return (Number(getItemYear(a)) || 0) - (Number(getItemYear(b)) || 0);
      case 'rating_desc': return (getItemRating(b) ?? -1) - (getItemRating(a) ?? -1);
      case 'rating_asc':  return (getItemRating(a) ?? 11) - (getItemRating(b) ?? 11);
      case 'title_asc':   return a.title.localeCompare(b.title);
      default:            return 0;
    }
  });
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/** Props de la tarjeta de cuadrícula. */
interface GridCardProps {
  /** Ítem a mostrar. */
  item: EntityItem;
}

/**
 * Tarjeta vertical con portada (aspect 2:3), badge de categoría, badge de rating
 * y superposición de hover con flecha de navegación.
 *
 * @param item - Ítem del catálogo.
 */
function GridCard({ item }: GridCardProps) {
  const CATEGORIES = useCategories();
  const rating     = getItemRating(item);
  const year       = getItemYear(item);
  const genre      = getItemGenre(item);
  const categoryId = toAppCategory(item.category) ?? item.category;
  const cat        = CATEGORIES.find(c => c.id === categoryId);

  return (
    <Link to={`/catalog/${categoryId}/${item.slug}`} className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-3 aspect-[2/3] bg-zinc-100 dark:bg-zinc-800">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className={`${cat?.icon ?? 'ri-image-line'} text-3xl text-zinc-300 dark:text-zinc-600`}></i>
          </div>
        )}

        {/* Superposición de hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
            <i className="ri-arrow-right-line text-zinc-900 text-sm"></i>
          </div>
        </div>

        {/* Badge de rating */}
        {rating != null && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm">
            <i className="ri-star-fill text-amber-400 text-xs"></i>
            <span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Badge de categoría */}
        {cat && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-white text-[10px] font-semibold"
            style={{ background: cat.accent }}
          >
            <i className={`${cat.icon} text-[10px]`}></i>
            {cat.label}
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1 line-clamp-2">
        {item.title}
      </h3>
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs text-zinc-500 flex-shrink-0">{year}</span>
        {genre && <span className="text-xs text-zinc-400 truncate">{genre}</span>}
      </div>
      {item.role && (
        <p className="text-xs text-zinc-400 italic mt-0.5 truncate">{item.role}</p>
      )}
    </Link>
  );
}

/** Props de la fila de lista. */
interface ListRowProps {
  /** Ítem a mostrar. */
  item: EntityItem;
  /** Posición en el ranking actual (1-indexado). */
  rank: number;
}

/**
 * Fila horizontal con número de rango, miniatura, título, año y rating.
 * El color del rating varía según su valor: verde ≥9, ámbar ≥7, gris el resto.
 *
 * @param item - Ítem del catálogo.
 * @param rank - Posición ordinal en la lista mostrada.
 */
function ListRow({ item, rank }: ListRowProps) {
  const CATEGORIES = useCategories();
  const rating     = getItemRating(item);
  const year       = getItemYear(item);
  const genre      = getItemGenre(item);
  const categoryId = toAppCategory(item.category) ?? item.category;
  const cat        = CATEGORIES.find(c => c.id === categoryId);

  const ratingColor = rating != null
    ? rating >= 9 ? 'text-emerald-500' : rating >= 7 ? 'text-amber-500' : 'text-zinc-400'
    : 'text-zinc-400';

  return (
    <Link
      to={`/catalog/${categoryId}/${item.slug}`}
      className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
    >
      {/* Posición */}
      <span className="text-xs font-bold text-zinc-300 dark:text-zinc-600 w-5 text-center flex-shrink-0">
        {rank}
      </span>

      {/* Miniatura */}
      <div className="w-10 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className={`${cat?.icon ?? 'ri-image-line'} text-xs text-zinc-400`}></i>
          </div>
        )}
      </div>

      {/* Título, categoría, género y rol */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {cat && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white"
              style={{ background: cat.accent }}
            >
              {cat.label}
            </span>
          )}
          {genre && <span className="text-xs text-zinc-400">{genre}</span>}
          {item.role && <span className="text-xs text-zinc-400 italic">· {item.role}</span>}
        </div>
      </div>

      {/* Año */}
      <span className="text-xs text-zinc-400 flex-shrink-0 hidden sm:block">{year}</span>

      {/* Rating */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {rating != null ? (
          <>
            <i className="ri-star-fill text-amber-400 text-xs"></i>
            <span className={`text-sm font-bold ${ratingColor}`}>{rating.toFixed(1)}</span>
          </>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </div>

      {/* Flecha de navegación */}
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <i className="ri-arrow-right-s-line text-zinc-400 text-sm"></i>
      </div>
    </Link>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EntityFilmography({ items, entityName }: Props) {
  const CATEGORIES = useCategories();

  // ─── Estado ───────────────────────────────────────────────────────────────

  const [sort,           setSort]           = useState<SortKey>('year_desc');
  const [view,           setView]           = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAll,        setShowAll]        = useState(false);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const availableCategories = useMemo(() => {
    const cats = new Set(items.map(i => toAppCategory(i.category) ?? i.category));
    return Array.from(cats);
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter(i => (toAppCategory(i.category) ?? i.category) === activeCategory);
  }, [items, activeCategory]);

  const sorted = useMemo(() => sortItems(filtered, sort), [filtered, sort]);

  const GRID_LIMIT = 12;
  const LIST_LIMIT = 15;
  const limit    = view === 'grid' ? GRID_LIMIT : LIST_LIMIT;
  const displayed = showAll ? sorted : sorted.slice(0, limit);
  const hasMore   = sorted.length > limit && !showAll;

  if (items.length === 0) return null;

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {/* Cabecera con controles */}
      <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2
              className="text-xl font-bold text-zinc-900 dark:text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Filmografía &amp; Obras
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {sorted.length} obra{sorted.length !== 1 ? 's' : ''} de {entityName}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Selector de ordenación */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-down-s-line text-zinc-400 text-sm"></i>
              </div>
            </div>

            {/* Alternador de vista cuadrícula / lista */}
            <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-2 flex items-center justify-center transition-colors cursor-pointer ${
                  view === 'grid'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <i className="ri-grid-line text-sm"></i>
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 flex items-center justify-center transition-colors cursor-pointer ${
                  view === 'list'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <i className="ri-list-check text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Pestañas de filtro por categoría */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              Todas ({items.length})
            </button>
            {availableCategories.map(catId => {
              const cat   = CATEGORIES.find(c => c.id === catId);
              const count = items.filter(i => (toAppCategory(i.category) ?? i.category) === catId).length;
              return (
                <button
                  key={catId}
                  onClick={() => setActiveCategory(catId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === catId
                      ? 'text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                  style={activeCategory === catId ? { background: cat?.accent ?? '#888' } : {}}
                >
                  {cat && <i className={`${cat.icon} text-xs`}></i>}
                  {cat?.label ?? catId} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <i className="ri-inbox-line text-xl text-zinc-400"></i>
            </div>
            <p className="text-sm text-zinc-500">No hay obras en esta categoría</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {displayed.map(item => (
              <GridCard key={`${item.id}-${item.role}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-50 dark:divide-zinc-800/60">
            {displayed.map((item, i) => (
              <ListRow key={`${item.id}-${item.role}`} item={item} rank={i + 1} />
            ))}
          </div>
        )}

        {/* Botón "Ver más" */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line text-sm"></i>
              Ver las {sorted.length - limit} obras restantes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
