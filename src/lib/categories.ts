/**
 * categories.ts — mapeos entre identificadores de categoría de la app y de la API.
 *
 * La aplicación usa nombres en español (videojuegos, peliculas…) como IDs internos,
 * mientras que las Edge Functions y fuentes externas usan inglés (games, movies…).
 * Este módulo es la fuente de verdad para esas traducciones, además de
 * proporcionar helpers de validación y conversión.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
/** Identificador de categoría tal como se usa en Vaultly (español). */
export type AppCategoryId = 'videojuegos' | 'peliculas' | 'series' | 'libros' | 'conciertos';

/** Identificador de categoría tal como lo espera la API externa (inglés). */
export type ApiCategoryId = 'games' | 'movies' | 'series' | 'books' | 'concerts';

/** Valor especial para filtros que representan "todas las categorías". */
export const ALL_CATEGORY_ID = 'all';

/** Convierte un AppCategoryId al ApiCategoryId correspondiente. */
export const API_CATEGORY_BY_APP: Record<AppCategoryId, ApiCategoryId> = {
  videojuegos: 'games',
  peliculas: 'movies',
  series: 'series',
  libros: 'books',
  conciertos: 'concerts',
};

/** Convierte un ApiCategoryId al AppCategoryId correspondiente. */
export const APP_CATEGORY_BY_API: Record<ApiCategoryId, AppCategoryId> = {
  games: 'videojuegos',
  movies: 'peliculas',
  series: 'series',
  books: 'libros',
  concerts: 'conciertos',
};

/** Tipo Schema.org asociado a cada categoría, para datos estructurados (JSON-LD). */
export const SCHEMA_TYPE_BY_APP_CATEGORY: Record<AppCategoryId, string> = {
  videojuegos: 'VideoGame',
  peliculas: 'Movie',
  series: 'TVSeries',
  libros: 'Book',
  conciertos: 'MusicEvent',
};

/**
 * Comprueba si un string es un AppCategoryId válido.
 *
 * @param value Valor a validar.
 * @returns true si el valor es una categoría reconocida por la app.
 */
export function isAppCategory(value: string | undefined | null): value is AppCategoryId {
  return value === 'videojuegos' || value === 'peliculas' || value === 'series' || value === 'libros' || value === 'conciertos';
}

/**
 * Convierte cualquier identificador de categoría al formato que espera la API.
 * Acepta tanto AppCategoryId como ApiCategoryId directamente.
 *
 * @param value Identificador de categoría en cualquier formato.
 * @returns ApiCategoryId o undefined si el valor no es reconocido.
 */
export function toApiCategory(value: string | undefined | null): ApiCategoryId | undefined {
  if (!value) return undefined;
  if (isAppCategory(value)) return API_CATEGORY_BY_APP[value];
  if (value in APP_CATEGORY_BY_API) return value as ApiCategoryId;
  return undefined;
}

/**
 * Convierte cualquier identificador de categoría al formato interno de la app.
 * Acepta tanto AppCategoryId como ApiCategoryId directamente.
 *
 * @param value Identificador de categoría en cualquier formato.
 * @returns AppCategoryId o undefined si el valor no es reconocido.
 */
export function toAppCategory(value: string | undefined | null): AppCategoryId | undefined {
  if (!value) return undefined;
  if (isAppCategory(value)) return value;
  if (value in APP_CATEGORY_BY_API) return APP_CATEGORY_BY_API[value as ApiCategoryId];
  return undefined;
}
