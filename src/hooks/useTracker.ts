/**
 * useTracker.ts — CRUD del tracker personal del usuario.
 *
 * Gestiona la carga, creación, actualización y eliminación de entradas
 * en la tabla user_item_tracking. Aplica actualizaciones optimistas
 * con rollback automático ante errores de red.
 * Resuelve los IDs de catálogo invocando la Edge Function catalog-item
 * cuando el ítem aún no existe en la base de datos local.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

// ─── Librerías externas ──────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { SUPABASE_ANON_KEY } from '@/lib/supabaseConfig';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { UserTrackingMetadata } from '@/types/metadata';
import { defaultUserTrackingMetadata } from '@/types/metadata';
import type { CategoryStatus } from '@/constants/tracker-statuses';
import { getDefaultStatus } from '@/constants/tracker-statuses';

/** Alias de compatibilidad — CategoryStatus es la fuente de verdad. */
export type TrackerStatus = CategoryStatus;

/**
 * Datos específicos de videojuegos que se guardan en columnas dedicadas
 * de user_item_tracking (no en el campo metadata JSONB).
 */
export interface GameData {
  /** Plataforma en la que se juega */
  playingPlatform?: string | null;
  /** Horas de juego registradas */
  hoursPlayed?: number | null;
  /** Fecha en que se empezó a jugar (ISO) */
  startedAt?: string | null;
  /** Fecha en que se terminó de jugar (ISO) */
  finishedAt?: string | null;
  /** Número de logros desbloqueados */
  achievementsUnlocked?: number | null;
}

/**
 * Entrada del tracker tal como la consume la interfaz.
 * Combina datos de user_item_tracking con metadatos de catalog_items.
 */
export interface TrackerEntry {
  /** Slug del ítem (clave primaria en el tracker del usuario) */
  itemId: string;
  /** UUID del ítem en catalog_items, o null si aún no se resolvió */
  catalogItemId: string | null;
  /** Categoría del ítem */
  category: string;
  /** Estado actual en el tracker */
  status: TrackerStatus;
  /** Puntuación del usuario (1-10), o null si no se ha puntuado */
  rating: number | null;
  /** Reseña escrita por el usuario */
  review: string;
  /** Fecha en que se añadió al tracker (ISO) */
  addedAt: string;
  /** Fecha de la última actualización (ISO) */
  updatedAt: string;
  /** Metadatos de seguimiento específicos de la categoría */
  metadata: UserTrackingMetadata;
  /** Título legible del ítem */
  title: string;
  /** URL de la portada */
  cover: string;
  /** Año de lanzamiento */
  year: number;
  /** Género principal */
  genre: string;
  /** Plataforma de juego (solo videojuegos) */
  playingPlatform: string | null;
  /** Horas de juego (solo videojuegos) */
  hoursPlayed: number | null;
  /** Fecha de inicio (solo videojuegos) */
  startedAt: string | null;
  /** Fecha de fin (solo videojuegos) */
  finishedAt: string | null;
  /** Logros desbloqueados (solo videojuegos) */
  achievementsUnlocked: number | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const CATALOG_ITEM_URL = edgeFunctionUrl('catalog-item');

// ─── Funciones auxiliares ────────────────────────────────────────────────────

/**
 * Busca el ID de catálogo de un ítem en caché local o lo solicita a la Edge Function.
 * La Edge Function crea el ítem en catalog_items si no existe.
 *
 * @param itemSlug Slug del ítem.
 * @param category Categoría del ítem.
 * @returns UUID del ítem en catalog_items, o null si falla.
 */
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
      body: JSON.stringify({ slug: itemSlug, category }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Convierte una fila de user_item_tracking (con su catalog_item enriquecido)
 * en un TrackerEntry normalizado para la interfaz.
 *
 * @param row Fila cruda de user_item_tracking.
 * @param catalogItem Fila opcional de catalog_items con metadatos del ítem.
 * @returns TrackerEntry normalizado.
 */
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

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona el tracker personal del usuario autenticado.
 *
 * Responsabilidades:
 * - Cargar todas las entradas del usuario desde user_item_tracking.
 * - Enriquecer cada entrada con datos de catalog_items (título, portada, año).
 * - Añadir o actualizar entradas con actualizaciones optimistas.
 * - Eliminar entradas con rollback ante error.
 * - Resolver IDs de catálogo via Edge Function cuando el ítem es nuevo.
 */
export function useTracker() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const { user, isLoggedIn } = useAuth();
  const [entries, setEntries] = useState<Record<string, TrackerEntry>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Carga de datos ──────────────────────────────────────────────────────────

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

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isLoggedIn && user) {
      loadEntries();
    } else {
      setEntries({});
    }
  }, [isLoggedIn, user, loadEntries]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Devuelve la entrada del tracker para un ítem, o null si no está añadido.
   *
   * @param itemId Slug del ítem.
   */
  const getEntry = useCallback(
    (itemId: string): TrackerEntry | null => entries[itemId] ?? null,
    [entries],
  );

  /**
   * Crea o actualiza la entrada de un ítem en el tracker del usuario.
   * Aplica la actualización de forma optimista y hace rollback si falla.
   *
   * @param itemId Slug del ítem.
   * @param category Categoría del ítem.
   * @param status Estado a asignar.
   * @param rating Puntuación (1-10), o null.
   * @param review Texto de la reseña.
   * @param gameData Datos adicionales de videojuego (opcional).
   * @param metadata Metadatos de seguimiento específicos de categoría (opcional).
   * @returns true si la operación fue exitosa, false si falló.
   */
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

      // Actualización optimista
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

      // Para actualizaciones, reutiliza el ID de catálogo conocido para evitar
      // una llamada innecesaria a la Edge Function.
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

  /**
   * Elimina un ítem del tracker del usuario.
   *
   * @param itemId Slug del ítem a eliminar.
   * @returns true si se eliminó correctamente, false si falló.
   */
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

  /**
   * Indica si un ítem está en el tracker del usuario.
   *
   * @param itemId Slug del ítem.
   */
  const isTracked = useCallback((itemId: string) => Boolean(entries[itemId]), [entries]);

  return { entries, getEntry, addOrUpdate, remove, isTracked, loading, error };
}
