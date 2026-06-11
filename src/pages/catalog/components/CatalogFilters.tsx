import { useState, useEffect } from 'react';
import type { FilterState, SortOption } from '@/hooks/useCatalogFilters';
import { DEFAULT_FILTERS } from '@/hooks/useCatalogFilters';

const CURRENT_YEAR = new Date().getFullYear();

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance',   label: 'Relevancia' },
  { value: 'rating_desc', label: 'Mejor valorados' },
  { value: 'year_desc',   label: 'Más recientes' },
  { value: 'year_asc',    label: 'Más antiguos' },
  { value: 'title_asc',   label: 'A → Z' },
];

const RATING_CHIPS = [
  { value: 0, label: 'Cualquiera' },
  { value: 6, label: '6+' },
  { value: 7, label: '7+' },
  { value: 8, label: '8+' },
  { value: 9, label: '9+' },
];

const DURATION_CHIPS: { value: FilterState['duration']; label: string }[] = [
  { value: 'all',    label: 'Todas' },
  { value: 'short',  label: '< 90 min' },
  { value: 'medium', label: '90–139 min' },
  { value: 'long',   label: '140+ min' },
];

const PAGE_CHIPS: { value: FilterState['pageCount']; label: string }[] = [
  { value: 'all',    label: 'Todas' },
  { value: 'short',  label: '< 250 pág.' },
  { value: 'medium', label: '250–499 pág.' },
  { value: 'long',   label: '500+ pág.' },
];

const VISIBLE_LIMIT = 8;

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

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function Label({ text }: { text: string }) {
  return <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{text}</p>;
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
  const [genreSearch, setGenreSearch]         = useState('');
  const [genresExpanded, setGenresExpanded]   = useState(false);
  const [platformSearch, setPlatformSearch]   = useState('');
  const [platformsExpanded, setPlatformsExpanded] = useState(false);

  // Local year state so user can type freely; syncs to filter on blur/reset
  const [localYearMin, setLocalYearMin] = useState(String(filters.yearMin));
  const [localYearMax, setLocalYearMax] = useState(String(filters.yearMax));
  useEffect(() => { setLocalYearMin(String(filters.yearMin)); }, [filters.yearMin]);
  useEffect(() => { setLocalYearMax(String(filters.yearMax)); }, [filters.yearMax]);

  // Esc to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const filteredGenres  = availableGenres.filter(g => !genreSearch || g.toLowerCase().includes(genreSearch.toLowerCase()));
  const visibleGenres   = genresExpanded ? filteredGenres : filteredGenres.slice(0, VISIBLE_LIMIT);
  const moreGenres      = filteredGenres.length - VISIBLE_LIMIT;

  const filteredPlatforms = availablePlatforms.filter(p => !platformSearch || p.toLowerCase().includes(platformSearch.toLowerCase()));
  const visiblePlatforms  = platformsExpanded ? filteredPlatforms : filteredPlatforms.slice(0, VISIBLE_LIMIT);
  const morePlatforms     = filteredPlatforms.length - VISIBLE_LIMIT;

  const yearIsDefault = filters.yearMin === DEFAULT_FILTERS.yearMin && filters.yearMax === DEFAULT_FILTERS.yearMax;

  const commitYearMin = (raw: string) => {
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v >= 1970 && v < filters.yearMax) { onYearMin(v); }
    else { setLocalYearMin(String(filters.yearMin)); }
  };
  const commitYearMax = (raw: string) => {
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v > filters.yearMin && v <= CURRENT_YEAR) { onYearMax(v); }
    else { setLocalYearMax(String(filters.yearMax)); }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — bottom sheet on mobile, right drawer on sm+ */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl bg-zinc-950 border-t border-zinc-800 shadow-2xl sm:inset-y-0 sm:bottom-auto sm:right-0 sm:left-auto sm:w-[420px] sm:max-h-full sm:rounded-none sm:border-t-0 sm:border-l">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-white">Filtros</span>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold leading-none">
                {activeCount} activos
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar filtros"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">

          {/* Ordenar por */}
          <section>
            <Label text="Ordenar por" />
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(opt => (
                <Chip key={opt.value} active={filters.sort === opt.value} onClick={() => onSort(opt.value)}>
                  {opt.label}
                </Chip>
              ))}
            </div>
          </section>

          {/* Puntuación mínima */}
          <section>
            <Label text="Puntuación mínima" />
            <div className="flex gap-2">
              {RATING_CHIPS.map(chip => (
                <Chip key={chip.value} active={filters.minRating === chip.value} onClick={() => onMinRating(chip.value)}>
                  {chip.label}
                </Chip>
              ))}
            </div>
          </section>

          {/* Año */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Año</p>
              {!yearIsDefault && (
                <button
                  onClick={() => { onYearMin(DEFAULT_FILTERS.yearMin); onYearMax(DEFAULT_FILTERS.yearMax); }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Resetear
                </button>
              )}
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <p className="text-xs text-zinc-500 mb-1.5">Desde</p>
                <input
                  type="number"
                  value={localYearMin}
                  min={1970}
                  max={CURRENT_YEAR}
                  onChange={e => setLocalYearMin(e.target.value)}
                  onBlur={e => commitYearMin(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && commitYearMin(localYearMin)}
                  className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm text-center focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
              <span className="text-zinc-600 pb-3 text-sm">–</span>
              <div className="flex-1">
                <p className="text-xs text-zinc-500 mb-1.5">Hasta</p>
                <input
                  type="number"
                  value={localYearMax}
                  min={1970}
                  max={CURRENT_YEAR}
                  onChange={e => setLocalYearMax(e.target.value)}
                  onBlur={e => commitYearMax(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && commitYearMax(localYearMax)}
                  className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm text-center focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Géneros */}
          {availableGenres.length > 0 && (
            <section>
              <Label text="Géneros" />
              {availableGenres.length > 4 && (
                <div className="relative mb-3">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none"></i>
                  <input
                    value={genreSearch}
                    onChange={e => setGenreSearch(e.target.value)}
                    placeholder="Buscar género..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              )}
              {visibleGenres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visibleGenres.map(g => (
                    <Chip key={g} active={filters.genres.includes(g)} onClick={() => onToggleGenre(g)}>
                      {g}
                    </Chip>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-600">Sin géneros para "{genreSearch}"</p>
              )}
              {!genresExpanded && moreGenres > 0 && (
                <button onClick={() => setGenresExpanded(true)} className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  Ver más ({moreGenres} más)
                </button>
              )}
              {genresExpanded && filteredGenres.length > VISIBLE_LIMIT && (
                <button onClick={() => setGenresExpanded(false)} className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  Ver menos
                </button>
              )}
            </section>
          )}

          {/* Videojuegos: Plataformas */}
          {activeCategory === 'videojuegos' && availablePlatforms.length > 0 && (
            <section>
              <Label text="Plataformas" />
              {availablePlatforms.length > 4 && (
                <div className="relative mb-3">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none"></i>
                  <input
                    value={platformSearch}
                    onChange={e => setPlatformSearch(e.target.value)}
                    placeholder="Buscar plataforma..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {visiblePlatforms.map(p => (
                  <Chip key={p} active={filters.platforms.includes(p)} onClick={() => onTogglePlatform(p)}>
                    {p}
                  </Chip>
                ))}
              </div>
              {!platformsExpanded && morePlatforms > 0 && (
                <button onClick={() => setPlatformsExpanded(true)} className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  Ver más ({morePlatforms} más)
                </button>
              )}
            </section>
          )}

          {/* Películas: Duración + Idioma */}
          {activeCategory === 'peliculas' && (
            <>
              <section>
                <Label text="Duración" />
                <div className="flex flex-wrap gap-2">
                  {DURATION_CHIPS.map(c => (
                    <Chip key={c.value} active={filters.duration === c.value} onClick={() => onDuration(c.value)}>
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </section>
              {availableLanguages.length > 0 && (
                <section>
                  <Label text="Idioma original" />
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map(l => (
                      <Chip key={l} active={filters.languages.includes(l)} onClick={() => onToggleLanguage(l)}>
                        {l.toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Series: Estado + Idioma */}
          {activeCategory === 'series' && (
            <>
              {availableSeriesStatuses.length > 0 && (
                <section>
                  <Label text="Estado" />
                  <div className="flex flex-wrap gap-2">
                    <Chip active={filters.seriesStatus === 'all'} onClick={() => onSeriesStatus('all')}>
                      Todos
                    </Chip>
                    {availableSeriesStatuses.map(s => (
                      <Chip key={s} active={filters.seriesStatus === s} onClick={() => onSeriesStatus(s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                </section>
              )}
              {availableLanguages.length > 0 && (
                <section>
                  <Label text="Idioma original" />
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map(l => (
                      <Chip key={l} active={filters.languages.includes(l)} onClick={() => onToggleLanguage(l)}>
                        {l.toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Libros: Extensión + Idioma */}
          {activeCategory === 'libros' && (
            <>
              <section>
                <Label text="Extensión" />
                <div className="flex flex-wrap gap-2">
                  {PAGE_CHIPS.map(c => (
                    <Chip key={c.value} active={filters.pageCount === c.value} onClick={() => onPageCount(c.value)}>
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </section>
              {availableLanguages.length > 0 && (
                <section>
                  <Label text="Idioma" />
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map(l => (
                      <Chip key={l} active={filters.languages.includes(l)} onClick={() => onToggleLanguage(l)}>
                        {l.toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Conciertos: Ciudad */}
          {activeCategory === 'conciertos' && availableCities.length > 0 && (
            <section>
              <Label text="Ciudad" />
              <div className="flex flex-wrap gap-2">
                {availableCities.map(c => (
                  <Chip key={c} active={filters.cities.includes(c)} onClick={() => onToggleCity(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={onReset}
            disabled={activeCount === 0}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            Limpiar filtros
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  );
}
