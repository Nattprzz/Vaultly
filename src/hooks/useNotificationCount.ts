import { useMemo } from 'react';
import { useTracker } from '@/hooks/useTracker';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const STORAGE_KEY = 'vaultly_dismissed_notifications';

function getDismissed(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

export function useNotificationCount(): number {
  const { entries } = useTracker();
  const { stats, loading } = useDashboardStats();

  return useMemo(() => {
    if (!stats || loading) return 0;

    const dismissed = getDismissed();
    const allEntries = Object.values(entries);
    const activeIds: string[] = [];

    const completedNoRating = allEntries.filter(
      e => e.status === 'completed' && e.rating === null
    );
    if (completedNoRating.length > 0) activeIds.push('no-rating');

    const completedNoReview = allEntries.filter(
      e => e.status === 'completed' && (!e.review || e.review.trim().length === 0)
    );
    if (completedNoReview.length >= 3) activeIds.push('no-review');

    if (stats.in_progress > 5) activeIds.push('too-many-in-progress');

    if (stats.completed === 1) activeIds.push('first-completion');

    if (stats.completed === 10) activeIds.push('ten-completions');

    if (stats.pending > 10) activeIds.push('high-pending');

    if (stats.reviews_written === 0 && stats.completed >= 3) activeIds.push('write-first-review');

    return activeIds.filter(id => !dismissed.has(id)).length;
  }, [stats, entries, loading]);
}
