import { useEffect, useRef } from 'react';
import type { FilterState, SortOption } from '@/hooks/useCatalogFilters';
import { DEFAULT_FILTERS } from '@/hooks/useCatalogFilters';

const CURRENT_YEAR = new Date().getFullYear();

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'rating_desc', label: 'Mejor valorados' },
  { value: 'rating_asc', label: 'Peor valorados' },
  { value: 'year_desc', label: 'Más recientes' },
  { value: 'year_asc', label: 'Más antiguos' },
  { value: 'title_asc', label: 'A-Z' },
];

const RATING_OPTIONS = [0, 6, 7, 8, 9];

const YEAR_PRESETS = [
  { label: 'Todo', min: DEFAULT_FILTERS.yearMin, max: DEFAULT_FILTERS.yearMax },
  { label: '2020s', min: 2020, max: CURRENT_YEAR },
  { label: '2010s', min: 2010, max: 2019 },
  { label: '2000s', min: 2000, max: 2009 },
  { label: 'Clásicos', min: 1970, max: 1999 },
];

const DURATION_OPTIONS: { value: FilterState['duration']; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'short', label: '< 90 min' },
  { value: 'medium', label: '90-139 min' },
  { value: 'long', label: '140+ min' },
];

const PAGE_OPTIONS: { value: FilterState['pageCount']; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'short', label: '< 250' },
  { value: 'medium', label: '250-499' },
  { value: 'long', label: '500+' },
];

interface Props {
  filters: FilterState;
  availableGenres: string[];
  availablePlatforms: string[];
  availableLanguages: string[];
  availableCities: string[];
  availableSeriesStatuses: string[];
  activeCategory: string;
  activeCount: number;
  onYearMin: (v: number) => void;
  onYearMax: (v: number) => void;
  onMinRating: (v: number) => void;
  onSort: (v: SortOption) => void;
  onDuration: (v: FilterState['duration']) => void;
  onPageCount: (v: FilterState['pageCount']) => void;
  onSeriesStatus: (v: string) => void;
  onToggleGenre: (g: string) => void;
  onTogglePlatform: (v: string) => void;
  onToggleLanguage: (v: string) => void;
  onToggleCity: (v: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function CatalogFilters({
  filters,
  availableGenres,
  availablePlatforms,
  availableLanguages,
  availableCities,
  availableSeriesStatuses,
  activeCategory,
  activeCount,
  onYearMin,
  onYearMax,
  onMinRating,
  onSort,
  onDuration,
  onPageCount,
  onSeriesStatus,
  onToggleGenre,
  onTogglePlatform,
  onToggleLanguage,
  onToggleCity,
  onReset,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activeYearPreset = YEAR_PRESETS.find(
    preset => filters.yearMin === preset.min && filters.yearMax === preset.max,
  )?.label ?? 'custom';

  const setYearPreset = (label: string) => {
    const preset = YEAR_PRESETS.find(item => item.label === label);
    if (!preset) return;
    onYearMin(preset.min);
    onYearMax(preset.max);
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-40 mt-2 w-[min(92vw,980px)] overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Filtros</p>
          <p className="text-xs text-zinc-400">{activeCount > 0 ? `${activeCount} activos` : 'Sin filtros activos'}</p>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={onReset} className="text-xs font-medium text-zinc-400 hover:text-rose-500">
              Limpiar
            </button>
          )}
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>

      <div className="grid max-h-[68vh] grid-cols-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <SelectSection label="Orden" value={filters.sort} onChange={value => onSort(value as SortOption)} options={SORT_OPTIONS} />

          <section className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Puntuación</label>
            <div className="grid grid-cols-5 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              {RATING_OPTIONS.map(rating => (
                <button
                  key={rating}
                  onClick={() => onMinRating(rating)}
                  className={`rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                    filters.minRating === rating
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {rating === 0 ? 'Todo' : `${rating}+`}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <SelectSection
            label="Año"
            value={activeYearPreset}
            onChange={setYearPreset}
            options={[
              ...YEAR_PRESETS.map(preset => ({ value: preset.label, label: preset.label })),
              { value: 'custom', label: `${filters.yearMin}-${filters.yearMax}`, disabled: true },
            ]}
          />
          <div className="space-y-2">
            <RangeRow label="Desde" value={filters.yearMin} min={1970} max={CURRENT_YEAR} onChange={value => onYearMin(Math.min(value, filters.yearMax - 1))} />
            <RangeRow label="Hasta" value={filters.yearMax} min={1970} max={CURRENT_YEAR} onChange={value => onYearMax(Math.max(value, filters.yearMin + 1))} />
          </div>
        </div>

        <ChecklistSection
          label="Géneros"
          values={availableGenres}
          selected={filters.genres}
          onToggle={onToggleGenre}
        />

        <div className="space-y-4">
          {activeCategory === 'videojuegos' && (
            <ChecklistSection
              label="Plataformas"
              values={availablePlatforms}
              selected={filters.platforms}
              onToggle={onTogglePlatform}
            />
          )}

          {activeCategory === 'peliculas' && (
            <>
              <SelectSection label="Duración" value={filters.duration} onChange={value => onDuration(value as FilterState['duration'])} options={DURATION_OPTIONS} />
              <ChecklistSection label="Idioma original" values={availableLanguages} selected={filters.languages} onToggle={onToggleLanguage} />
            </>
          )}

          {activeCategory === 'series' && (
            <>
              <SelectSection
                label="Estado"
                value={filters.seriesStatus}
                onChange={onSeriesStatus}
                options={[
                  { value: 'all', label: 'Todos' },
                  ...availableSeriesStatuses.map(status => ({ value: status, label: status })),
                ]}
              />
              <ChecklistSection label="Idioma original" values={availableLanguages} selected={filters.languages} onToggle={onToggleLanguage} />
            </>
          )}

          {activeCategory === 'libros' && (
            <>
              <SelectSection label="Páginas" value={filters.pageCount} onChange={value => onPageCount(value as FilterState['pageCount'])} options={PAGE_OPTIONS} />
              <ChecklistSection label="Idioma" values={availableLanguages} selected={filters.languages} onToggle={onToggleLanguage} />
            </>
          )}

          {activeCategory === 'conciertos' && (
            <ChecklistSection label="Ciudad" values={availableCities} selected={filters.cities} onToggle={onToggleCity} />
          )}

          {activeCategory === 'all' && (
            <p className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-800/70 dark:text-zinc-400">
              Elige una categoría para ver filtros específicos como plataforma, duración, idioma o ciudad.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-zinc-100 p-3 dark:border-zinc-800">
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Limpiar
          </button>
        )}
        <button
          onClick={onClose}
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

function SelectSection({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (value: string) => void;
}) {
  return (
    <section className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</label>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
        ))}
      </select>
    </section>
  );
}

function RangeRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-xs text-zinc-400">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        className="h-1.5 flex-1 accent-zinc-900 dark:accent-white"
      />
      <span className="w-9 text-right text-xs font-semibold text-zinc-500">{value}</span>
    </div>
  );
}

function ChecklistSection({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (values.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</label>
        {selected.length > 0 && (
          <button
            onClick={() => selected.forEach(item => onToggle(item))}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Quitar
          </button>
        )}
      </div>
      <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
        {values.map(value => {
          const active = selected.includes(value);
          return (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(value)}
                className="h-4 w-4 rounded border-zinc-300 accent-zinc-900 dark:border-zinc-600 dark:accent-white"
              />
              <span className="truncate">{value}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
