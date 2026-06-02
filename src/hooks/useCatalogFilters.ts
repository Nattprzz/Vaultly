import { useState, useCallback, useMemo } from 'react';
import type { CatalogItem } from '@/hooks/useCatalogSearch';

export type SortOption = 'relevance' | 'rating_desc' | 'rating_asc' | 'year_desc' | 'year_asc' | 'title_asc';

export interface FilterState {
  yearMin: number;
  yearMax: number;
  minRating: number;       // 0 = no filter
  genres: string[];        // empty = no filter
  platforms: string[];
  languages: string[];
  cities: string[];
  duration: 'all' | 'short' | 'medium' | 'long';
  pageCount: 'all' | 'short' | 'medium' | 'long';
  seriesStatus: string;
  sort: SortOption;
}

const CURRENT_YEAR = new Date().getFullYear();

export const DEFAULT_FILTERS: FilterState = {
  yearMin: 1970,
  yearMax: CURRENT_YEAR,
  minRating: 0,
  genres: [],
  platforms: [],
  languages: [],
  cities: [],
  duration: 'all',
  pageCount: 'all',
  seriesStatus: 'all',
  sort: 'relevance',
};

function getItemYear(item: CatalogItem): number {
  return parseInt(item.release_date?.slice(0, 4) ?? '0', 10);
}

function getItemRating(item: CatalogItem): number {
  return Number(item.metadata?.rating ?? 0);
}

function getItemGenres(item: CatalogItem): string[] {
  const g = item.metadata?.genres ?? item.metadata?.genre;
  if (Array.isArray(g)) return g.map(String);
  if (g) return [String(g)];
  return [];
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (value) return [String(value)];
  return [];
}

function getNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function matchesRange(value: number | null, range: FilterState['duration'] | FilterState['pageCount'], bounds: Record<string, [number, number]>): boolean {
  if (range === 'all') return true;
  if (value == null) return true;
  const [min, max] = bounds[range];
  return value >= min && value <= max;
}

/** Extract all unique genres from a list of items */
export function extractGenres(items: CatalogItem[]): string[] {
  const set = new Set<string>();
  items.forEach(item => getItemGenres(item).forEach(g => { if (g) set.add(g); }));
  return Array.from(set).sort();
}

/** Apply filters + sort to a list of items */
export function applyFilters(items: CatalogItem[], filters: FilterState): CatalogItem[] {
  let out = items.filter(item => {
    const year = getItemYear(item);
    const rating = getItemRating(item);
    const genres = getItemGenres(item);

    if (year > 0 && (year < filters.yearMin || year > filters.yearMax)) return false;
    if (filters.minRating > 0 && rating < filters.minRating) return false;
    if (filters.genres.length > 0) {
      const hasGenre = filters.genres.some(fg =>
        genres.some(g => g.toLowerCase().includes(fg.toLowerCase()))
      );
      if (!hasGenre) return false;
    }

    if (filters.platforms.length > 0) {
      const platforms = toStringArray(item.metadata?.platforms);
      if (platforms.length > 0 && !filters.platforms.some(fp => platforms.some(p => p.toLowerCase().includes(fp.toLowerCase())))) return false;
    }

    if (filters.languages.length > 0) {
      const language = String(item.metadata?.language ?? item.metadata?.original_language ?? '');
      if (language && !filters.languages.includes(language)) return false;
    }

    if (filters.cities.length > 0) {
      const city = String(item.metadata?.city ?? '');
      if (city && !filters.cities.includes(city)) return false;
    }

    if (!matchesRange(getNumber(item.metadata?.runtime), filters.duration, {
      short: [1, 89],
      medium: [90, 139],
      long: [140, 999],
    })) return false;

    if (!matchesRange(getNumber(item.metadata?.page_count), filters.pageCount, {
      short: [1, 249],
      medium: [250, 499],
      long: [500, 9999],
    })) return false;

    if (filters.seriesStatus !== 'all') {
      const status = String(item.metadata?.status ?? '');
      if (status && status !== filters.seriesStatus) return false;
    }

    return true;
  });

  switch (filters.sort) {
    case 'rating_desc': out = [...out].sort((a, b) => getItemRating(b) - getItemRating(a)); break;
    case 'rating_asc':  out = [...out].sort((a, b) => getItemRating(a) - getItemRating(b)); break;
    case 'year_desc':   out = [...out].sort((a, b) => getItemYear(b) - getItemYear(a)); break;
    case 'year_asc':    out = [...out].sort((a, b) => getItemYear(a) - getItemYear(b)); break;
    case 'title_asc':   out = [...out].sort((a, b) => a.title.localeCompare(b.title)); break;
    default: break; // relevance = original order
  }

  return out;
}

/** Count how many filters are active (differ from defaults) */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.yearMin !== DEFAULT_FILTERS.yearMin) count++;
  if (filters.yearMax !== DEFAULT_FILTERS.yearMax) count++;
  if (filters.minRating > 0) count++;
  if (filters.genres.length > 0) count++;
  if (filters.platforms.length > 0) count++;
  if (filters.languages.length > 0) count++;
  if (filters.cities.length > 0) count++;
  if (filters.duration !== 'all') count++;
  if (filters.pageCount !== 'all') count++;
  if (filters.seriesStatus !== 'all') count++;
  if (filters.sort !== 'relevance') count++;
  return count;
}

export function useCatalogFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const setYearMin = useCallback((v: number) => setFilters(f => ({ ...f, yearMin: v })), []);
  const setYearMax = useCallback((v: number) => setFilters(f => ({ ...f, yearMax: v })), []);
  const setMinRating = useCallback((v: number) => setFilters(f => ({ ...f, minRating: v })), []);
  const setSort = useCallback((v: SortOption) => setFilters(f => ({ ...f, sort: v })), []);
  const setDuration = useCallback((v: FilterState['duration']) => setFilters(f => ({ ...f, duration: v })), []);
  const setPageCount = useCallback((v: FilterState['pageCount']) => setFilters(f => ({ ...f, pageCount: v })), []);
  const setSeriesStatus = useCallback((v: string) => setFilters(f => ({ ...f, seriesStatus: v })), []);

  const toggleGenre = useCallback((genre: string) => {
    setFilters(f => ({
      ...f,
      genres: f.genres.includes(genre)
        ? f.genres.filter(g => g !== genre)
        : [...f.genres, genre],
    }));
  }, []);

  const togglePlatform = useCallback((platform: string) => {
    setFilters(f => ({
      ...f,
      platforms: f.platforms.includes(platform)
        ? f.platforms.filter(item => item !== platform)
        : [...f.platforms, platform],
    }));
  }, []);

  const toggleLanguage = useCallback((language: string) => {
    setFilters(f => ({
      ...f,
      languages: f.languages.includes(language)
        ? f.languages.filter(item => item !== language)
        : [...f.languages, language],
    }));
  }, []);

  const toggleCity = useCallback((city: string) => {
    setFilters(f => ({
      ...f,
      cities: f.cities.includes(city)
        ? f.cities.filter(item => item !== city)
        : [...f.cities, city],
    }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  return {
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
  };
}
