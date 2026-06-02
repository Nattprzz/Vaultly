export type AppCategoryId = 'videojuegos' | 'peliculas' | 'series' | 'libros' | 'conciertos';
export type ApiCategoryId = 'games' | 'movies' | 'series' | 'books' | 'concerts';

export const ALL_CATEGORY_ID = 'all';

export const API_CATEGORY_BY_APP: Record<AppCategoryId, ApiCategoryId> = {
  videojuegos: 'games',
  peliculas: 'movies',
  series: 'series',
  libros: 'books',
  conciertos: 'concerts',
};

export const APP_CATEGORY_BY_API: Record<ApiCategoryId, AppCategoryId> = {
  games: 'videojuegos',
  movies: 'peliculas',
  series: 'series',
  books: 'libros',
  concerts: 'conciertos',
};

export const SCHEMA_TYPE_BY_APP_CATEGORY: Record<AppCategoryId, string> = {
  videojuegos: 'VideoGame',
  peliculas: 'Movie',
  series: 'TVSeries',
  libros: 'Book',
  conciertos: 'MusicEvent',
};

export function isAppCategory(value: string | undefined | null): value is AppCategoryId {
  return value === 'videojuegos' || value === 'peliculas' || value === 'series' || value === 'libros' || value === 'conciertos';
}

export function toApiCategory(value: string | undefined | null): ApiCategoryId | undefined {
  if (!value) return undefined;
  if (isAppCategory(value)) return API_CATEGORY_BY_APP[value];
  if (value in APP_CATEGORY_BY_API) return value as ApiCategoryId;
  return undefined;
}

export function toAppCategory(value: string | undefined | null): AppCategoryId | undefined {
  if (!value) return undefined;
  if (isAppCategory(value)) return value;
  if (value in APP_CATEGORY_BY_API) return APP_CATEGORY_BY_API[value as ApiCategoryId];
  return undefined;
}
