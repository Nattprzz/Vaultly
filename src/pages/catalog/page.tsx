/**
 * catalog/page.tsx — página de catálogo con búsqueda, filtros e infinite scroll.
 *
 * Soporta dos modos: idle (muestra los últimos 60 ítems de la BD) y búsqueda
 * activa (llama a la Edge Function via useCatalogSearch con debounce de 500ms
 * y pagina con IntersectionObserver). Los filtros (useCatalogFilters) se aplican
 * en cliente sobre el resultado activo. La categoría se sincroniza con la URL
 * (/catalog/:category) y valida que esté en la lista de categorías habilitadas.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link, useNavigate, useParams } from 'react-router-dom';

// ─── Componentes ──────────────────────────────────────────────────────────────

import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import CatalogFilters from './components/CatalogFilters';
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useCategories } from '@/hooks/useCategoryColors';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useCatalogSearch, type CatalogItem } from '@/hooks/useCatalogSearch';
import { useCatalogFilters, applyFilters, extractGenres, DEFAULT_FILTERS } from '@/hooks/useCatalogFilters';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { ALL_CATEGORY_ID, isAppCategory, toApiCategory } from '@/lib/categories';
import { getSiteUrl } from '@/lib/site';
import { supabase } from '@/lib/supabase';

// ─── Constantes ───────────────────────────────────────────────────────────────

const siteUrl = getSiteUrl();

/** Datos estructurados schema.org para la página de catálogo. */
const CATALOG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Catálogo - Vaultly',
  description: 'Explora el catálogo completo de Vaultly: videojuegos, películas, series, libros y conciertos.',
  url: `${siteUrl}/catalog`,
  isPartOf: { '@type': 'WebSite', name: 'Vaultly', url: siteUrl },
};

/** Configuración visual de cada fuente de resultado (caché, caché externa, API externa). */
const SOURCE_CONFIG: Record<string, { label: string; icon: string; cls: string }> = {
  cache:           { label: 'Desde caché',      icon: 'ri-database-2-line', cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  external_cached: { label: 'Guardado en caché', icon: 'ri-save-line',       cls: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' },
  external:        { label: 'API externa',       icon: 'ri-global-line',     cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
};

/** Etiquetas legibles para cada criterio de ordenación. */
const SORT_LABELS: Record<string, string> = {
  relevance: 'Relevancia', rating_desc: 'Mejor valorados', rating_asc: 'Peor valorados',
  year_desc: 'Más recientes', year_asc: 'Más antiguos', title_asc: 'A → Z',
};

/** Etiquetas de los chips de duración (películas). */
const DURATION_CHIP_LABELS: Record<'short' | 'medium' | 'long', string> = {
  short: '< 90 min',
  medium: '90-139 min',
  long: '140+ min',
};

/** Etiquetas de los chips de páginas (libros). */
const PAGE_CHIP_LABELS: Record<'short' | 'medium' | 'long', string> = {
  short: '< 250 páginas',
  medium: '250-499 páginas',
  long: '500+ páginas',
};

/** Meta-objeto de la categoría "Todo" para usar en los tabs y la cuadrícula. */
const ALL_CATEGORY = {
  id: 'all',
  label: 'Todo',
  icon: 'ri-apps-2-line',
  accent: '#52525b',
};

// ─── Utilidades ───────────────────────────────────────────────────────────────

const isValidCategory = (category?: string) => isAppCategory(category);

/** Extrae la puntuación numérica del campo metadata.rating. */
function getRating(item: CatalogItem): number | null {
  if (item.metadata?.rating != null) return Number(item.metadata.rating);
  return null;
}

/** Extrae el año de publicación de release_date (YYYY-MM-DD). */
function getYear(item: CatalogItem): string { return item.release_date?.slice(0, 4) ?? ''; }

/** Extrae el primer género del ítem, admitiendo tanto string como array. */
function getGenre(item: CatalogItem): string {
  const g = item.metadata?.genre ?? item.metadata?.genres;
  if (Array.isArray(g)) return g[0] ?? '';
  return String(g ?? '');
}

/**
 * Extrae valores únicos de una o varias claves de metadata de un conjunto de ítems.
 * Admite valores escalares y arrays. El resultado se ordena alfabéticamente en español.
 *
 * @param items - Array de ítems del catálogo.
 * @param keys - Clave o array de claves de metadata a extraer.
 * @returns Array de valores únicos ordenados.
 */
function extractStringOptions(items: CatalogItem[], keys: string | string[]): string[] {
  const keyList = Array.isArray(keys) ? keys : [keys];
  const values = new Set<string>();

  items.forEach(item => {
    keyList.forEach(key => {
      const value = item.metadata?.[key];
      if (Array.isArray(value)) {
        value.map(String).filter(Boolean).forEach(v => values.add(v));
      } else if (value) {
        values.add(String(value));
      }
    });
  });

  return Array.from(values).sort((a, b) => a.localeCompare(b, 'es'));
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/** Tarjeta de ítem de catálogo con imagen, rating, año y género. */
function ItemCard({ item, categoryId, catIcon }: { item: CatalogItem; categoryId: string; catIcon?: string }) {
  const rating = getRating(item);
  const year = getYear(item);
  const genre = getGenre(item);
  const targetCategory = categoryId === ALL_CATEGORY_ID ? String((item as CatalogItem & { category?: string }).category ?? '') : categoryId;
  const href = targetCategory ? `/catalog/${targetCategory}/${item.slug || item.id}` : '/catalog';

  return (
    <Link
      to={href}
      className="group cursor-pointer block transition-transform duration-300 ease-out hover:-translate-y-0.5"
    >
      <div className="relative rounded-xl overflow-hidden mb-3 aspect-[2/3] bg-zinc-100 dark:bg-zinc-800 transition-all duration-300 group-hover:ring-1 group-hover:ring-blue-500/25 group-hover:shadow-[0_6px_20px_rgba(59,130,246,0.12)]">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title}
            title={`${item.title}${genre ? ` — ${genre}` : ''}`}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className={`${catIcon ?? 'ri-image-line'} text-3xl text-zinc-300 dark:text-zinc-600`}></i>
          </div>
        )}
        {rating != null && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <i className="ri-star-fill text-amber-400 text-xs"></i>
            <span className="text-white text-xs font-semibold">{Number(rating).toFixed(1)}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight mb-1 line-clamp-2 transition-colors duration-200 group-hover:text-blue-500 dark:group-hover:text-blue-400">{item.title}</h3>
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs text-zinc-500 flex-shrink-0">{year}</span>
        {genre && <span className="text-xs text-zinc-400 truncate">{genre}</span>}
      </div>
    </Link>
  );
}

/** Cuadrícula de skeleton placeholders durante la carga. */
function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 aspect-[2/3] mb-3"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded mb-2"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CatalogPage() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const navigate = useNavigate();
  const { category: routeCategory } = useParams<{ category?: string }>();
  const { isLoggedIn } = useAuth();
  const { settings } = useSettings();
  const CATEGORIES = useCategories();
  const [activeCategory, setActiveCategory] = useState(isValidCategory(routeCategory) ? routeCategory : ALL_CATEGORY_ID);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cachedItems, setCachedItems] = useState<CatalogItem[]>([]);
  const [cachedLoading, setCachedLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const prevRouteCategoryRef = useRef(routeCategory);

  const { results, loading, loadingMore, error, source, page, hasMore, search: runSearch, loadMore, clear } = useCatalogSearch();
  const {
    filters,
    activeCount,
    setYearMin,
    setYearMax,
    setMinRating,
    setSort,
    setDuration,
    setPageCount,
    setSeriesStatus,
    toggleGenre,
    togglePlatform,
    toggleLanguage,
    toggleCity,
    reset,
  } = useCatalogFilters();

  // ─── Datos derivados ─────────────────────────────────────────────────────────

  const enabledCategories = useMemo(
    () => isLoggedIn ? CATEGORIES.filter(category => settings.activeCategories.includes(category.id)) : CATEGORIES,
    [CATEGORIES, isLoggedIn, settings.activeCategories],
  );
  const enabledCategoryIds = useMemo(() => enabledCategories.map(category => category.id), [enabledCategories]);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!routeCategory) {
      setActiveCategory(ALL_CATEGORY_ID);
      return;
    }

    if (isValidCategory(routeCategory) && (!isLoggedIn || enabledCategoryIds.includes(routeCategory))) {
      setActiveCategory(routeCategory);
      return;
    }

    navigate('/catalog', { replace: true });
  }, [enabledCategoryIds, isLoggedIn, navigate, routeCategory]);

  // Resetea búsqueda y filtros al cambiar la categoría por URL (back/forward o edición directa)
  useEffect(() => {
    if (prevRouteCategoryRef.current === routeCategory) return;
    prevRouteCategoryRef.current = routeCategory;
    setSearch('');
    reset();
  }, [routeCategory, reset]);

  // Debounce de 500ms sobre el input de búsqueda
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // Lanza búsqueda en la Edge Function cuando el query alcanza 2+ caracteres
  useEffect(() => {
    const apiCategory = toApiCategory(activeCategory);
    if (debouncedSearch.length >= 2 && apiCategory) runSearch(apiCategory, debouncedSearch);
    else clear();
  }, [debouncedSearch, activeCategory, runSearch, clear]);

  // Carga los últimos 60 ítems de la BD cuando no hay búsqueda activa
  useEffect(() => {
    if (debouncedSearch.length >= 2) return;

    let cancelled = false;
    const loadCachedItems = async () => {
      setCachedLoading(true);
      const categoryIds = activeCategory === ALL_CATEGORY_ID
        ? enabledCategoryIds
        : [activeCategory];

      let query = supabase
        .from('catalog_items')
        .select('id, slug, title, description, image_url, release_date, source, source_item_id, metadata, category')
        .order('updated_at', { ascending: false })
        .limit(60);

      if (categoryIds.length > 0) {
        query = query.in('category', categoryIds);
      }

      const { data } = await query;
      if (!cancelled) {
        setCachedItems((data ?? []) as CatalogItem[]);
        setCachedLoading(false);
      }
    };

    void loadCachedItems();
    return () => { cancelled = true; };
  }, [activeCategory, debouncedSearch.length, enabledCategoryIds]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) loadMore();
  }, [hasMore, loadingMore, loading, loadMore]);

  // IntersectionObserver para infinite scroll — dispara carga al alcanzar el sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) handleLoadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  // ─── Datos computados ────────────────────────────────────────────────────────

  const cat = activeCategory === ALL_CATEGORY_ID ? ALL_CATEGORY : CATEGORIES.find(c => c.id === activeCategory);
  const isSearching = debouncedSearch.length >= 2;
  const apiCategory = toApiCategory(activeCategory);

  const rawItems: CatalogItem[] = isSearching && apiCategory
    ? results
    : cachedItems;

  const availableGenres = useMemo(() => extractGenres(rawItems), [rawItems]);
  const availablePlatforms = useMemo(() => extractStringOptions(rawItems, 'platforms'), [rawItems]);
  const availableLanguages = useMemo(() => extractStringOptions(rawItems, ['language', 'original_language']), [rawItems]);
  const availableCities = useMemo(() => extractStringOptions(rawItems, 'city'), [rawItems]);
  const availableSeriesStatuses = useMemo(() => extractStringOptions(rawItems, 'status'), [rawItems]);

  const displayItems = useMemo(() => applyFilters(rawItems, filters), [rawItems, filters]);

  const filteredOut = rawItems.length - displayItems.length;
  const srcConfig = source ? SOURCE_CONFIG[source] : null;

  // Chips de filtros activos para eliminación rápida desde la barra de búsqueda
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.sort !== 'relevance') activeChips.push({ key: 'sort', label: SORT_LABELS[filters.sort], onRemove: () => setSort('relevance') });
  if (filters.minRating > 0) activeChips.push({ key: 'rating', label: `★ ${filters.minRating}+`, onRemove: () => setMinRating(0) });
  if (filters.yearMin !== DEFAULT_FILTERS.yearMin || filters.yearMax !== DEFAULT_FILTERS.yearMax) {
    activeChips.push({ key: 'year', label: `${filters.yearMin} – ${filters.yearMax}`, onRemove: () => { setYearMin(DEFAULT_FILTERS.yearMin); setYearMax(DEFAULT_FILTERS.yearMax); } });
  }
  filters.genres.forEach(g => activeChips.push({ key: `genre-${g}`, label: g, onRemove: () => toggleGenre(g) }));
  filters.platforms.forEach(p => activeChips.push({ key: `platform-${p}`, label: p, onRemove: () => togglePlatform(p) }));
  filters.languages.forEach(l => activeChips.push({ key: `language-${l}`, label: l.toUpperCase(), onRemove: () => toggleLanguage(l) }));
  filters.cities.forEach(c => activeChips.push({ key: `city-${c}`, label: c, onRemove: () => toggleCity(c) }));
  if (filters.duration !== 'all') activeChips.push({ key: 'duration', label: `Duración ${DURATION_CHIP_LABELS[filters.duration]}`, onRemove: () => setDuration('all') });
  if (filters.pageCount !== 'all') activeChips.push({ key: 'pages', label: `Páginas ${PAGE_CHIP_LABELS[filters.pageCount]}`, onRemove: () => setPageCount('all') });
  if (filters.seriesStatus !== 'all') activeChips.push({ key: 'status', label: filters.seriesStatus, onRemove: () => setSeriesStatus('all') });

  // ─── Renderizado ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--surface)] dark:bg-[var(--bg)]">
      <SeoHead
        title="Catálogo - Videojuegos, películas, series, libros y conciertos | Vaultly"
        description="Explora el catálogo completo de Vaultly. Encuentra y trackea videojuegos, películas, series, libros y conciertos."
        keywords="catálogo videojuegos, películas, series, libros, conciertos, Vaultly"
        canonical="/catalog"
        jsonLd={CATALOG_JSONLD}
      />
      <Sidebar />

      <div className="pt-14 md:pt-0 md:pl-64">
        {/* ── Cabecera ── */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-4 md:px-6 py-8">
          <div className="max-w-screen-xl mx-auto">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Catálogo
            </h1>

            {/* Tabs de categoría */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[ALL_CATEGORY, ...enabledCategories].map(c => (
                <button key={c.id}
                  onClick={() => { setActiveCategory(c.id); setSearch(''); reset(); navigate(c.id === 'all' ? '/catalog' : `/catalog/${c.id}`); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === c.id ? 'text-white' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                  style={activeCategory === c.id ? { background: c.accent } : {}}
                >
                  <i className={c.icon}></i>{c.label}
                </button>
              ))}
            </div>

            {/* Fila de búsqueda y filtros */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Buscar en ${cat?.label ?? ''}...`}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 dark:focus:ring-zinc-600/50"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition-colors">
                    <i className="ri-close-line text-sm"></i>
                  </button>
                )}
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => setFiltersOpen(p => !p)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeCount > 0
                      ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <i className="ri-equalizer-2-line"></i>
                  {activeCount > 0 ? `Filtros (${activeCount})` : 'Filtros'}
                </button>
              </div>
            </div>

            {/* Fila de estado: fuente, conteo y chips de filtros activos */}
            <div className="mt-3 flex flex-wrap items-center gap-2 min-h-[28px]">
              {isSearching && srcConfig && !loading && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${srcConfig.cls}`}>
                  <i className={srcConfig.icon}></i>
                  {srcConfig.label}
                </span>
              )}

              {!loading && (isSearching || activeCount > 0) && (
                <span className="text-xs text-zinc-400">
                  {displayItems.length} resultado{displayItems.length !== 1 ? 's' : ''}
                  {filteredOut > 0 && ` · ${filteredOut} filtrado${filteredOut !== 1 ? 's' : ''}`}
                  {page > 1 && ` · pág. ${page}`}
                </span>
              )}

              {activeChips.map(chip => (
                <span key={chip.key}
                  className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                  {chip.label}
                  <button onClick={chip.onRemove}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                    <i className="ri-close-line text-[10px]"></i>
                  </button>
                </span>
              ))}

              {activeChips.length > 1 && (
                <button onClick={reset}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer whitespace-nowrap">
                  Limpiar todo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Área de la cuadrícula ── */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

          {(loading || cachedLoading) && <SkeletonGrid count={12} />}

          {!loading && !cachedLoading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <i className="ri-error-warning-line text-xl text-red-500"></i>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs">
                No se pudo conectar con la API. Comprueba tu conexión o inténtalo de nuevo.
              </p>
              <button onClick={() => apiCategory ? runSearch(apiCategory, debouncedSearch) : clear()}
                className="mt-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line mr-1.5"></i>Reintentar
              </button>
            </div>
          )}

          {!loading && !cachedLoading && !error && displayItems.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                {displayItems.map(item => (
                  <ItemCard key={item.slug || item.id} item={item} categoryId={activeCategory} catIcon={cat?.icon} />
                ))}
              </div>

              {isSearching && (
                <div className="mt-10">
                  <div ref={sentinelRef} className="h-1" />
                  {loadingMore && <div className="mt-4"><SkeletonGrid count={6} /></div>}
                  {hasMore && !loadingMore && (
                    <div className="flex flex-col items-center gap-3 mt-6">
                      <button onClick={loadMore}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap">
                        <i className="ri-arrow-down-line"></i>Cargar más resultados
                      </button>
                      <p className="text-xs text-zinc-400">Mostrando {displayItems.length} resultados · página {page}</p>
                    </div>
                  )}
                  {!hasMore && !loadingMore && page > 1 && (
                    <div className="flex flex-col items-center gap-2 mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <i className="ri-checkbox-circle-line text-zinc-400 text-sm"></i>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Has visto todos los resultados — {rawItems.length} ítems en {page} página{page !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Estado vacío: los filtros han eliminado todos los resultados */}
          {!loading && !cachedLoading && !error && displayItems.length === 0 && rawItems.length > 0 && (
            <div className="text-center py-20">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto mb-4">
                <i className="ri-equalizer-2-line text-2xl text-zinc-400"></i>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Ningún resultado coincide con los filtros activos
              </p>
              <p className="text-xs mt-1 text-zinc-400 dark:text-zinc-600 mb-4">
                {rawItems.length} resultado{rawItems.length !== 1 ? 's' : ''} antes de filtrar
              </p>
              <button onClick={reset}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap">
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Estado vacío: sin resultados de búsqueda */}
          {!loading && !cachedLoading && !error && rawItems.length === 0 && isSearching && (
            <div className="text-center py-20 text-zinc-400">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto mb-4">
                <i className="ri-search-line text-2xl"></i>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Sin resultados para &quot;{debouncedSearch}&quot;
              </p>
              <p className="text-xs mt-1 text-zinc-400 dark:text-zinc-600">
                Prueba con otro término o cambia de categoría
              </p>
            </div>
          )}

          {/* Pista cuando el catálogo está en reposo sin búsqueda ni filtros */}
          {!loading && !cachedLoading && !isSearching && activeCount === 0 && (
            <p className="text-xs text-zinc-400 text-center mt-8">
              Busca contenido en APIs externas y en tu catálogo guardado. Los elementos se guardan cuando los añades a tu tracker.
            </p>
          )}
        </div>
      </div>

      {/* Panel de filtros — fixed en raíz para z-index correcto */}
      {filtersOpen && (
        <CatalogFilters
          filters={filters}
          availableGenres={availableGenres}
          availablePlatforms={availablePlatforms}
          availableLanguages={availableLanguages}
          availableCities={availableCities}
          availableSeriesStatuses={availableSeriesStatuses}
          activeCategory={activeCategory}
          activeCount={activeCount}
          onYearMin={setYearMin}
          onYearMax={setYearMax}
          onMinRating={setMinRating}
          onSort={setSort}
          onDuration={setDuration}
          onPageCount={setPageCount}
          onSeriesStatus={setSeriesStatus}
          onToggleGenre={toggleGenre}
          onTogglePlatform={togglePlatform}
          onToggleLanguage={toggleLanguage}
          onToggleCity={toggleCity}
          onReset={reset}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
