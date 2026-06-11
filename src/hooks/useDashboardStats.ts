import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategoryColors';
import type { CategoryConfig } from '@/lib/categoryConfig';

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
  title: string;
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
  title: string;
  cover: string | null;
  category: string;
  icon: string;
  accent: string;
  updated_at: string;
}

export interface WeeklyActivityPoint {
  day: string;
  count: number;
}

export interface RawTrackingRow {
  category: string;
  status_en: string;
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

function getCatMeta(catId: string, categories: CategoryConfig[]) {
  return categories.find(c => c.id === catId) ?? {
    label: catId,
    icon: 'ri-stack-line',
    accent: '#6b7280',
  };
}

interface CatalogRow {
  title: string;
  image_url: string | null;
  metadata: Record<string, unknown> | null;
}

function resolveTitle(slug: string, item?: CatalogRow | null): string {
  if (item?.title) return item.title;
  const meta = item?.metadata;
  if (meta?.title)          return String(meta.title);
  if (meta?.name)           return String(meta.name);
  if (meta?.original_title) return String(meta.original_title);
  // Slug humanization — guard against "Category 123456" pattern
  const humanized = String(slug ?? '').replace(/-/g, ' ').trim();
  if (/^[a-z]+ \d{4,}$/i.test(humanized)) return 'Elemento sin título';
  return humanized.replace(/\b\w/g, c => c.toUpperCase());
}

export function useDashboardStats() {
  const { user } = useAuth();
  const categories = useCategories();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [currentlyTracking, setCurrentlyTracking] = useState<CurrentlyTrackingItem[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityPoint[]>([]);
  const [rawRows, setRawRows] = useState<RawTrackingRow[]>([]);
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

      // --- Fetch real titles from catalog_items ---
      const slugs = [...new Set(rows.map(r => r.item_slug).filter(Boolean))];
      const catalogMap = new Map<string, CatalogRow>();
      if (slugs.length > 0) {
        const { data: catalogRows } = await supabase
          .from('catalog_items')
          .select('slug, title, image_url, metadata')
          .in('slug', slugs);
        catalogRows?.forEach(item => {
          catalogMap.set(item.slug, {
            title: item.title,
            image_url: item.image_url,
            metadata: item.metadata as Record<string, unknown> | null,
          });
        });
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
          const meta = getCatMeta(catId, categories);
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
        const meta = getCatMeta(r.category ?? '', categories);
        const catalogItem = catalogMap.get(r.item_slug ?? '');
        return {
          id: r.id,
          item_slug: r.item_slug ?? r.id,
          title: resolveTitle(r.item_slug ?? r.id, catalogItem),
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
      const inProgressRows = rows.filter(r => r.status_en === 'in_progress').slice(0, 4);
      const currently: CurrentlyTrackingItem[] = inProgressRows.map(r => {
        const meta = getCatMeta(r.category ?? '', categories);
        const catalogItem = catalogMap.get(r.item_slug ?? '');
        return {
          id: r.id,
          item_slug: r.item_slug ?? r.id,
          title: resolveTitle(r.item_slug ?? r.id, catalogItem),
          cover: catalogItem?.image_url ?? null,
          category: r.category ?? '',
          icon: meta.icon,
          accent: meta.accent,
          updated_at: r.updated_at,
        };
      });
      setCurrentlyTracking(currently);

      // --- Raw rows (for category-filtered views in page) ---
      setRawRows(rows.map(r => ({
        category: r.category ?? '',
        status_en: r.status_en ?? 'pending',
        updated_at: r.updated_at,
      })));

      // --- Weekly activity (all categories, unfiltered — page computes filtered) ---
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });
      const weekly = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const count = rows.filter(row => {
          const updated = new Date(row.updated_at).getTime();
          return updated >= dayStart.getTime() && updated <= dayEnd.getTime();
        }).length;
        return { day: formatter.format(date).slice(0, 1).toUpperCase(), count };
      });
      setWeeklyActivity(weekly);

      setLoading(false);
    };

    load();
  }, [user, categories]);

  return { stats, categoryStats, recentActivity, currentlyTracking, weeklyActivity, rawRows, loading };
}

export { timeAgo, statusLabel };
