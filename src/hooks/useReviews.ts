/**
 * useReviews.ts — hooks para reseñas de ítems del catálogo.
 *
 * Exporta tres hooks especializados:
 * - useMyReviews: reseñas del usuario autenticado.
 * - usePublicReviews: reseñas de un perfil público (con filtros de privacidad).
 * - useItemReviews: reseñas de la comunidad para un ítem concreto.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CategoryConfig } from '@/lib/categoryConfig';
import type { PublicPrivacyFlags } from '@/types/privacy';

/**
 * Reseña enriquecida con metadatos de categoría e información del ítem.
 */
export interface ReviewEntry {
  /** ID de la fila en user_item_tracking */
  id: string;
  /** ID del usuario que escribió la reseña */
  user_id: string;
  /** Slug del ítem reseñado */
  item_slug: string;
  /** Categoría del ítem */
  category: string;
  /** Nombre legible de la categoría */
  categoryLabel: string;
  /** Icono de la categoría */
  categoryIcon: string;
  /** Color de acento de la categoría */
  categoryAccent: string;
  /** Puntuación del usuario (null si la privacidad lo oculta) */
  rating: number | null;
  /** Texto de la reseña */
  review: string;
  /** Fecha de la última actualización (ISO) */
  updated_at: string;
  /** Título del ítem reseñado */
  title: string;
  /** URL de la portada del ítem */
  cover: string;
  /** Nombre visible del revisor (para reseñas de comunidad) */
  display_name?: string;
  /** Iniciales del revisor (para reseñas de comunidad) */
  initials?: string;
}

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function getCatMeta(catId: string, categories: CategoryConfig[]) {
  return categories.find(c => c.id === catId) ?? { label: catId, icon: 'ri-stack-line', accent: '#6b7280' };
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Devuelve las reseñas escritas por el usuario autenticado.
 * Solo incluye entradas con reseña y puntuación.
 */
export function useMyReviews() {
  const { user } = useAuth();
  const categories = useCategories();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('user_item_tracking')
      .select('id, user_id, item_slug, category, rating, review, updated_at')
      .eq('user_id', user.id)
      .not('review', 'is', null)
      .neq('review', '')
      .not('rating', 'is', null)
      .order('updated_at', { ascending: false });

    if (data) {
      const slugs = [...new Set(data.map(r => r.item_slug).filter(Boolean))];
      const catalogBySlug = new Map<string, Record<string, unknown>>();
      if (slugs.length > 0) {
        const { data: catalogRows } = await supabase
          .from('catalog_items')
          .select('slug, title, image_url, cover_url')
          .in('slug', slugs);
        catalogRows?.forEach(item => catalogBySlug.set(item.slug, item as Record<string, unknown>));
      }

      setReviews(data.map(r => {
        const meta = getCatMeta(r.category ?? '', categories);
        const item = catalogBySlug.get(r.item_slug ?? '');
        return {
          id: r.id,
          user_id: r.user_id,
          item_slug: r.item_slug ?? r.id,
          category: r.category ?? '',
          categoryLabel: meta.label,
          categoryIcon: meta.icon,
          categoryAccent: meta.accent,
          rating: Number(r.rating),
          review: r.review,
          updated_at: r.updated_at,
          title: (item?.title as string) ?? String(r.item_slug ?? '').replace(/-/g, ' '),
          cover: (item?.image_url as string | null) ?? (item?.cover_url as string | null) ?? '',
        };
      }));
    }
    setLoading(false);
  }, [user, categories]);

  useEffect(() => { load(); }, [load]);

  return { reviews, loading, refresh: load };
}

/**
 * Devuelve las reseñas de un perfil público, respetando sus flags de privacidad.
 * No carga nada si el perfil no existe o es privado.
 *
 * @param userId UUID del usuario propietario del perfil.
 * @param privacy Flags de privacidad del perfil.
 */
export function usePublicReviews(userId: string | null, privacy?: PublicPrivacyFlags | null) {
  const categories = useCategories();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  /** true si el perfil existe pero la privacidad impide mostrar las reseñas. */
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!userId || !privacy?.is_public || !privacy.show_reviews) {
      setReviews([]);
      setHidden(Boolean(userId));
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setHidden(false);
      setReviews([]);
      const { data } = await supabase
        .from('public_user_item_tracking')
        .select('id, user_id, item_slug, category, rating, review, updated_at')
        .eq('user_id', userId)
        .not('review', 'is', null)
        .neq('review', '')
        .not('rating', 'is', null)
        .order('updated_at', { ascending: false });

      if (data) {
        const slugs = [...new Set(data.map(r => r.item_slug).filter(Boolean))];
        const catalogBySlug = new Map<string, Record<string, unknown>>();
        if (slugs.length > 0) {
          const { data: catalogRows } = await supabase
            .from('catalog_items')
            .select('slug, title, image_url, cover_url')
            .in('slug', slugs);
          catalogRows?.forEach(item => catalogBySlug.set(item.slug, item as Record<string, unknown>));
        }

        setReviews(data.map(r => {
          const meta = getCatMeta(r.category ?? '', categories);
          const item = catalogBySlug.get(r.item_slug ?? '');
          return {
            id: r.id,
            user_id: r.user_id,
            item_slug: r.item_slug ?? r.id,
            category: r.category ?? '',
            categoryLabel: meta.label,
            categoryIcon: meta.icon,
            categoryAccent: meta.accent,
            rating: privacy.show_ratings ? Number(r.rating) : null,
            review: r.review,
            updated_at: r.updated_at,
            title: (item?.title as string) ?? String(r.item_slug ?? '').replace(/-/g, ' '),
            cover: (item?.image_url as string | null) ?? (item?.cover_url as string | null) ?? '',
          };
        }));
      } else {
        setReviews([]);
      }
      setLoading(false);
    };

    load();
  }, [userId, privacy?.is_public, privacy?.show_reviews, privacy?.show_ratings, categories]);

  return { reviews, loading, hidden };
}

/**
 * Devuelve las reseñas de la comunidad para un ítem concreto.
 * Solo incluye reseñas de usuarios con perfiles públicos que permiten mostrar reseñas.
 *
 * @param itemSlug Slug del ítem del catálogo.
 */
export function useItemReviews(itemSlug: string) {
  const categories = useCategories();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemSlug) return;

    const load = async () => {
      setLoading(true);

      const { data: trackingData } = await supabase
        .from('public_user_item_tracking')
        .select('id, user_id, item_slug, category, rating, review, updated_at')
        .eq('item_slug', itemSlug)
        .not('review', 'is', null)
        .neq('review', '')
        .not('rating', 'is', null)
        .order('updated_at', { ascending: false });

      if (!trackingData || trackingData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      // Obtener perfiles de los autores (solo los que permiten reseñas públicas)
      const userIds = [...new Set(trackingData.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('public_profiles')
        .select('id, display_name, initials, is_public, show_reviews, show_ratings')
        .in('id', userIds);

      const profileMap: Record<string, { display_name: string; initials: string; show_ratings: boolean }> = {};
      profiles
        ?.filter(p => p.is_public && p.show_reviews)
        .forEach(p => {
          profileMap[p.id] = {
            display_name: p.display_name,
            initials: p.initials,
            show_ratings: p.show_ratings,
          };
        });

      const meta = getCatMeta(trackingData[0]?.category ?? '', categories);
      const { data: catalogItem } = await supabase
        .from('catalog_items')
        .select('slug, title, image_url, cover_url')
        .eq('slug', itemSlug)
        .maybeSingle();

      setReviews(trackingData.filter(r => profileMap[r.user_id]).map(r => ({
        id: r.id,
        user_id: r.user_id,
        item_slug: r.item_slug ?? itemSlug,
        category: r.category ?? '',
        categoryLabel: meta.label,
        categoryIcon: meta.icon,
        categoryAccent: meta.accent,
        rating: profileMap[r.user_id]?.show_ratings ? Number(r.rating) : null,
        review: r.review,
        updated_at: r.updated_at,
        title: catalogItem?.title ?? itemSlug.replace(/-/g, ' '),
        cover: catalogItem?.image_url ?? catalogItem?.cover_url ?? '',
        display_name: profileMap[r.user_id]?.display_name ?? 'Usuario',
        initials: profileMap[r.user_id]?.initials ?? '??',
      })));
      setLoading(false);
    };

    load();
  }, [itemSlug, categories]);

  return { reviews, loading };
}
