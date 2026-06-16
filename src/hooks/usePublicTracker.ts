/**
 * usePublicTracker.ts — tracker de un usuario con perfil público.
 *
 * Carga las entradas de seguimiento de otro usuario, respetando sus flags
 * de privacidad (is_public, share_tracker, show_ratings, show_reviews, show_item_status).
 * Si el perfil no es público o no comparte el tracker, el hook devuelve hidden=true.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useCategories } from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CategoryConfig } from '@/lib/categoryConfig';
import type { PublicPrivacyFlags } from '@/types/privacy';

/**
 * Entrada del tracker de un usuario público, con metadatos de categoría e ítem.
 * Los campos de rating, review y status pueden ser null si la privacidad los oculta.
 */
export interface PublicEntry {
  /** ID de la fila en user_item_tracking */
  id: string;
  /** Slug del ítem */
  item_slug: string;
  /** Categoría del ítem */
  category: string;
  /** Nombre legible de la categoría */
  categoryLabel: string;
  /** Icono de la categoría */
  categoryIcon: string;
  /** Color de acento de la categoría */
  categoryAccent: string;
  /** Estado del ítem, o null si la privacidad lo oculta */
  status: string | null;
  /** Puntuación, o null si la privacidad lo oculta */
  rating: number | null;
  /** Reseña, o null si la privacidad la oculta */
  review: string | null;
  /** Fecha de la última actualización (ISO) */
  updated_at: string;
  /** Título del ítem */
  title: string;
  /** URL de la portada */
  cover: string;
  /** Año de lanzamiento */
  year: number;
  /** Género principal */
  genre: string;
}

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function getCatMeta(catId: string, categories: CategoryConfig[]) {
  return categories.find(c => c.id === catId) ?? { label: catId, icon: 'ri-stack-line', accent: '#6b7280' };
}

function canReadPublicTracker(privacy?: PublicPrivacyFlags | null) {
  return Boolean(privacy?.is_public && privacy.share_tracker);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Carga el tracker de un usuario con perfil público.
 *
 * Responsabilidades:
 * - Verificar los flags de privacidad antes de consultar la base de datos.
 * - Enriquecer cada entrada con datos de catalog_items.
 * - Filtrar campos sensibles (rating, review, status) según la privacidad.
 *
 * @param userId UUID del usuario propietario del tracker.
 * @param privacy Flags de privacidad del perfil a consultar.
 */
export function usePublicTracker(userId: string | null, privacy?: PublicPrivacyFlags | null) {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const categories = useCategories();
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [loading, setLoading] = useState(true);
  /** true si el usuario existe pero su privacidad impide mostrar el tracker. */
  const [hidden, setHidden] = useState(false);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!userId || !canReadPublicTracker(privacy)) {
      setEntries([]);
      setHidden(Boolean(userId));
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setHidden(false);
      setEntries([]);
      const { data } = await supabase
        .from('public_user_item_tracking')
        .select('id, item_id, item_slug, category, status_en, rating, review, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (data) {
        const slugs = [...new Set(data.map(row => row.item_slug).filter(Boolean))];
        const catalogBySlug = new Map<string, Record<string, unknown>>();

        if (slugs.length > 0) {
          const { data: catalogRows } = await supabase
            .from('catalog_items')
            .select('id, slug, title, image_url, cover_url, release_date, metadata')
            .in('slug', slugs);

          catalogRows?.forEach(item => {
            catalogBySlug.set(item.slug, item as Record<string, unknown>);
          });
        }

        setEntries(data.map(r => {
          const meta = getCatMeta(r.category ?? '', categories);
          const catalogItem = catalogBySlug.get(r.item_slug ?? '');
          const metadata = (catalogItem?.metadata as Record<string, unknown> | undefined) ?? {};
          const genres = metadata.genres;
          const genre = Array.isArray(genres) ? String(genres[0] ?? '') : String(metadata.genre ?? '');
          const releaseDate = catalogItem?.release_date as string | null | undefined;
          return {
            id: r.id,
            item_slug: r.item_slug ?? r.id,
            category: r.category ?? '',
            categoryLabel: meta.label,
            categoryIcon: meta.icon,
            categoryAccent: meta.accent,
            status: privacy?.show_item_status === false ? null : r.status_en ?? 'pending',
            rating: privacy?.show_ratings ? r.rating != null ? Number(r.rating) : null : null,
            review: privacy?.show_reviews ? r.review ?? null : null,
            updated_at: r.updated_at,
            title: (catalogItem?.title as string) ?? String(r.item_slug ?? '').replace(/-/g, ' '),
            cover: (catalogItem?.image_url as string | null) ?? (catalogItem?.cover_url as string | null) ?? '',
            year: releaseDate ? Number(releaseDate.slice(0, 4)) : 0,
            genre,
          };
        }));
      } else {
        setEntries([]);
      }
      setLoading(false);
    };

    load();
  // Listing individual privacy fields instead of the privacy object avoids re-runs
  // when the parent re-renders without actual privacy value changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, privacy?.is_public, privacy?.share_tracker, privacy?.show_ratings, privacy?.show_reviews, privacy?.show_item_status, categories]);

  return { entries, loading, hidden };
}
