/**
 * useAdminAuditLogs.ts — consulta paginada del registro de auditoría.
 *
 * Carga los registros de admin_audit_logs con soporte para filtros por acción,
 * entidad, actor y rango de fechas. Enriquece cada fila con el username del
 * actor consultando la tabla profiles. Expone las opciones únicas de cada
 * campo de filtro para alimentar los desplegables del panel de administración.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Fila del log de auditoría enriquecida con datos del actor. */
export interface AuditLog {
  /** ID único del registro */
  id: string;
  /** UUID del usuario que realizó la acción, o null si fue el sistema */
  actor_id: string | null;
  /** Acción realizada (create, update, delete, etc.) */
  action: string;
  /** Entidad afectada (catalog_items, profiles, item_reports, etc.) */
  entity: string;
  /** ID del registro afectado, o null si no aplica */
  entity_id: string | null;
  /** Metadatos adicionales de la acción */
  payload: Record<string, unknown> | null;
  /** Fecha de creación del registro (ISO) */
  created_at: string;
  /** Email del actor (puede estar vacío si no está disponible) */
  actor_email?: string;
  /** Nombre de usuario del actor, o "Sistema" si fue automático */
  actor_username?: string;
}

/** Fila raw de admin_audit_logs antes de enriquecerla con datos de perfil. */
interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/** Estado de los filtros activos para el log de auditoría. */
export interface AuditFilters {
  /** Filtrar por acción exacta */
  action: string;
  /** Filtrar por entidad exacta */
  entity: string;
  /** Filtrar por UUID del actor */
  actor_id: string;
  /** Búsqueda de texto libre */
  search: string;
  /** Fecha mínima (ISO, inclusive) */
  dateFrom: string;
  /** Fecha máxima (ISO, inclusive) */
  dateTo: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 30;

const DEFAULT_FILTERS: AuditFilters = {
  action: '',
  entity: '',
  actor_id: '',
  search: '',
  dateFrom: '',
  dateTo: '',
};

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona la carga paginada y filtrada del log de auditoría.
 *
 * Responsabilidades:
 * - Cargar registros de admin_audit_logs con paginación y filtros combinados.
 * - Enriquecer cada fila con el username del actor desde profiles.
 * - Cargar las opciones únicas de acción y entidad para los desplegables de filtro.
 * - Calcular el número de filtros activos para el badge del panel.
 */
export function useAdminAuditLogs() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [actionOptions, setActionOptions] = useState<string[]>([]);
  const [entityOptions, setEntityOptions] = useState<string[]>([]);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadOptions() {
      const [actionsRes, entitiesRes] = await Promise.all([
        supabase.from('admin_audit_logs').select('action').order('action'),
        supabase.from('admin_audit_logs').select('entity').order('entity'),
      ]);
      if (actionsRes.data) {
        const unique = [...new Set(actionsRes.data.map((r) => r.action).filter(Boolean))];
        setActionOptions(unique);
      }
      if (entitiesRes.data) {
        const unique = [...new Set(entitiesRes.data.map((r) => r.entity).filter(Boolean))];
        setEntityOptions(unique);
      }
    }
    loadOptions();
  }, []);

  // ─── Carga de datos ──────────────────────────────────────────────────────────

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('admin_audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (filters.action) query = query.eq('action', filters.action);
      if (filters.entity) query = query.eq('entity', filters.entity);
      if (filters.actor_id) query = query.eq('user_id', filters.actor_id);
      if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setDate(end.getDate() + 1);
        query = query.lt('created_at', end.toISOString());
      }

      const { data, count, error } = await query;
      if (error) throw error;

      const rows = (data ?? []) as AuditLogRow[];
      const actorIds = [...new Set(rows.map((l) => l.user_id).filter(Boolean))] as string[];
      let profileMap: Record<string, { email: string; username: string }> = {};
      if (actorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', actorIds);
        if (profiles) {
          profiles.forEach((p) => {
            profileMap[p.id] = { email: '', username: p.username ?? p.id.slice(0, 8) };
          });
        }
      }

      const enriched: AuditLog[] = rows.map((log) => ({
        id: log.id,
        actor_id: log.user_id,
        action: log.action,
        entity: log.entity,
        entity_id: log.entity_id,
        payload: log.metadata ?? {},
        created_at: log.created_at,
        actor_email: log.user_id ? profileMap[log.user_id]?.email ?? '' : '',
        actor_username: log.user_id ? profileMap[log.user_id]?.username ?? log.user_id.slice(0, 8) : 'Sistema',
      }));

      setLogs(enriched);
      setTotal(count ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const updateFilters = useCallback((partial: Partial<AuditFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // ─── Datos derivados ──────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeFilterCount = Object.entries(filters).filter(([, v]) => v !== '').length;

  return {
    logs,
    total,
    page,
    totalPages,
    loading,
    filters,
    actionOptions,
    entityOptions,
    activeFilterCount,
    setPage,
    updateFilters,
    resetFilters,
    refresh: fetchLogs,
  };
}
