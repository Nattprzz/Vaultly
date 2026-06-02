import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/mocks/catalog';

export interface PublicEntry {
  id: string;
  item_slug: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  categoryAccent: string;
  status: string;
  rating: number | null;
  review: string | null;
  updated_at: string;
}

function getCatMeta(catId: string) {
  return CATEGORIES.find(c => c.id === catId) ?? { label: catId, icon: 'ri-stack-line', accent: '#6b7280' };
}

export function usePublicTracker(userId: string | null) {
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('user_item_tracking')
        .select('id, item_slug, category, status_en, rating, review, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (data) {
        setEntries(data.map(r => {
          const meta = getCatMeta(r.category ?? '');
          return {
            id: r.id,
            item_slug: r.item_slug ?? r.id,
            category: r.category ?? '',
            categoryLabel: meta.label,
            categoryIcon: meta.icon,
            categoryAccent: meta.accent,
            status: r.status_en ?? 'pending',
            rating: r.rating != null ? Number(r.rating) : null,
            review: r.review ?? null,
            updated_at: r.updated_at,
          };
        }));
      }
      setLoading(false);
    };

    load();
  }, [userId]);

  return { entries, loading };
}
