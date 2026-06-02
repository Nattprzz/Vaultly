export interface NormalizedCatalogItem {
  source: string;
  source_item_id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  release_date: string | null;
  metadata: Record<string, unknown>;
}

export type AniListMediaType = 'ANIME' | 'MANGA';
