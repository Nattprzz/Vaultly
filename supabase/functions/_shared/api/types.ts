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

export type AniListMediaType = 'ANIME' | 'MANGA';
