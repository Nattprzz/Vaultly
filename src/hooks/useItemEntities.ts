import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ItemEntity {
  id: string;
  name: string;
  slug: string;
  type: string;
  image: string | null;
  bio: string | null;
  role: string;
}

export interface UseItemEntitiesResult {
  entities: ItemEntity[];
  loading: boolean;
  error: string | null;
}

// Role display config
export const ROLE_CONFIG: Record<string, { label: string; icon: string; color: string; priority: number }> = {
  director:   { label: 'Director/a',    icon: 'ri-movie-line',       color: '#f43f5e', priority: 1 },
  developer:  { label: 'Desarrollador', icon: 'ri-code-box-line',    color: '#8b5cf6', priority: 1 },
  author:     { label: 'Autor/a',       icon: 'ri-book-open-line',   color: '#10b981', priority: 1 },
  artist:     { label: 'Artista',       icon: 'ri-music-line',       color: '#ec4899', priority: 1 },
  publisher:  { label: 'Publisher',     icon: 'ri-building-line',    color: '#6366f1', priority: 2 },
  actor:      { label: 'Reparto',       icon: 'ri-user-star-line',   color: '#f59e0b', priority: 3 },
  creator:    { label: 'Creador/a',     icon: 'ri-lightbulb-line',   color: '#0ea5e9', priority: 2 },
  studio:     { label: 'Estudio',       icon: 'ri-film-line',        color: '#14b8a6', priority: 2 },
};

// Session-level cache: itemId → entities
const memCache = new Map<string, ItemEntity[]>();

export function useItemEntities(itemId: string | null): UseItemEntitiesResult {
  const [entities, setEntities] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setEntities([]);
      return;
    }

    if (memCache.has(itemId)) {
      setEntities(memCache.get(itemId)!);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('item_entities')
          .select(`
            role,
            entities (
              id,
              name,
              slug,
              type,
              image,
              bio
            )
          `)
          .eq('item_id', itemId);

        if (dbError) throw dbError;

        const result: ItemEntity[] = (data ?? [])
          .filter((row: any) => row.entities)
          .map((row: any) => ({
            id: row.entities.id,
            name: row.entities.name,
            slug: row.entities.slug,
            type: row.entities.type,
            image: row.entities.image ?? null,
            bio: row.entities.bio ?? null,
            role: row.role,
          }));

        // Sort by role priority
        result.sort((a, b) => {
          const pa = ROLE_CONFIG[a.role]?.priority ?? 99;
          const pb = ROLE_CONFIG[b.role]?.priority ?? 99;
          return pa - pb;
        });

        if (!cancelled) {
          memCache.set(itemId, result);
          setEntities(result);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [itemId]);

  return { entities, loading, error };
}
