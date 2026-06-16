/**
 * StatusFilters.tsx — barra de filtro por estado, orden y modo de vista del tracker.
 *
 * Combina tres controles en una misma fila: chips de estado para filtrar
 * rápidamente por grupo semántico (todos/en progreso/pendientes/completados/
 * abandonados), un selector de ordenación y un toggle de vista grid/lista.
 * Los chips muestran el conteo de ítems en cada estado.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { TrackerStatus } from '@/hooks/useTracker';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Opciones de ordenación disponibles. */
type SortOption = 'updated' | 'added' | 'rating' | 'title';

/** Modos de visualización del tracker. */
type ViewMode = 'grid' | 'list';

/** Props de la barra de filtros de estado. */
interface Props {
  activeStatus: TrackerStatus | 'all';
  onStatusChange: (s: TrackerStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  /** Mapa de estado → cantidad para los contadores de los chips. */
  counts: Record<string, number>;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Opciones de filtro de estado con sus etiquetas e iconos. */
const STATUS_OPTIONS: { value: TrackerStatus | 'all'; label: string; icon: string }[] = [
  { value: 'all',         label: 'Todos',       icon: 'ri-list-check' },
  { value: 'playing',     label: 'En progreso', icon: 'ri-loader-4-line' },
  { value: 'pending',     label: 'Pendientes',  icon: 'ri-bookmark-line' },
  { value: 'completed',   label: 'Completados', icon: 'ri-checkbox-circle-line' },
  { value: 'abandoned',   label: 'Abandonados', icon: 'ri-close-circle-line' },
];

/** Clases Tailwind para el chip activo de cada estado. */
const STATUS_ACTIVE_STYLES: Record<string, string> = {
  all:       'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900',
  playing:   'bg-amber-500 text-white',
  pending:   'bg-zinc-500 text-white',
  completed: 'bg-emerald-500 text-white',
  abandoned: 'bg-red-500 text-white',
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function StatusFilters({
  activeStatus, onStatusChange,
  sortBy, onSortChange,
  viewMode, onViewModeChange,
  counts,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Chips de estado */}
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

      {/* Selector de orden y toggle de vista */}
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

        {/* Toggle grid / lista */}
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
