/**
 * useDashboardStats.ts — estadísticas agregadas del dashboard personal.
 *
 * Consulta user_item_tracking y catalog_items para calcular totales globales,
 * estadísticas por categoría, actividad reciente, ítems en progreso y
 * actividad semanal del usuario autenticado.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CategoryConfig } from '@/lib/categoryConfig';
import {
  SEMANTIC_GROUPS,
  getActionText,
} from '@/constants/tracker-statuses';
import type { CategoryStatus } from '@/constants/tracker-statuses';

/**
 * Totales globales del tracker del usuario.
 */
export interface DashboardStats {
  /** Total de ítems en el tracker */
  total_tracked: number;
  /** Total de ítems en estado "completado" (semántico) */
  completed: number;
  /** Total de ítems en estado "en progreso" (semántico) */
  in_progress: number;
  /** Total de ítems en estado "pendiente" o "wishlist" */
  pending: number;
  /** Total de ítems abandonados o perdidos */
  dropped: number;
  /** Puntuación media de todos los ítems puntuados */
  avg_rating: number | null;
  /** Número de reseñas escritas */
  reviews_written: number;
}

/**
 * Estadísticas de una categoría concreta del tracker.
 */
export interface CategoryStat {
  /** Identificador de la categoría */
  id: string;
  /** Nombre legible */
  label: string;
  /** Clase de icono remixicon */
  icon: string;
  /** Color de acento de la categoría */
  accent: string;
  /** Total de ítems en esta categoría */
  total: number;
  /** Ítems completados */
  completed: number;
  /** Ítems en progreso */
  in_progress: number;
  /** Puntuación media de los ítems puntuados */
  avg_rating: number | null;
}

/**
 * Ítem de actividad reciente del usuario.
 */
export interface RecentActivityItem {
  /** ID de la fila en user_item_tracking */
  id: string;
  /** Slug del ítem */
  item_slug: string;
  /** Título legible del ítem */
  title: string;
  /** Categoría del ítem */
  category: string;
  /** Nombre legible de la categoría */
  categoryLabel: string;
  /** Icono de la categoría */
  icon: string;
  /** Color de acento de la categoría */
  accent: string;
  /** Estado actual del ítem */
  status_en: string;
  /** Puntuación, o null si no se ha puntuado */
  rating: number | null;
  /** Fecha de la última actualización (ISO) */
  updated_at: string;
}

/**
 * Ítem que el usuario tiene actualmente en progreso.
 */
export interface CurrentlyTrackingItem {
  /** ID de la fila en user_item_tracking */
  id: string;
  /** Slug del ítem */
  item_slug: string;
  /** Título legible del ítem */
  title: string;
  /** URL de la portada, o null si no está disponible */
  cover: string | null;
  /** Categoría del ítem */
  category: string;
  /** Icono de la categoría */
  icon: string;
  /** Color de acento de la categoría */
  accent: string;
  /** Fecha de la última actualización (ISO) */
  updated_at: string;
}

/**
 * Punto de datos de la gráfica de actividad semanal.
 */
export interface WeeklyActivityPoint {
  /** Inicial del día de la semana (L, M, X, J, V, S, D) */
  day: string;
  /** Número de ítems actualizados ese día */
  count: number;
}

/**
 * Fila cruda de user_item_tracking (solo campos necesarios para el gráfico de actividad).
 */
export interface RawTrackingRow {
  category: string;
  status_en: string;
  updated_at: string;
}

// ─── Funciones auxiliares ────────────────────────────────────────────────────

/**
 * Devuelve el tiempo transcurrido desde una fecha en texto legible.
 *
 * @param dateStr Fecha en formato ISO.
 * @returns Cadena como "Hace 3 días" o "Hace 2 semanas".
 */
export function timeAgo(dateStr: string): string {
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

/** @deprecated Usar getActionText de @/constants/tracker-statuses */
export function statusLabel(status: string): string {
  return getActionText(status);
}

function getCatMeta(catId: string, categories: CategoryConfig[]) {
  return categories.find(c => c.id === catId) ?? {
    label: catId,
    icon: 'ri-stack-line',
    accent: '#6b7280',
  };
}

interface CatalogRow {
  title:     string;
  image_url: string | null;
  metadata:  Record<string, unknown> | null;
}

/**
 * Intenta obtener el título de un ítem a partir del catálogo o del slug.
 * Capitaliza el slug si no hay título disponible.
 *
 * @param slug Slug del ítem.
 * @param item Fila opcional de catalog_items.
 * @returns Título legible.
 */
function resolveTitle(slug: string, item?: CatalogRow | null): string {
  if (item?.title) return item.title;
  const meta = item?.metadata;
  if (meta?.title)          return String(meta.title);
  if (meta?.name)           return String(meta.name);
  if (meta?.original_title) return String(meta.original_title);
  const humanized = String(slug ?? '').replace(/-/g, ' ').trim();
  if (/^[a-z]+ \d{4,}$/i.test(humanized)) return 'Elemento sin título';
  return humanized.replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Calcula y expone las estadísticas completas del dashboard del usuario.
 *
 * Responsabilidades:
 * - Cargar todos los registros de user_item_tracking del usuario.
 * - Enriquecer con títulos y portadas de catalog_items.
 * - Calcular totales globales, por categoría, actividad reciente e ítems en curso.
 * - Generar los puntos de la gráfica de actividad de los últimos 7 días.
 */
export function useDashboardStats() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const { user } = useAuth();
  const categories = useCategories();
  const [stats,             setStats]             = useState<DashboardStats | null>(null);
  const [categoryStats,     setCategoryStats]     = useState<CategoryStat[]>([]);
  const [recentActivity,    setRecentActivity]    = useState<RecentActivityItem[]>([]);
  const [currentlyTracking, setCurrentlyTracking] = useState<CurrentlyTrackingItem[]>([]);
  const [weeklyActivity,    setWeeklyActivity]    = useState<WeeklyActivityPoint[]>([]);
  const [rawRows,           setRawRows]           = useState<RawTrackingRow[]>([]);
  const [loading,           setLoading]           = useState(true);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      const { data: rows, error } = await supabase
        .from('user_item_tracking')
        .select('id, item_slug, category, status_en, rating, review, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error || !rows) { setLoading(false); return; }

      // Enriquecer slugs con títulos de catálogo
      const slugs = [...new Set(rows.map(r => r.item_slug).filter(Boolean))];
      const catalogMap = new Map<string, CatalogRow>();
      if (slugs.length > 0) {
        const { data: catalogRows } = await supabase
          .from('catalog_items')
          .select('slug, title, image_url, metadata')
          .in('slug', slugs);
        catalogRows?.forEach(item => {
          catalogMap.set(item.slug, {
            title:     item.title,
            image_url: item.image_url,
            metadata:  item.metadata as Record<string, unknown> | null,
          });
        });
      }

      // ─── Datos derivados ─────────────────────────────────────────────────────

      const isCompleted  = (s: string) => SEMANTIC_GROUPS.completed.includes(s as CategoryStatus);
      const isActive     = (s: string) => SEMANTIC_GROUPS.active.includes(s as CategoryStatus);
      const isPending    = (s: string) => SEMANTIC_GROUPS.pending.includes(s as CategoryStatus);
      const isAbandoned  = (s: string) => SEMANTIC_GROUPS.abandoned.includes(s as CategoryStatus);

      // Totales globales
      const total          = rows.length;
      const completed      = rows.filter(r => isCompleted(r.status_en)).length;
      const inProgress     = rows.filter(r => isActive(r.status_en)).length;
      const pending        = rows.filter(r => isPending(r.status_en)).length;
      const dropped        = rows.filter(r => isAbandoned(r.status_en)).length;
      const rated          = rows.filter(r => r.rating != null);
      const avgRating      = rated.length > 0
        ? Math.round((rated.reduce((s, r) => s + Number(r.rating), 0) / rated.length) * 10) / 10
        : null;
      const reviewsWritten = rows.filter(r => r.review?.trim().length > 0).length;

      setStats({
        total_tracked: total, completed, in_progress: inProgress,
        pending, dropped, avg_rating: avgRating, reviews_written: reviewsWritten,
      });

      // Estadísticas por categoría
      const catMap: Record<string, { total: number; completed: number; in_progress: number; ratings: number[] }> = {};
      rows.forEach(r => {
        const cat = r.category ?? 'unknown';
        if (!catMap[cat]) catMap[cat] = { total: 0, completed: 0, in_progress: 0, ratings: [] };
        catMap[cat].total++;
        if (isCompleted(r.status_en))  catMap[cat].completed++;
        if (isActive(r.status_en))     catMap[cat].in_progress++;
        if (r.rating != null)          catMap[cat].ratings.push(Number(r.rating));
      });

      const catStats: CategoryStat[] = Object.entries(catMap)
        .filter(([, v]) => v.total > 0)
        .map(([catId, v]) => {
          const meta = getCatMeta(catId, categories);
          return {
            id:          catId,
            label:       meta.label,
            icon:        meta.icon,
            accent:      meta.accent,
            total:       v.total,
            completed:   v.completed,
            in_progress: v.in_progress,
            avg_rating:  v.ratings.length > 0
              ? Math.round((v.ratings.reduce((s, r) => s + r, 0) / v.ratings.length) * 10) / 10
              : null,
          };
        })
        .sort((a, b) => b.total - a.total);
      setCategoryStats(catStats);

      // Actividad reciente (últimos 8 ítems actualizados)
      const recent: RecentActivityItem[] = rows.slice(0, 8).map(r => {
        const meta = getCatMeta(r.category ?? '', categories);
        const catalogItem = catalogMap.get(r.item_slug ?? '');
        return {
          id:            r.id,
          item_slug:     r.item_slug ?? r.id,
          title:         resolveTitle(r.item_slug ?? r.id, catalogItem),
          category:      r.category ?? '',
          categoryLabel: meta.label,
          icon:          meta.icon,
          accent:        meta.accent,
          status_en:     r.status_en ?? 'pending',
          rating:        r.rating != null ? Number(r.rating) : null,
          updated_at:    r.updated_at,
        };
      });
      setRecentActivity(recent);

      // Ítems en progreso activo (máximo 4)
      const activeRows = rows.filter(r => isActive(r.status_en)).slice(0, 4);
      const currently: CurrentlyTrackingItem[] = activeRows.map(r => {
        const meta = getCatMeta(r.category ?? '', categories);
        const catalogItem = catalogMap.get(r.item_slug ?? '');
        return {
          id:         r.id,
          item_slug:  r.item_slug ?? r.id,
          title:      resolveTitle(r.item_slug ?? r.id, catalogItem),
          cover:      catalogItem?.image_url ?? null,
          category:   r.category ?? '',
          icon:       meta.icon,
          accent:     meta.accent,
          updated_at: r.updated_at,
        };
      });
      setCurrentlyTracking(currently);

      // Filas crudas para el gráfico de barras externo
      setRawRows(rows.map(r => ({
        category:   r.category ?? '',
        status_en:  r.status_en ?? 'pending',
        updated_at: r.updated_at,
      })));

      // Actividad de los últimos 7 días para la gráfica semanal
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });
      const weekly = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
        const dayEnd   = new Date(date); dayEnd.setHours(23, 59, 59, 999);
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
