import { useState, useEffect } from 'react';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';

export interface EntityData {
  id: string;
  name: string;
  type: string;
  slug: string;
  image_url: string | null;
  bio: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EntityItem {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  release_date: string | null;
  category: string;
  source: string;
  source_item_id: string;
  metadata: Record<string, unknown>;
  role: string;
}

export interface EntityStats {
  total_items: number;
}

export interface UseEntityResult {
  entity: EntityData | null;
  items: EntityItem[];
  stats: EntityStats | null;
  loading: boolean;
  error: string | null;
}

const EDGE_FN_URL = edgeFunctionUrl('catalog-entity');

// Session-level cache
const memCache = new Map<string, { entity: EntityData; items: EntityItem[]; stats: EntityStats }>();

export function useEntity(slug: string): UseEntityResult {
  const [entity, setEntity] = useState<EntityData | null>(null);
  const [items, setItems] = useState<EntityItem[]>([]);
  const [stats, setStats] = useState<EntityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    if (memCache.has(slug)) {
      const c = memCache.get(slug)!;
      setEntity(c.entity);
      setItems(c.items);
      setStats(c.stats);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${EDGE_FN_URL}?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!cancelled) {
          memCache.set(slug, { entity: json.entity, items: json.items ?? [], stats: json.stats ?? { total_items: 0 } });
          setEntity(json.entity);
          setItems(json.items ?? []);
          setStats(json.stats ?? { total_items: 0 });
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  return { entity, items, stats, loading, error };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const TYPE_LABELS: Record<string, string> = {
  developer: 'Desarrollador', publisher: 'Publisher', actor: 'Actor / Actriz',
  director: 'Director/a', author: 'Autor/a', artist: 'Artista', creator: 'Creador/a',
};

export const TYPE_ICONS: Record<string, string> = {
  developer: 'ri-code-box-line', publisher: 'ri-building-line', actor: 'ri-user-star-line',
  director: 'ri-movie-line', author: 'ri-quill-pen-line', artist: 'ri-music-2-line', creator: 'ri-lightbulb-line',
};

/** Generate entity slug from name + type (must match edge function logic) */
export function buildEntitySlug(name: string, type: string): string {
  return `${name}-${type}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
