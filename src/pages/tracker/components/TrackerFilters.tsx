import { useMemo } from 'react';
import { useCategories } from '@/hooks/useCategoryColors';
import type { TrackerEntry, TrackerStatus } from '@/hooks/useTracker';
import {
  getCategoryStatuses,
  STATUS_CONFIG,
  getStatusLabel,
} from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

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

export default function TrackerFilters({
  activeCategory,
  onCategoryChange,
  activeStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  entries,
  activeCategories,
  counts,
}: Props) {
  const CATEGORIES = useCategories();
  const visibleCats = CATEGORIES.filter(c => activeCategories.includes(c.id));

  // Status pills: valid statuses for the active category, or only those present in entries
  const statusOptions = useMemo<CategoryStatus[]>(() => {
    if (activeCategory !== 'all') {
      return getCategoryStatuses(activeCategory);
    }
    // For "all categories" view, show only statuses that actually appear in entries
    const present = new Set(Object.values(entries).map(e => e.status as CategoryStatus));
    // Preserve canonical order: iterate all possible statuses in order
    const allOrdered: CategoryStatus[] = [];
    for (const cat of Object.keys(getCategoryStatuses) as string[]) {
      // fallback: build unique ordered list from all categories
      void cat;
    }
    // simpler: just return present statuses sorted by canonical position
    const canonical = [
      'wishlist', 'pending', 'playing', 'watching', 'reading',
      'played', 'watched', 'read', 'attended',
      'completed', 'platinum',
      'waiting_season', 'waiting_episode',
      'abandoned', 'missed',
    ] as CategoryStatus[];
    return canonical.filter(s => present.has(s));
  }, [activeCategory, entries]);

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

        {/* Row 3: Status (dynamic per category) */}
        {statusOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Estado
            </span>

            {/* "Todos" pill */}
            <button
              onClick={() => onStatusChange('all')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                activeStatus === 'all'
                  ? 'bg-[var(--brand-accent)] text-white'
                  : 'border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }`}
            >
              Todos
              <span className={activeStatus === 'all' ? 'opacity-75' : 'text-[var(--text-tertiary)]'}>
                ({counts['all'] ?? 0})
              </span>
            </button>

            {statusOptions.map(s => {
              const cfg     = STATUS_CONFIG[s];
              const label   = getStatusLabel(s, activeCategory === 'all' ? undefined : activeCategory);
              const count   = counts[s] ?? 0;
              const isActive = activeStatus === s;

              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap border"
                  style={
                    isActive
                      ? { background: cfg.color, color: '#fff', borderColor: cfg.color }
                      : { borderColor: 'var(--border)', background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }
                  }
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? '#fff' : cfg.color }}
                  />
                  {label}
                  <span style={{ opacity: isActive ? 0.75 : 0.6 }}>({count})</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
