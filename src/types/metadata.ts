export type TrackerCategory = 'videojuegos' | 'peliculas' | 'series' | 'libros' | 'conciertos';

export interface HowLongToBeatMetadata {
  id: number | null;
  main: number | null;
  main_extra: number | null;
  completionist: number | null;
  similarity: number | null;
}

export interface GameMetadata {
  genres: string[];
  platforms: string[];
  developers: string[];
  publishers: string[];
  game_modes: string[];
  release_dates: {
    north_america: string | null;
    europe: string | null;
    japan: string | null;
  };
  achievements_count: number | null;
  igdb_slug: string | null;
  rating: number | null;
  rating_count: number | null;
  howlongtobeat?: HowLongToBeatMetadata;
  language: string;
  [key: string]: unknown;
}

export interface MovieMetadata {
  genres: string[];
  platforms: string[];
  director: string | null;
  cast: string[];
  production_companies: string[];
  original_language: string | null;
  runtime: number | null;
  rating: number | null;
  rating_count: number | null;
  language: string;
  [key: string]: unknown;
}

export interface SeriesMetadata {
  genres: string[];
  platforms: string[];
  creators: string[];
  cast: string[];
  production_companies: string[];
  seasons: number | null;
  episodes: number | null;
  status: string | null;
  original_language: string | null;
  rating: number | null;
  rating_count: number | null;
  language: string;
  [key: string]: unknown;
}

export interface BookMetadata {
  genres: string[];
  formats_available: string[];
  authors: string[];
  publisher: string | null;
  isbn: string | null;
  page_count: number | null;
  published_date: string | null;
  rating: number | null;
  rating_count: number | null;
  saga: {
    name: string | null;
    volume: number | null;
    type: string | null;
  };
  language: string | null;
  [key: string]: unknown;
}

export interface ConcertMetadata {
  genres: string[];
  segment: string | null;
  subgenre: string | null;
  city: string | null;
  venue: string | null;
  country: string | null;
  event_date: string | null;
  start_time: string | null;
  artists: string[];
  rating: number | null;
  rating_count: number | null;
  language: string | null;
  [key: string]: unknown;
}

export type CatalogItemMetadata =
  | GameMetadata
  | MovieMetadata
  | SeriesMetadata
  | BookMetadata
  | ConcertMetadata
  | Record<string, unknown>;

export interface UserTrackingMetadata {
  playing_platform?: string | null;
  achievements_unlocked?: number | null;
  has_platinum?: boolean;
  watched_platform?: string | null;
  current_season?: number | null;
  current_episode?: number | null;
  reading_format?: string | null;
  current_page?: number | null;
  ticket_type?: string | null;
  attended_with?: string | null;
  [key: string]: unknown;
}

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
