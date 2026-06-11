import { useCategories } from '@/hooks/useCategoryColors';
import { TrackerEntry, TrackerStatus } from '@/hooks/useTracker';

type SortOption = 'updated' | 'added' | 'rating' | 'title';

interface Props {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  activeStatus: TrackerStatus | 'all';
  onStatusChange: (s: TrackerStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  entries: Record<string, TrackerEntry>;
  activeCategories: string[];
  counts: Record<string, number>;
}

const STATUS_OPTIONS: { value: TrackerStatus | 'all'; label: string; activeClass: string }[] = [
  { value: 'all',         label: 'Todos',       activeClass: 'bg-[var(--brand-accent)] text-white' },
  { value: 'completed',   label: 'Completado',  activeClass: 'bg-emerald-500 text-white' },
  { value: 'in_progress', label: 'En progreso', activeClass: 'bg-orange-500 text-white' },
  { value: 'pending',     label: 'Pendiente',   activeClass: 'bg-slate-500 text-white' },
  { value: 'dropped',     label: 'Abandonado',  activeClass: 'bg-red-500 text-white' },
];

export default function TrackerFilters({
  activeCategory,
  onCategoryChange,
  activeStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  activeCategories,
  counts,
}: Props) {
  const CATEGORIES = useCategories();
  const visibleCats = CATEGORIES.filter(c => activeCategories.includes(c.id));

  return (
    <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-col gap-4">

        {/* Row 1: Search + Sort */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Buscar en tu colección..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--brand-accent)] focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as SortOption)}
            className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus:border-[var(--brand-accent)] focus:outline-none"
          >
            <option value="updated">Última actualización</option>
            <option value="added">Fecha añadido</option>
            <option value="rating">Puntuación</option>
            <option value="title">Título A–Z</option>
          </select>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border)]" />

        {/* Row 2: Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Categoría
          </span>
          <button
            onClick={() => onCategoryChange('all')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[var(--brand-accent)] text-white'
                : 'border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="ri-apps-line text-xs" />
            Todos
          </button>
          {visibleCats.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}
                style={isActive ? { background: cat.accent } : {}}
              >
                <i className={`${cat.icon} text-xs`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Row 3: Status */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Estado
          </span>
          {STATUS_OPTIONS.map(opt => {
            const isActive = activeStatus === opt.value;
            const count = counts[opt.value] ?? 0;
            return (
              <button
                key={opt.value}
                onClick={() => onStatusChange(opt.value)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? opt.activeClass
                    : 'border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}
              >
                {opt.label}
                <span className={`${isActive ? 'opacity-75' : 'text-[var(--text-tertiary)]'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
