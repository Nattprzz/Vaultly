import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCategories } from '@/hooks/useCategoryColors';
import type { CategoryConfig } from '@/lib/categoryConfig';
import type { PublicPrivacyFlags } from '@/types/privacy';

export interface PublicEntry {
  id: string;
  item_slug: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  categoryAccent: string;
  status: string | null;
  rating: number | null;
  review: string | null;
  updated_at: string;
  title: string;
  cover: string;
  year: number;
  genre: string;
}

function getCatMeta(catId: string, categories: CategoryConfig[]) {
  return categories.find(c => c.id === catId) ?? { label: catId, icon: 'ri-stack-line', accent: '#6b7280' };
}

function canReadPublicTracker(privacy?: PublicPrivacyFlags | null) {
  return Boolean(privacy?.is_public && privacy.share_tracker);
}

export function usePublicTracker(userId: string | null, privacy?: PublicPrivacyFlags | null) {
  const categories = useCategories();
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

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
        .from('user_item_tracking')
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
  }, [userId, privacy?.is_public, privacy?.share_tracker, privacy?.show_ratings, privacy?.show_reviews, privacy?.show_item_status, categories]);

  return { entries, loading, hidden };
}
