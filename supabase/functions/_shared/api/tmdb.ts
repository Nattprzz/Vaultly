import type { NormalizedCatalogItem } from './types.ts';
import { compact, requireEnv, toSourceSlug } from './utils.ts';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

export function tmdbImageUrl(path?: string | null, size: 'poster' | 'backdrop' = 'poster') {
  if (!path) return null;
  return `${size === 'poster' ? TMDB_IMAGE_BASE_URL : TMDB_BACKDROP_BASE_URL}${path}`;
}

async function tmdbGet(path: string, params: Record<string, string | number | undefined> = {}) {
  const apiKey = requireEnv('TMDB_API_KEY');
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'es-ES');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb error: ${res.status}`);
  return res.json();
}

function normalizeSearchResult(item: any): NormalizedCatalogItem | null {
  const mediaType = item.media_type;
  if (mediaType !== 'movie' && mediaType !== 'tv') return null;

  const isMovie = mediaType === 'movie';
  const sourcePrefix = isMovie ? 'movies' : 'series';

  return {
    source: 'tmdb',
    source_item_id: String(item.id),
    title: isMovie ? item.title : item.name,
    slug: toSourceSlug(sourcePrefix, item.id),
    description: item.overview ?? null,
    image_url: tmdbImageUrl(item.poster_path),
    release_date: isMovie ? item.release_date ?? null : item.first_air_date ?? null,
    metadata: {
      media_type: mediaType,
      rating: item.vote_average ?? null,
      rating_count: item.vote_count ?? null,
      popularity: item.popularity ?? null,
      backdrop_url: tmdbImageUrl(item.backdrop_path, 'backdrop'),
      original_language: item.original_language ?? null,
      genres: [],
      platforms: [],
      language: 'es',
    },
  };
}

export async function searchTmdbMulti(query: string, page = 1): Promise<NormalizedCatalogItem[]> {
  if (!query.trim()) return [];
  const data = await tmdbGet('/search/multi', { query, page, include_adult: 'false' });
  return compact((data.results ?? []).map(normalizeSearchResult));
}

export async function searchTmdbMovies(query: string, page = 1) {
  const results = await searchTmdbMulti(query, page);
  return results.filter(item => item.metadata.media_type === 'movie');
}

export async function searchTmdbSeries(query: string, page = 1) {
  const results = await searchTmdbMulti(query, page);
  return results.filter(item => item.metadata.media_type === 'tv');
}

export async function getTmdbMovie(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const movie = await tmdbGet(`/movie/${sourceId}`, { append_to_response: 'credits' });
  const director = movie.credits?.crew?.find((person: any) => person.job === 'Director')?.name ?? null;
  const ratingCount = movie.vote_count ?? null;

  return {
    source: 'tmdb',
    source_item_id: String(movie.id),
    title: movie.title,
    slug: toSourceSlug('movies', movie.id),
    description: movie.overview ?? null,
    image_url: tmdbImageUrl(movie.poster_path),
    release_date: movie.release_date ?? null,
    metadata: {
      media_type: 'movie',
      rating: movie.vote_average ?? null,
      rating_count: ratingCount,
      popularity: movie.popularity ?? null,
      runtime: movie.runtime ?? null,
      genres: compact((movie.genres ?? []).map((genre: any) => genre.name)),
      platforms: [],
      backdrop_url: tmdbImageUrl(movie.backdrop_path, 'backdrop'),
      director,
      cast: compact((movie.credits?.cast ?? []).slice(0, 12).map((person: any) => person.name)),
      production_companies: compact((movie.production_companies ?? []).slice(0, 3).map((company: any) => company.name)),
      original_language: movie.original_language ?? null,
      origin_country: movie.origin_country ?? [],
      budget: movie.budget ?? null,
      revenue: movie.revenue ?? null,
      language: 'es',
    },
  };
}

export async function getTmdbSeries(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const series = await tmdbGet(`/tv/${sourceId}`, { append_to_response: 'credits' });
  const ratingCount = series.vote_count ?? null;

  return {
    source: 'tmdb',
    source_item_id: String(series.id),
    title: series.name,
    slug: toSourceSlug('series', series.id),
    description: series.overview ?? null,
    image_url: tmdbImageUrl(series.poster_path),
    release_date: series.first_air_date ?? null,
    metadata: {
      media_type: 'tv',
      rating: series.vote_average ?? null,
      rating_count: ratingCount,
      popularity: series.popularity ?? null,
      genres: compact((series.genres ?? []).map((genre: any) => genre.name)),
      platforms: [],
      backdrop_url: tmdbImageUrl(series.backdrop_path, 'backdrop'),
      seasons: series.number_of_seasons ?? null,
      episodes: series.number_of_episodes ?? null,
      runtime: series.episode_run_time?.[0] ?? null,
      networks: compact((series.networks ?? []).map((network: any) => network.name)),
      creators: compact((series.created_by ?? []).map((person: any) => person.name)),
      cast: compact((series.credits?.cast ?? []).slice(0, 12).map((person: any) => person.name)),
      production_companies: compact((series.production_companies ?? []).slice(0, 3).map((company: any) => company.name)),
      status: series.status ?? null,
      original_language: series.original_language ?? null,
      origin_country: series.origin_country ?? [],
      last_air_date: series.last_air_date ?? null,
      language: 'es',
    },
  };
}
