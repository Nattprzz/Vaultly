import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategoryColors';
import type { CategoryConfig } from '@/lib/categoryConfig';
import type { PublicPrivacyFlags } from '@/types/privacy';

export interface ReviewEntry {
  id: string;
  user_id: string;
  item_slug: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  categoryAccent: string;
  rating: number | null;
  review: string;
  updated_at: string;
  title: string;
  cover: string;
  // profile info (for public display)
  display_name?: string;
  initials?: string;
}

function getCatMeta(catId: string, categories: CategoryConfig[]) {
  return categories.find(c => c.id === catId) ?? { label: catId, icon: 'ri-stack-line', accent: '#6b7280' };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Hook: reviews for the current logged-in user (from user_item_tracking)
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

// Hook: reviews for a public profile (by user_id, from user_item_tracking)
export function usePublicReviews(userId: string | null, privacy?: PublicPrivacyFlags | null) {
  const categories = useCategories();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
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
        .from('user_item_tracking')
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

// Hook: community reviews for a specific item (from user_item_tracking by item_slug)
export function useItemReviews(itemSlug: string) {
  const categories = useCategories();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemSlug) return;

    const load = async () => {
      setLoading(true);
      // Get tracking entries with reviews for this item
      const { data: trackingData } = await supabase
        .from('user_item_tracking')
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

      // Fetch profile info for each reviewer
      const userIds = [...new Set(trackingData.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
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

export { formatDate };
