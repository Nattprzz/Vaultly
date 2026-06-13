export interface BaseCatalogMetadata {
  genres?: string[];
  rating?: number | null;
  rating_count?: number | null;
  howlongtobeat?: {
    id: number | null;
    main: number | null;
    main_extra: number | null;
    completionist: number | null;
    similarity: number | null;
  };
  language?: string | null;
  [key: string]: unknown;
}

export interface GameCompanyRef {
  igdb_id: number | null;
  name: string;
  slug: string;
  url: string;
}

export interface NormalizedCatalogItem {
  source: string;
  source_item_id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  release_date: string | null;
  metadata: BaseCatalogMetadata;
}

export interface NormalizedGameCompany {
  id?: string;
  igdb_id: number;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  country: string | null;
  status: string | null;
  started: string | null;
  changed_date?: string | null;
  parent_company: {
    id: number | null;
    name: string | null;
  } | null;
  company_size: string | null;
  stats: {
    developed: number;
    published: number;
    ported: number;
    supported: number;
    dlcs: number;
    cancelled: number;
    average_rating: number | null;
    rating_count: number;
  };
  popular_games: Array<{
    igdb_id: number;
    slug: string;
    title: string;
    cover_url: string | null;
    release_year: number | null;
    genres: string[];
    platforms: string[];
    rating: number | null;
    rating_count: number;
  }>;
  related_companies: Array<{
    igdb_id: number;
    slug: string;
    name: string;
    roles: string[];
    shared_games_count: number;
  }>;
  genres: Array<{ name: string; count: number }>;
  platforms: Array<{ name: string; count: number }>;
  links: {
    website: string | null;
    twitter: string | null;
    discord: string | null;
    wikipedia: string | null;
    linkedin: string | null;
  };
  source: 'igdb';
  last_synced_at: string | null;
}

export type AniListMediaType = 'ANIME' | 'MANGA';
