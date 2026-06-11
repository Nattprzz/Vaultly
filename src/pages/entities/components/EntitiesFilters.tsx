export type EntityTypeFilter = 'all' | 'actor' | 'actriz' | 'director' | 'autor' | 'desarrollador' | 'publisher' | 'artista';
export type EntitySortOption = 'works_desc' | 'works_asc' | 'rating_desc' | 'name_asc' | 'name_desc';

interface TypeTab {
  id: EntityTypeFilter;
  label: string;
  icon: string;
  color: string;
}

const TYPE_TABS: TypeTab[] = [
  { id: 'all', label: 'Todos', icon: 'ri-apps-line', color: 'text-zinc-500' },
  { id: 'actor', label: 'Actores', icon: 'ri-user-smile-line', color: 'text-amber-500' },
  { id: 'actriz', label: 'Actrices', icon: 'ri-user-heart-line', color: 'text-teal-500' },
  { id: 'director', label: 'Directores', icon: 'ri-movie-2-line', color: 'text-orange-500' },
  { id: 'autor', label: 'Autores', icon: 'ri-quill-pen-line', color: 'text-emerald-500' },
  { id: 'desarrollador', label: 'Estudios', icon: 'ri-gamepad-line', color: 'text-cyan-500' },
  { id: 'publisher', label: 'Publishers', icon: 'ri-building-2-line', color: 'text-slate-500' },
  { id: 'artista', label: 'Artistas', icon: 'ri-music-2-line', color: 'text-sky-500' },
];

const SORT_OPTIONS: { value: EntitySortOption; label: string }[] = [
  { value: 'works_desc', label: 'Más obras' },
  { value: 'works_asc', label: 'Menos obras' },
  { value: 'rating_desc', label: 'Mejor valorado' },
  { value: 'name_asc', label: 'A → Z' },
  { value: 'name_desc', label: 'Z → A' },
];

interface Props {
  activeType: EntityTypeFilter;
  onTypeChange: (t: EntityTypeFilter) => void;
  sortBy: EntitySortOption;
  onSortChange: (s: EntitySortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (v: 'grid' | 'list') => void;
  resultCount: number;
}

export default function EntitiesFilters({
  activeType,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: Props) {
  return (
    <div className="sticky top-16 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Type tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {TYPE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                activeType === tab.id
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <i className={`${tab.icon} text-sm ${activeType === tab.id ? '' : tab.color}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort + view mode row */}
        <div className="flex items-center justify-between pb-3 gap-4">
          <p className="text-xs text-zinc-400 flex-shrink-0">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">{resultCount}</span> entidades
          </p>

          <div className="flex items-center gap-3">
            {/* Sort select */}
            <div className="flex items-center gap-2">
              <i className="ri-sort-desc text-zinc-400 text-sm"></i>
              <select
                value={sortBy}
                onChange={e => onSortChange(e.target.value as EntitySortOption)}
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <i className="ri-grid-line text-sm"></i>
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <i className="ri-list-check text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
