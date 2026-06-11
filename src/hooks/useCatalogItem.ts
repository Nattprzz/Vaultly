import { useState, useEffect } from 'react';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';
import { SUPABASE_ANON_KEY } from '@/lib/supabaseConfig';
import type { CatalogItemMetadata } from '@/types/metadata';

export interface CatalogItemFull {
  id: string;
  slug: string;
  category: string;          // DB enum value: videojuegos, peliculas, etc.
  source: string;            // igdb | tmdb | google_books | ticketmaster | manual
  source_item_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  release_date: string | null;
  metadata: CatalogItemMetadata;
  created_at?: string;
  updated_at?: string;
}

export type ItemSource = 'cache' | 'external' | 'external_cached' | 'mock';

export interface UseCatalogItemResult {
  item: CatalogItemFull | null;
  loading: boolean;
  error: string | null;
  source: ItemSource | null;
}

const EDGE_FN_URL = edgeFunctionUrl('catalog-item');

// Session-level in-memory cache
const memCache = new Map<string, { item: CatalogItemFull; source: ItemSource }>();

export function useCatalogItem(slug: string, category?: string): UseCatalogItemResult {
  const [item, setItem] = useState<CatalogItemFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ItemSource | null>(null);

  useEffect(() => {
    if (!slug) return;

    // Check in-memory cache
    if (memCache.has(slug)) {
      const cached = memCache.get(slug)!;
      setItem(cached.item);
      setSource(cached.source);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const params = new URLSearchParams({ slug });
        if (category) params.set('category', category);
        const { data: sessionData } = await supabase.auth.getSession();
        const bearerToken = sessionData.session?.access_token ?? SUPABASE_ANON_KEY;
        const res = await fetch(`${EDGE_FN_URL}?${params}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            apikey: SUPABASE_ANON_KEY,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        const json: { data: CatalogItemFull; source: ItemSource } = await res.json();

        if (!cancelled) {
          memCache.set(slug, { item: json.data, source: json.source });
          setItem(json.data);
          setSource(json.source);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug, category]);

  return { item, loading, error, source };
}

// ─── Helpers to extract typed fields from metadata ────────────────────────────

export function getItemYear(item: CatalogItemFull): string {
  return item.release_date?.slice(0, 4) ?? '';
}

export function getItemRating(item: CatalogItemFull): number | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r) : null;
}

export function getItemGenres(item: CatalogItemFull): string[] {
  const g = item.metadata?.genres;
  if (Array.isArray(g)) return g as string[];
  const single = item.metadata?.genre;
  if (single) return [String(single)];
  return [];
}

export function getItemBackdrop(item: CatalogItemFull): string | null {
  return (item.metadata?.backdrop_url as string) ?? item.image_url ?? null;
}

export function getItemScreenshots(item: CatalogItemFull): string[] {
  const shots = item.metadata?.screenshots ?? item.metadata?.backdrops;
  if (Array.isArray(shots)) return shots as string[];
  return [];
}

// Map DB enum → UI category id
