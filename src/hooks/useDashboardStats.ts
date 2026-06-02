import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES } from '@/mocks/catalog';

export interface DashboardStats {
  total_tracked: number;
  completed: number;
  in_progress: number;
  pending: number;
  dropped: number;
  avg_rating: number | null;
  reviews_written: number;
}

export interface CategoryStat {
  id: string;
  label: string;
  icon: string;
  accent: string;
  total: number;
  completed: number;
  in_progress: number;
  avg_rating: number | null;
}

export interface RecentActivityItem {
  id: string;
  item_slug: string;
  category: string;
  categoryLabel: string;
  icon: string;
  accent: string;
  status_en: string;
  rating: number | null;
  updated_at: string;
}

export interface CurrentlyTrackingItem {
  id: string;
  item_slug: string;
  category: string;
  icon: string;
  accent: string;
  updated_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} día${days !== 1 ? 's' : ''}`;
  const weeks = Math.floor(days / 7);
  return `Hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'completed':   return 'Completó';
    case 'in_progress': return 'Empezó';
    case 'pending':     return 'Añadió a pendientes';
    case 'dropped':     return 'Abandonó';
    default:            return 'Actualizó';
  }
}

function getCatMeta(catId: string) {
  return CATEGORIES.find(c => c.id === catId) ?? {
    label: catId,
    icon: 'ri-stack-line',
    accent: '#6b7280',
  };
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [currentlyTracking, setCurrentlyTracking] = useState<CurrentlyTrackingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      const { data: rows, error } = await supabase
        .from('user_item_tracking')
        .select('id, item_slug, category, status_en, rating, review, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error || !rows) {
        setLoading(false);
        return;
      }

      // --- Global stats ---
      const total = rows.length;
      const completed = rows.filter(r => r.status_en === 'completed').length;
      const inProgress = rows.filter(r => r.status_en === 'in_progress').length;
      const pending = rows.filter(r => r.status_en === 'pending').length;
      const dropped = rows.filter(r => r.status_en === 'dropped').length;
      const rated = rows.filter(r => r.rating != null);
      const avgRating = rated.length > 0
        ? Math.round((rated.reduce((s, r) => s + Number(r.rating), 0) / rated.length) * 10) / 10
        : null;
      const reviewsWritten = rows.filter(r => r.review && r.review.trim().length > 0).length;

      setStats({ total_tracked: total, completed, in_progress: inProgress, pending, dropped, avg_rating: avgRating, reviews_written: reviewsWritten });

      // --- Category stats ---
      const catMap: Record<string, { total: number; completed: number; in_progress: number; ratings: number[] }> = {};
      rows.forEach(r => {
        const cat = r.category ?? 'unknown';
        if (!catMap[cat]) catMap[cat] = { total: 0, completed: 0, in_progress: 0, ratings: [] };
        catMap[cat].total++;
        if (r.status_en === 'completed') catMap[cat].completed++;
        if (r.status_en === 'in_progress') catMap[cat].in_progress++;
        if (r.rating != null) catMap[cat].ratings.push(Number(r.rating));
      });

      const catStats: CategoryStat[] = Object.entries(catMap)
        .filter(([, v]) => v.total > 0)
        .map(([catId, v]) => {
          const meta = getCatMeta(catId);
          return {
            id: catId,
            label: meta.label,
            icon: meta.icon,
            accent: meta.accent,
            total: v.total,
            completed: v.completed,
            in_progress: v.in_progress,
            avg_rating: v.ratings.length > 0
              ? Math.round((v.ratings.reduce((s, r) => s + r, 0) / v.ratings.length) * 10) / 10
              : null,
          };
        })
        .sort((a, b) => b.total - a.total);

      setCategoryStats(catStats);

      // --- Recent activity (last 8 updated) ---
      const recent: RecentActivityItem[] = rows.slice(0, 8).map(r => {
        const meta = getCatMeta(r.category ?? '');
        return {
          id: r.id,
          item_slug: r.item_slug ?? r.id,
          category: r.category ?? '',
          categoryLabel: meta.label,
          icon: meta.icon,
          accent: meta.accent,
          status_en: r.status_en ?? 'pending',
          rating: r.rating != null ? Number(r.rating) : null,
          updated_at: r.updated_at,
        };
      });
      setRecentActivity(recent);

      // --- Currently tracking (in_progress, last 4) ---
      const inProgressRows = rows
        .filter(r => r.status_en === 'in_progress')
        .slice(0, 4);

      const currently: CurrentlyTrackingItem[] = inProgressRows.map(r => {
        const meta = getCatMeta(r.category ?? '');
        return {
          id: r.id,
          item_slug: r.item_slug ?? r.id,
          category: r.category ?? '',
          icon: meta.icon,
          accent: meta.accent,
          updated_at: r.updated_at,
        };
      });
      setCurrentlyTracking(currently);

      setLoading(false);
    };

    load();
  }, [user]);

  return { stats, categoryStats, recentActivity, currentlyTracking, loading };
}

export { timeAgo, statusLabel };
