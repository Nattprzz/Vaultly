import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export type TrackerStatus = 'pending' | 'in_progress' | 'completed' | 'dropped';

export interface TrackerEntry {
  itemId: string;
  category: string;
  status: TrackerStatus;
  rating: number | null;
  review: string;
  addedAt: string;
  updatedAt: string;
}

// Map DB row → TrackerEntry
function rowToEntry(row: Record<string, unknown>): TrackerEntry {
  return {
    itemId: (row.item_slug as string) ?? (row.id as string),
    category: (row.category as string) ?? '',
    status: (row.status_en as TrackerStatus) ?? 'pending',
    rating: row.rating != null ? Number(row.rating) : null,
    review: (row.review as string) ?? '',
    addedAt: (row.created_at as string) ?? new Date().toISOString(),
    updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
  };
}

export function useTracker() {
  const { user, isLoggedIn } = useAuth();
  const [entries, setEntries] = useState<Record<string, TrackerEntry>>({});
  const [loading, setLoading] = useState(false);

  // Load all entries for the current user
  const loadEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('user_item_tracking')
      .select('id, item_slug, category, status_en, rating, review, created_at, updated_at')
      .eq('user_id', user.id);

    if (!error && data) {
      const map: Record<string, TrackerEntry> = {};
      data.forEach((row: Record<string, unknown>) => {
        const entry = rowToEntry(row);
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
    async (itemId: string, category: string, status: TrackerStatus, rating: number | null, review: string) => {
      if (!user) return;

      const now = new Date().toISOString();
      const existing = entries[itemId];

      // Optimistic update
      const optimistic: TrackerEntry = {
        itemId,
        category,
        status,
        rating,
        review,
        addedAt: existing?.addedAt ?? now,
        updatedAt: now,
      };
      setEntries(prev => ({ ...prev, [itemId]: optimistic }));

      // Check if row exists in DB
      const { data: existingRow } = await supabase
        .from('user_item_tracking')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_slug', itemId)
        .maybeSingle();

      if (existingRow) {
        await supabase
          .from('user_item_tracking')
          .update({
            status_en: status,
            rating: rating,
            review: review,
            category: category,
            updated_at: now,
          })
          .eq('id', existingRow.id);
      } else {
        await supabase
          .from('user_item_tracking')
          .insert({
            user_id: user.id,
            item_slug: itemId,
            category: category,
            status_en: status,
            rating: rating,
            review: review,
            created_at: now,
            updated_at: now,
          });
      }
    },
    [user, entries],
  );

  const remove = useCallback(
    async (itemId: string) => {
      if (!user) return;

      // Optimistic remove
      setEntries(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });

      await supabase
        .from('user_item_tracking')
        .delete()
        .eq('user_id', user.id)
        .eq('item_slug', itemId);
    },
    [user],
  );

  const isTracked = useCallback((itemId: string) => Boolean(entries[itemId]), [entries]);

  return { entries, getEntry, addOrUpdate, remove, isTracked, loading };
}
