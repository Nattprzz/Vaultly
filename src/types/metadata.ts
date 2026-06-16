/**
 * metadata.ts — tipos de metadatos por categoría del catálogo.
 *
 * Cada interfaz modela el campo JSONB `metadata` que almacena Vaultly
 * para cada ítem, y el campo `metadata` del registro de seguimiento personal.
 * Las interfaces de API provienen de fuentes externas (IGDB, TMDB, etc.);
 * UserTrackingMetadata es exclusivo de Vaultly.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────
/** Identificador de categoría en la aplicación. */
export type TrackerCategory = 'videojuegos' | 'peliculas' | 'series' | 'libros' | 'conciertos';

/**
 * Tiempos estimados de HowLongToBeat para un videojuego.
 */
export interface HowLongToBeatMetadata {
  /** ID en la base de datos de HowLongToBeat */
  id: number | null;
  /** Horas para completar la historia principal */
  main: number | null;
  /** Horas para historia + contenido extra */
  main_extra: number | null;
  /** Horas para el 100% de logros */
  completionist: number | null;
  /** Índice de similitud usado al hacer el match */
  similarity: number | null;
}

/**
 * Trailer enlazado desde IGDB o desde una fuente externa administrada.
 */
export interface GameTrailerMetadata {
  /** Titulo visible del trailer */
  title?: string;
  /** URL reproducible o visitable del trailer */
  url: string;
  /** Miniatura opcional para carruseles o previews */
  thumbnail_url?: string;
  /** Fuente usada para decidir como mostrar el trailer */
  source?: 'youtube' | 'vimeo' | 'igdb' | 'other';
}

/**
 * Videojuego relacionado calculado desde IGDB o desde el catalogo cacheado.
 */
export interface RelatedGameMetadata {
  /** ID del juego en la fuente externa */
  source_item_id: string;
  /** Slug interno de Vaultly si existe o slug estable de fuente */
  slug: string;
  /** Titulo visible */
  title: string;
  /** Portada o imagen principal */
  image_url: string | null;
  /** Fecha de lanzamiento normalizada */
  release_date: string | null;
  /** Puntuacion de relevancia usada para ordenar */
  score: number;
  /** Motivos que justifican la relacion */
  reasons: string[];
}

/**
 * Metadatos de un videojuego (fuente: IGDB).
 */
export interface GameMetadata {
  /** Géneros del juego */
  genres: string[];
  /** Plataformas disponibles */
  platforms: string[];
  /** Estudios desarrolladores */
  developers: string[];
  /** Publishers o distribuidoras */
  publishers: string[];
  /** Capturas adicionales del juego */
  screenshots?: string[];
  /** Artes oficiales o promocionales */
  artworks?: string[];
  /** Trailers asociados al juego */
  trailers?: GameTrailerMetadata[];
  /** URL opcional a un mapa interactivo externo curado manualmente */
  interactive_map_url?: string;
  /** Fuente visible del mapa interactivo externo */
  interactive_map_source?: string;
  /** Juegos relacionados ordenados por relevancia */
  related_games?: RelatedGameMetadata[];
  /** Temas de IGDB usados como senal secundaria para relacionados */
  themes?: string[];
  /** Nombre de saga, franquicia o coleccion si IGDB lo informa */
  franchise_name?: string | null;
  /** Sitio oficial o enlace principal */
  website?: string | null;
  /** Enlaces externos relevantes normalizados */
  websites?: Array<{ category?: string; url: string }>;
  /** Modos de juego (individual, cooperativo, multijugador) */
  game_modes: string[];
  /** Fechas de lanzamiento por región */
  release_dates: {
    north_america: string | null;
    europe: string | null;
    japan: string | null;
  };
  /** Número total de logros */
  achievements_count: number | null;
  /** Slug en IGDB para trazabilidad */
  igdb_slug: string | null;
  /** Puntuación media en IGDB */
  rating: number | null;
  /** Número de puntuaciones en IGDB */
  rating_count: number | null;
  /** Tiempos estimados de HowLongToBeat */
  howlongtobeat?: HowLongToBeatMetadata;
  /** Idioma de los datos almacenados */
  language: string;
  [key: string]: unknown;
}

/**
 * Metadatos de una película (fuente: TMDB).
 */
export interface MovieMetadata {
  /** Géneros de la película */
  genres: string[];
  /** Plataformas de streaming disponibles */
  platforms: string[];
  /** Director o directora */
  director: string | null;
  /** Actores principales */
  cast: string[];
  /** Productoras */
  production_companies: string[];
  /** Idioma original */
  original_language: string | null;
  /** Duración en minutos */
  runtime: number | null;
  /** Puntuación media en TMDB */
  rating: number | null;
  /** Número de puntuaciones en TMDB */
  rating_count: number | null;
  /** Idioma de los datos almacenados */
  language: string;
  [key: string]: unknown;
}

/**
 * Metadatos de una serie de televisión (fuente: TMDB).
 */
export interface SeriesMetadata {
  /** Géneros de la serie */
  genres: string[];
  /** Plataformas de emisión o streaming */
  platforms: string[];
  /** Creadores de la serie */
  creators: string[];
  /** Actores principales */
  cast: string[];
  /** Productoras */
  production_companies: string[];
  /** Número de temporadas */
  seasons: number | null;
  /** Número total de episodios */
  episodes: number | null;
  /** Estado de emisión (en curso, finalizada, etc.) */
  status: string | null;
  /** Idioma original */
  original_language: string | null;
  /** Puntuación media en TMDB */
  rating: number | null;
  /** Número de puntuaciones en TMDB */
  rating_count: number | null;
  /** Idioma de los datos almacenados */
  language: string;
  [key: string]: unknown;
}

/**
 * Metadatos de un libro (fuente: Google Books).
 */
export interface BookMetadata {
  /** Géneros literarios */
  genres: string[];
  /** Formatos disponibles (papel, digital, audiolibro) */
  formats_available: string[];
  /** Lista de autores */
  authors: string[];
  /** Editorial */
  publisher: string | null;
  /** ISBN */
  isbn: string | null;
  /** Número de páginas */
  page_count: number | null;
  /** Fecha de publicación */
  published_date: string | null;
  /** Puntuación media en Google Books */
  rating: number | null;
  /** Número de puntuaciones */
  rating_count: number | null;
  /** Información de la saga a la que pertenece */
  saga: {
    name: string | null;
    volume: number | null;
    type: string | null;
  };
  /** Idioma del libro */
  language: string | null;
  [key: string]: unknown;
}

/**
 * Metadatos de un concierto o evento en vivo (fuente: Ticketmaster).
 */
export interface ConcertMetadata {
  /** Géneros musicales */
  genres: string[];
  /** Segmento de la industria (música, deportes, etc.) */
  segment: string | null;
  /** Subgénero musical */
  subgenre: string | null;
  /** Ciudad del evento */
  city: string | null;
  /** Nombre del recinto */
  venue: string | null;
  /** País del evento */
  country: string | null;
  /** Fecha del evento en formato ISO */
  event_date: string | null;
  /** Hora de inicio */
  start_time: string | null;
  /** Artistas participantes */
  artists: string[];
  /** Puntuación media */
  rating: number | null;
  /** Número de puntuaciones */
  rating_count: number | null;
  /** Idioma de los datos */
  language: string | null;
  [key: string]: unknown;
}

/**
 * Unión de todos los tipos de metadatos de catálogo.
 * El campo `metadata` de `catalog_items` puede contener cualquiera de estos.
 */
export type CatalogItemMetadata =
  | GameMetadata
  | MovieMetadata
  | SeriesMetadata
  | BookMetadata
  | ConcertMetadata
  | Record<string, unknown>;

/**
 * Metadatos del seguimiento personal de un usuario sobre un ítem.
 * Se almacena en `user_item_tracking.metadata` como JSONB.
 * Cada categoría tiene sus propios campos relevantes.
 */
export interface UserTrackingMetadata {
  /** Plataforma en la que se está jugando (videojuegos) */
  playing_platform?: string | null;
  /** Horas jugadas (videojuegos) */
  hours_played?: number | null;
  /** Logros desbloqueados (videojuegos) */
  achievements_unlocked?: number | null;
  /** Indica si se ha conseguido el platino (videojuegos) */
  has_platinum?: boolean;
  /** Plataforma donde se ha visto (películas, series) */
  watched_platform?: string | null;
  /** Temporada actual (series) */
  current_season?: number | null;
  /** Episodio actual (series) */
  current_episode?: number | null;
  /** Formato de lectura: papel, digital, audiolibro (libros) */
  reading_format?: string | null;
  /** Página actual de lectura (libros) */
  current_page?: number | null;
  /** Tipo de entrada: general, VIP, etc. (conciertos) */
  ticket_type?: string | null;
  /** Con quién se asistió al evento (conciertos) */
  attended_with?: string | null;
  [key: string]: unknown;
}

/**
 * Devuelve los metadatos de seguimiento vacíos por defecto para una categoría.
 * Se usa al crear una nueva entrada en el tracker antes de que el usuario rellene los campos.
 *
 * @param category Identificador de la categoría del ítem.
 * @returns Objeto con los campos de seguimiento inicializados a null/false.
 */
export function defaultUserTrackingMetadata(category: TrackerCategory | string): UserTrackingMetadata {
  if (category === 'videojuegos') {
    return { playing_platform: null, achievements_unlocked: null, has_platinum: false };
  }
  if (category === 'peliculas') {
    return { watched_platform: null };
  }
  if (category === 'series') {
    return { watched_platform: null, current_season: null, current_episode: null };
  }
  if (category === 'libros') {
    return { reading_format: null, current_page: null };
  }
  if (category === 'conciertos') {
    return { ticket_type: null, attended_with: null };
  }
  return {};
}
