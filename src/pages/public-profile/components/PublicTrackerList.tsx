import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePublicTracker, PublicEntry } from '@/hooks/usePublicTracker';
import { CATEGORIES } from '@/mocks/catalog';

interface Props {
  userId: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  completed:   { label: 'Completado',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: 'ri-checkbox-circle-line' },
  in_progress: { label: 'En progreso', color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-950/30',     icon: 'ri-loader-4-line' },
  pending:     { label: 'Pendiente',   color: 'text-zinc-500 dark:text-zinc-400',        bg: 'bg-zinc-100 dark:bg-zinc-800',          icon: 'ri-bookmark-line' },
  dropped:     { label: 'Abandonado',  color: 'text-rose-600 dark:text-rose-400',        bg: 'bg-rose-50 dark:bg-rose-950/30',        icon: 'ri-close-circle-line' },
};

const STATUS_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'completed', label: 'Completados' },
  { id: 'in_progress', label: 'En progreso' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'dropped', label: 'Abandonados' },
];

type ViewMode = 'grid' | 'list';

export default function PublicTrackerList({ userId }: Props) {
  const { entries, loading } = usePublicTracker(userId);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');

  // Build category filters from actual data
  const categoryFilters = useMemo(() => {
    const cats = [...new Set(entries.map(e => e.category))];
    const all = [{ id: 'all', label: 'Todo', icon: 'ri-apps-line', accent: '#71717a' }];
    const rest = cats.map(catId => {
      const meta = CATEGORIES.find(c => c.id === catId);
      return { id: catId, label: meta?.label ?? catId, icon: meta?.icon ?? 'ri-stack-line', accent: meta?.accent ?? '#6b7280' };
    });
    return [...all, ...rest];
  }, [entries]);

  const filtered = useMemo(() => entries.filter(e => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory;
    const matchStatus = activeStatus === 'all' || e.status === activeStatus;
    const title = e.item_slug.replace(/-/g, ' ');
    const matchSearch = search.trim() === '' || title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  }), [entries, activeCategory, activeStatus, search]);

  const grouped = useMemo(() => filtered.reduce<Record<string, PublicEntry[]>>((acc, e) => {
    const key = e.categoryLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {}), [filtered]);

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[2/3] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
            <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
          <i className="ri-stack-line text-2xl text-zinc-400"></i>
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Tracker vacío</h3>
        <p className="text-sm text-zinc-500">Este usuario aún no ha añadido ítems a su tracker.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {categoryFilters.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat.id ? 'text-white' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
            style={activeCategory === cat.id ? { background: cat.accent } : {}}
          >
            <i className={`${cat.icon} text-sm`}></i>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
          <input
            type="text"
            placeholder="Buscar en la lista..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 overflow-x-auto">
          {STATUS_FILTERS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveStatus(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeStatus === s.id ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 ml-auto">
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                viewMode === v ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <i className={v === 'grid' ? 'ri-grid-line text-sm' : 'ri-list-check text-sm'}></i>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-400 mb-5">{filtered.length} {filtered.length === 1 ? 'ítem' : 'ítems'}</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <i className="ri-search-line text-3xl text-zinc-300 dark:text-zinc-600 mb-3"></i>
          <p className="text-sm text-zinc-500">Sin resultados. Prueba con otros filtros.</p>
        </div>
      ) : activeCategory === 'all' ? (
        <div className="flex flex-col gap-10">
          {Object.entries(grouped).map(([catLabel, items]) => (
            <div key={catLabel}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${items[0]?.categoryAccent}20` }}>
                  <i className={`${items[0]?.categoryIcon} text-sm`} style={{ color: items[0]?.categoryAccent }}></i>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{catLabel}</h3>
                <span className="text-xs text-zinc-400 ml-1">({items.length})</span>
              </div>
              {viewMode === 'grid' ? <GridView items={items} /> : <ListView items={items} />}
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <GridView items={filtered} />
      ) : (
        <ListView items={filtered} />
      )}
    </div>
  );
}

function GridView({ items }: { items: PublicEntry[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {items.map(item => {
        const sc = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['pending'];
        const title = item.item_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return (
          <Link key={item.id} to={`/catalog/${item.category}/${item.item_slug}`} className="group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3] flex items-center justify-center" style={{ background: `${item.categoryAccent}15` }}>
              <div className="flex flex-col items-center gap-1 p-2">
                <i className={`${item.categoryIcon} text-3xl`} style={{ color: item.categoryAccent }}></i>
              </div>
              <div className={`absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md backdrop-blur-sm ${sc.bg}`}>
                <i className={`${sc.icon} ${sc.color} text-xs`}></i>
              </div>
              {item.rating !== null && (
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
                  <i className="ri-star-fill text-amber-400 text-xs"></i>
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

function ListView({ items }: { items: PublicEntry[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => {
        const sc = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['pending'];
        const title = item.item_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return (
          <Link
            key={item.id}
            to={`/catalog/${item.category}/${item.item_slug}`}
            className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all cursor-pointer"
          >
            <span className="text-sm font-black text-zinc-300 dark:text-zinc-700 w-5 text-center flex-shrink-0">{idx + 1}</span>
            <div className="w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.categoryAccent}15` }}>
              <i className={`${item.categoryIcon} text-xl`} style={{ color: item.categoryAccent }}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1">{title}</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block" style={{ background: `${item.categoryAccent}15`, color: item.categoryAccent }}>
                {item.categoryLabel}
              </span>
            </div>
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${sc.bg} ${sc.color}`}>
              <i className={sc.icon}></i>
              {sc.label}
            </div>
            {item.rating !== null ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <i className="ri-star-fill text-amber-400 text-sm"></i>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.rating}</span>
                <span className="text-xs text-zinc-400">/10</span>
              </div>
            ) : <div className="w-12 flex-shrink-0"></div>}
            <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600 flex-shrink-0"></i>
          </Link>
        );
      })}
    </div>
  );
}
