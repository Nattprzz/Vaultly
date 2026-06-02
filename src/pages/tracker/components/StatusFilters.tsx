import { TrackerStatus } from '@/hooks/useTracker';

type SortOption = 'updated' | 'added' | 'rating' | 'title';
type ViewMode = 'grid' | 'list';

interface Props {
  activeStatus: TrackerStatus | 'all';
  onStatusChange: (s: TrackerStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  counts: Record<string, number>;
}

const STATUS_OPTIONS: { value: TrackerStatus | 'all'; label: string; icon: string }[] = [
  { value: 'all',         label: 'Todos',       icon: 'ri-list-check' },
  { value: 'in_progress', label: 'En progreso', icon: 'ri-loader-4-line' },
  { value: 'pending',     label: 'Pendientes',  icon: 'ri-bookmark-line' },
  { value: 'completed',   label: 'Completados', icon: 'ri-checkbox-circle-line' },
  { value: 'dropped',     label: 'Abandonados', icon: 'ri-close-circle-line' },
];

const STATUS_ACTIVE_STYLES: Record<string, string> = {
  all:         'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900',
  in_progress: 'bg-amber-500 text-white',
  pending:     'bg-zinc-500 text-white',
  completed:   'bg-emerald-500 text-white',
  dropped:     'bg-rose-500 text-white',
};

export default function StatusFilters({
  activeStatus, onStatusChange,
  sortBy, onSortChange,
  viewMode, onViewModeChange,
  counts,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Status pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_OPTIONS.map(opt => {
          const isActive = activeStatus === opt.value;
          const count = counts[opt.value] ?? 0;
          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? STATUS_ACTIVE_STYLES[opt.value]
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <i className={opt.icon}></i>
              {opt.label}
              <span className={`${isActive ? 'opacity-70' : 'text-zinc-400'}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Sort + view mode */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value as SortOption)}
          className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="updated">Última actualización</option>
          <option value="added">Fecha añadido</option>
          <option value="rating">Puntuación</option>
          <option value="title">Título A-Z</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            <i className="ri-grid-line text-sm"></i>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            <i className="ri-list-unordered text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
