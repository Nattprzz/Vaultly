import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { SUPABASE_ANON_KEY } from '@/lib/supabaseConfig';
import type { UserTrackingMetadata } from '@/types/metadata';
import { defaultUserTrackingMetadata } from '@/types/metadata';

import type { CategoryStatus } from '@/constants/tracker-statuses';
import { getDefaultStatus } from '@/constants/tracker-statuses';
/** Alias de compatibilidad — CategoryStatus es la fuente de verdad */
export type TrackerStatus = CategoryStatus;

/** Campos específicos de videojuegos que se guardan en columnas dedicadas */
export interface GameData {
  playingPlatform?: string | null;
  hoursPlayed?: number | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  achievementsUnlocked?: number | null;
}

export interface TrackerEntry {
  itemId: string;
  catalogItemId: string | null;
  category: string;
  status: TrackerStatus;
  rating: number | null;
  review: string;
  addedAt: string;
  updatedAt: string;
  metadata: UserTrackingMetadata;
  title: string;
  cover: string;
  year: number;
  genre: string;
  // Campos de videojuegos (null para otras categorías)
  playingPlatform: string | null;
  hoursPlayed: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  achievementsUnlocked: number | null;
}

const CATALOG_ITEM_URL = edgeFunctionUrl('catalog-item');

async function ensureCatalogItemId(itemSlug: string, category: string): Promise<string | null> {
  const { data: cachedItem } = await supabase
    .from('catalog_items')
    .select('id')
    .eq('slug', itemSlug)
    .eq('category', category)
    .maybeSingle();

  if (cachedItem?.id) return cachedItem.id;

  const { data: sessionData } = await supabase.auth.getSession();
  const bearerToken = sessionData.session?.access_token ?? SUPABASE_ANON_KEY;

  try {
    const res = await fetch(CATALOG_ITEM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        slug: itemSlug,
        category,
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data?.id ?? null;
  } catch {
    return null;
  }
}

function rowToEntry(row: Record<string, unknown>, catalogItem?: Record<string, unknown>): TrackerEntry {
  const metadata = (catalogItem?.metadata as Record<string, unknown> | undefined) ?? {};
  const genres = metadata.genres;
  const genre = Array.isArray(genres) ? String(genres[0] ?? '') : String(metadata.genre ?? '');
  const releaseDate = catalogItem?.release_date as string | null | undefined;

  return {
    itemId: (row.item_slug as string) ?? (row.id as string),
    catalogItemId: (row.item_id as string | null) ?? (catalogItem?.id as string | null) ?? null,
    category: (row.category as string) ?? '',
    status: (row.status_en as TrackerStatus) ?? getDefaultStatus((row.category as string) ?? ''),
    rating: row.rating != null ? Number(row.rating) : null,
    review: (row.review as string) ?? '',
    addedAt: (row.created_at as string) ?? new Date().toISOString(),
    updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
    metadata: (row.metadata as UserTrackingMetadata | null) ?? defaultUserTrackingMetadata((row.category as string) ?? ''),
    title: (catalogItem?.title as string) ?? String(row.item_slug ?? 'Item desconocido').replace(/-/g, ' '),
    cover: (catalogItem?.image_url as string | null) ?? (catalogItem?.cover_url as string | null) ?? '',
    year: releaseDate ? Number(releaseDate.slice(0, 4)) : 0,
    genre,
    playingPlatform:       (row.playing_platform as string | null)         ?? null,
    hoursPlayed:           row.hours_played != null ? Number(row.hours_played) : null,
    startedAt:             (row.started_at as string | null)               ?? null,
    finishedAt:            (row.finished_at as string | null)              ?? null,
    achievementsUnlocked:  row.achievements_unlocked != null ? Number(row.achievements_unlocked) : null,
  };
}

export function useTracker() {
  const { user, isLoggedIn } = useAuth();
  const [entries, setEntries] = useState<Record<string, TrackerEntry>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('user_item_tracking')
      .select('id, item_id, item_slug, category, status_en, rating, review, started_at, finished_at, playing_platform, hours_played, achievements_unlocked, metadata, created_at, updated_at')
      .eq('user_id', user.id);

    if (!error && data) {
      const slugs = [...new Set(data.map(row => row.item_slug).filter(Boolean))];
      const ids = [...new Set(data.map(row => row.item_id).filter(Boolean))];
      const catalogBySlug = new Map<string, Record<string, unknown>>();
      const catalogById = new Map<string, Record<string, unknown>>();

      if (slugs.length > 0 || ids.length > 0) {
        let query = supabase
          .from('catalog_items')
          .select('id, slug, title, image_url, cover_url, release_date, metadata');

        if (slugs.length > 0 && ids.length > 0) {
          query = query.or(`slug.in.(${slugs.join(',')}),id.in.(${ids.join(',')})`);
        } else if (slugs.length > 0) {
          query = query.in('slug', slugs);
        } else {
          query = query.in('id', ids);
        }

        const { data: catalogRows } = await query;
        catalogRows?.forEach(item => {
          catalogBySlug.set(item.slug, item as Record<string, unknown>);
          catalogById.set(item.id, item as Record<string, unknown>);
        });
      }

      const map: Record<string, TrackerEntry> = {};
      data.forEach((row: Record<string, unknown>) => {
        const catalogItem = catalogBySlug.get(row.item_slug as string) ?? catalogById.get(row.item_id as string);
        const entry = rowToEntry(row, catalogItem);
        if (entry.itemId) map[entry.itemId] = entry;
      });
      setEntries(map);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (isLoggedIn && user) {
      loadEntries();
    } else {
      setEntries({});
    }
  }, [isLoggedIn, user, loadEntries]);

  const getEntry = useCallback(
    (itemId: string): TrackerEntry | null => entries[itemId] ?? null,
    [entries],
  );

  const addOrUpdate = useCallback(
    async (
      itemId: string,
      category: string,
      status: TrackerStatus,
      rating: number | null,
      review: string,
      gameData?: GameData,
      metadata?: UserTrackingMetadata,
    ) => {
      if (!user) return false;

      const now = new Date().toISOString();
      const existing = entries[itemId];
      setError(null);

      const optimistic: TrackerEntry = {
        itemId,
        catalogItemId: existing?.catalogItemId ?? null,
        category,
        status,
        rating,
        review,
        addedAt: existing?.addedAt ?? now,
        updatedAt: now,
        metadata: metadata ?? existing?.metadata ?? defaultUserTrackingMetadata(category),
        title: existing?.title ?? itemId.replace(/-/g, ' '),
        cover: existing?.cover ?? '',
        year: existing?.year ?? 0,
        genre: existing?.genre ?? '',
        playingPlatform:      category === 'videojuegos' ? (gameData?.playingPlatform      ?? existing?.playingPlatform      ?? null) : null,
        hoursPlayed:          category === 'videojuegos' ? (gameData?.hoursPlayed          ?? existing?.hoursPlayed          ?? null) : null,
        startedAt:            category === 'videojuegos' ? (gameData?.startedAt            ?? existing?.startedAt            ?? null) : null,
        finishedAt:           category === 'videojuegos' ? (gameData?.finishedAt           ?? existing?.finishedAt           ?? null) : null,
        achievementsUnlocked: category === 'videojuegos' ? (gameData?.achievementsUnlocked ?? existing?.achievementsUnlocked ?? null) : null,
      };
      setEntries(prev => ({ ...prev, [itemId]: optimistic }));

      const rollback = () =>
        setEntries(prev => {
          const next = { ...prev };
          if (existing) next[itemId] = existing;
          else delete next[itemId];
          return next;
        });

      const { data: existingRow } = await supabase
        .from('user_item_tracking')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_slug', itemId)
        .maybeSingle();

      // For updates, reuse the known catalog item id to avoid an unnecessary
      // network call. For new inserts we must resolve it via the edge function.
      const safeCatalogItemId = existing?.catalogItemId
        ?? await ensureCatalogItemId(itemId, category);

      if (!safeCatalogItemId && !existingRow) {
        rollback();
        setError('No se pudo guardar el ítem en el catálogo. Inténtalo de nuevo.');
        return false;
      }

      if (existingRow) {
        const updatePayload: Record<string, unknown> = {
          ...(safeCatalogItemId ? { item_id: safeCatalogItemId } : {}),
          status_en: status,
          rating,
          review,
          category,
          updated_at: now,
        };
        if (metadata) updatePayload.metadata = { ...defaultUserTrackingMetadata(category), ...metadata };
        if (category === 'videojuegos') {
          updatePayload.playing_platform      = gameData?.playingPlatform      ?? null;
          updatePayload.hours_played          = gameData?.hoursPlayed          ?? null;
          updatePayload.started_at            = gameData?.startedAt            ?? null;
          updatePayload.finished_at           = gameData?.finishedAt           ?? null;
          updatePayload.achievements_unlocked = gameData?.achievementsUnlocked ?? null;
        }

        const { error: updateError } = await supabase
          .from('user_item_tracking')
          .update(updatePayload)
          .eq('id', existingRow.id);

        if (updateError) {
          rollback();
          setError(updateError.message);
          return false;
        }
      } else {
        const { error: insertError } = await supabase
          .from('user_item_tracking')
          .insert({
            user_id: user.id,
            item_id: safeCatalogItemId,
            item_slug: itemId,
            category,
            status_en: status,
            rating,
            review,
            metadata: { ...defaultUserTrackingMetadata(category), ...(metadata ?? {}) },
            created_at: now,
            updated_at: now,
            ...(category === 'videojuegos' && gameData ? {
              playing_platform:      gameData.playingPlatform      ?? null,
              hours_played:          gameData.hoursPlayed          ?? null,
              started_at:            gameData.startedAt            ?? null,
              finished_at:           gameData.finishedAt           ?? null,
              achievements_unlocked: gameData.achievementsUnlocked ?? null,
            } : {}),
          });

        if (insertError) {
          rollback();
          setError(insertError.message);
          return false;
        }
      }

      await loadEntries();
      return true;
    },
    [user, entries, loadEntries],
  );

  const remove = useCallback(
    async (itemId: string): Promise<boolean> => {
      if (!user) return false;

      const { error: deleteError } = await supabase
        .from('user_item_tracking')
        .delete()
        .eq('user_id', user.id)
        .eq('item_slug', itemId);

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      setEntries(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      return true;
    },
    [user],
  );

  const isTracked = useCallback((itemId: string) => Boolean(entries[itemId]), [entries]);

  return { entries, getEntry, addOrUpdate, remove, isTracked, loading, error };
}
