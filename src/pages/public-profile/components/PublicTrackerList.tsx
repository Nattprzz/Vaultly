/**
 * PublicTrackerList.tsx — listado del tracker público de otro usuario.
 *
 * Permite filtrar por categoría, estado y búsqueda de texto, y alternar
 * entre vista en cuadrícula (GridView) y lista (ListView). El listado
 * se agrupa por categoría cuando se muestra "Todo". Respeta los flags de
 * privacidad: si show_item_status es false, oculta los badges de estado.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { usePublicTracker, type PublicEntry } from '@/hooks/usePublicTracker';
import { useCategories }                      from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { PublicPrivacyFlags } from '@/types/privacy';
import type { CategoryStatus }     from '@/constants/tracker-statuses';

// ─── Constantes ──────────────────────────────────────────────────────────────

import {
  STATUS_CONFIG,
  getStatusLabel,
  getStatusIcon,
} from '@/constants/tracker-statuses';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Modo de visualización del listado. */
type ViewMode = 'grid' | 'list';

/** Props del listado del tracker público. */
interface Props {
  userId:  string | null;
  privacy: PublicPrivacyFlags;
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/**
 * Vista en cuadrícula con portadas y badges de estado/puntuación.
 * @param items      - Entradas filtradas del tracker público.
 * @param showStatus - Si mostrar el badge de estado sobre la portada.
 */
function GridView({ items, showStatus }: { items: PublicEntry[]; showStatus: boolean }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {items.map(item => {
        const status = item.status as CategoryStatus | null;
        const cfg    = status && STATUS_CONFIG[status] ? STATUS_CONFIG[status] : null;
        const icon   = status ? getStatusIcon(status, item.category) : null;
        const title  = item.title || item.item_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        return (
          <Link key={item.id} to={`/catalog/${item.category}/${item.item_slug}`} className="group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3] flex items-center justify-center" style={{ background: `${item.categoryAccent}15` }}>
              {item.cover ? (
                <img src={item.cover} alt={title} className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex flex-col items-center gap-1 p-2">
                  <i className={`${item.categoryIcon} text-3xl`} style={{ color: item.categoryAccent }} />
                </div>
              )}
              {showStatus && cfg && icon && (
                <div
                  className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md backdrop-blur-sm"
                  style={{ background: cfg.bg }}
                >
                  <i className={`${icon} text-xs`} style={{ color: cfg.color }} />
                </div>
              )}
              {item.rating !== null && (
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
                  <i className="ri-star-fill text-amber-400 text-xs" />
                  <span className="text-white text-xs font-bold">{item.rating}</span>
                </div>
              )}
            </div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-tight">{title}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{item.categoryLabel}</p>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Vista en lista horizontal con portada, título, estado y puntuación.
 * @param items      - Entradas filtradas del tracker público.
 * @param showStatus - Si mostrar el badge de estado al final de la fila.
 */
function ListView({ items, showStatus }: { items: PublicEntry[]; showStatus: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => {
        const status = item.status as CategoryStatus | null;
        const cfg    = status && STATUS_CONFIG[status] ? STATUS_CONFIG[status] : null;
        const icon   = status ? getStatusIcon(status, item.category) : null;
        const label  = status ? getStatusLabel(status, item.category) : null;
        const title  = item.title || item.item_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        return (
          <Link
            key={item.id}
            to={`/catalog/${item.category}/${item.item_slug}`}
            className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all cursor-pointer"
          >
            <span className="text-sm font-black text-zinc-300 dark:text-zinc-700 w-5 text-center flex-shrink-0">{idx + 1}</span>
            {item.cover ? (
              <img src={item.cover} alt={title} className="w-10 h-14 rounded-lg object-cover object-top flex-shrink-0" />
            ) : (
              <div className="w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.categoryAccent}15` }}>
                <i className={`${item.categoryIcon} text-xl`} style={{ color: item.categoryAccent }} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand-dark transition-colors line-clamp-1">{title}</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block" style={{ background: `${item.categoryAccent}15`, color: item.categoryAccent }}>
                {item.categoryLabel}
              </span>
            </div>
            {showStatus && cfg && icon && label ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                <i className={icon} />
                {label}
              </div>
            ) : <div className="hidden sm:block w-24 flex-shrink-0" />}
            {item.rating !== null ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <i className="ri-star-fill text-amber-400 text-sm" />
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.rating}</span>
                <span className="text-xs text-zinc-400">/10</span>
              </div>
            ) : <div className="w-12 flex-shrink-0" />}
            <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 flex-shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function PublicTrackerList({ userId, privacy }: Props) {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const CATEGORIES = useCategories();
  const { entries, loading, hidden } = usePublicTracker(userId, privacy);
  const showStatus = privacy.show_item_status !== false;

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus,   setActiveStatus]   = useState('all');
  const [viewMode,       setViewMode]        = useState<ViewMode>('grid');
  const [search,         setSearch]          = useState('');

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const categoryFilters = useMemo(() => {
    const cats = [...new Set(entries.map(e => e.category))];
    const all  = [{ id: 'all', label: 'Todo', icon: 'ri-apps-line', accent: '#71717a' }];
    const rest = cats.map(catId => {
      const meta = CATEGORIES.find(c => c.id === catId);
      return { id: catId, label: meta?.label ?? catId, icon: meta?.icon ?? 'ri-stack-line', accent: meta?.accent ?? '#6b7280' };
    });
    return [...all, ...rest];
  }, [entries, CATEGORIES]);

  const statusFilters = useMemo(() => {
    if (!showStatus) return [];
    const CANONICAL: CategoryStatus[] = [
      'wishlist', 'pending',
      'playing', 'watching', 'reading',
      'played', 'watched', 'read', 'attended',
      'completed', 'platinum',
      'waiting_season', 'waiting_episode',
      'abandoned', 'missed',
    ];
    const present = new Set(
      entries
        .filter(e => activeCategory === 'all' || e.category === activeCategory)
        .map(e => e.status)
        .filter(Boolean) as string[],
    );
    return [
      { id: 'all', label: 'Todos' },
      ...CANONICAL
        .filter(s => present.has(s))
        .map(s => ({ id: s, label: getStatusLabel(s) })),
    ];
  }, [entries, activeCategory, showStatus]);

  const filtered = useMemo(() => entries.filter(e => {
    const matchCat    = activeCategory === 'all' || e.category === activeCategory;
    const matchStatus = !showStatus || activeStatus === 'all' || e.status === activeStatus;
    const title       = e.title || e.item_slug.replace(/-/g, ' ');
    const matchSearch = search.trim() === '' || title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  }), [entries, activeCategory, activeStatus, search, showStatus]);

  const grouped = useMemo(() =>
    filtered.reduce<Record<string, PublicEntry[]>>((acc, e) => {
      const key = e.categoryLabel;
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    }, {}),
    [filtered],
  );

  // ─── Renderizado ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[2/3] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (hidden) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
          <i className="ri-lock-line text-2xl text-zinc-400" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Tracker privado</h3>
        <p className="text-sm text-zinc-500">Este usuario ha ocultado su lista de seguimiento.</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
          <i className="ri-stack-line text-2xl text-zinc-400" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Tracker vacío</h3>
        <p className="text-sm text-zinc-500">Este usuario aún no ha añadido ítems a su tracker.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pills de categoría */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {categoryFilters.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setActiveStatus('all'); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat.id ? 'text-white' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
            style={activeCategory === cat.id ? { background: cat.accent } : {}}
          >
            <i className={`${cat.icon} text-sm`} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Barra de búsqueda, estado y vista */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar en la lista..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
          />
        </div>
        {showStatus && statusFilters.length > 1 && (
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 overflow-x-auto">
            {statusFilters.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveStatus(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeStatus === s.id
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 ml-auto">
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                viewMode === v ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <i className={v === 'grid' ? 'ri-grid-line text-sm' : 'ri-list-check text-sm'} />
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-400 mb-5">
        {filtered.length} {filtered.length === 1 ? 'ítem' : 'ítems'}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <i className="ri-search-line text-3xl text-zinc-300 dark:text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-500">Sin resultados. Prueba con otros filtros.</p>
        </div>
      ) : activeCategory === 'all' ? (
        /* Vista agrupada por categoría cuando se muestra todo */
        <div className="flex flex-col gap-10">
          {Object.entries(grouped).map(([catLabel, items]) => (
            <div key={catLabel}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${items[0]?.categoryAccent}20` }}>
                  <i className={`${items[0]?.categoryIcon} text-sm`} style={{ color: items[0]?.categoryAccent }} />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{catLabel}</h3>
                <span className="text-xs text-zinc-400 ml-1">({items.length})</span>
              </div>
              {viewMode === 'grid' ? <GridView items={items} showStatus={showStatus} /> : <ListView items={items} showStatus={showStatus} />}
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <GridView items={filtered} showStatus={showStatus} />
      ) : (
        <ListView items={filtered} showStatus={showStatus} />
      )}
    </div>
  );
}
