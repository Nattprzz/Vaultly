import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES } from '@/mocks/catalog';

export interface ReviewEntry {
  id: string;
  user_id: string;
  item_slug: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  categoryAccent: string;
  rating: number;
  review: string;
  updated_at: string;
  // profile info (for public display)
  display_name?: string;
  initials?: string;
}

function getCatMeta(catId: string) {
  return CATEGORIES.find(c => c.id === catId) ?? { label: catId, icon: 'ri-stack-line', accent: '#6b7280' };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Hook: reviews for the current logged-in user (from user_item_tracking)
export function useMyReviews() {
  const { user } = useAuth();
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
      setReviews(data.map(r => {
        const meta = getCatMeta(r.category ?? '');
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
        };
      }));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return { reviews, loading, refresh: load };
}

// Hook: reviews for a public profile (by user_id, from user_item_tracking)
export function usePublicReviews(userId: string | null) {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('user_item_tracking')
        .select('id, user_id, item_slug, category, rating, review, updated_at')
        .eq('user_id', userId)
        .not('review', 'is', null)
        .neq('review', '')
        .not('rating', 'is', null)
        .order('updated_at', { ascending: false });

      if (data) {
        setReviews(data.map(r => {
          const meta = getCatMeta(r.category ?? '');
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
          };
        }));
      }
      setLoading(false);
    };

    load();
  }, [userId]);

  return { reviews, loading };
}

// Hook: community reviews for a specific item (from user_item_tracking by item_slug)
export function useItemReviews(itemSlug: string) {
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
        .select('id, display_name, initials')
        .in('id', userIds);

      const profileMap: Record<string, { display_name: string; initials: string }> = {};
      profiles?.forEach(p => { profileMap[p.id] = p; });

      const meta = getCatMeta(trackingData[0]?.category ?? '');
      setReviews(trackingData.map(r => ({
        id: r.id,
        user_id: r.user_id,
        item_slug: r.item_slug ?? itemSlug,
        category: r.category ?? '',
        categoryLabel: meta.label,
        categoryIcon: meta.icon,
        categoryAccent: meta.accent,
        rating: Number(r.rating),
        review: r.review,
        updated_at: r.updated_at,
        display_name: profileMap[r.user_id]?.display_name ?? 'Usuario',
        initials: profileMap[r.user_id]?.initials ?? '??',
      })));
      setLoading(false);
    };

    load();
  }, [itemSlug]);

  return { reviews, loading };
}

export { formatDate };
