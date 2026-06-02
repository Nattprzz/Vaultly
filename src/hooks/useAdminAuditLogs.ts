import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
  actor_email?: string;
  actor_username?: string;
}

export interface AuditFilters {
  action: string;
  entity: string;
  actor_id: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}

const PAGE_SIZE = 30;

const DEFAULT_FILTERS: AuditFilters = {
  action: '',
  entity: '',
  actor_id: '',
  search: '',
  dateFrom: '',
  dateTo: '',
};

export function useAdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [actionOptions, setActionOptions] = useState<string[]>([]);
  const [entityOptions, setEntityOptions] = useState<string[]>([]);

  // Load distinct action/entity values for filter dropdowns
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
      if (filters.actor_id) query = query.eq('actor_id', filters.actor_id);
      if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setDate(end.getDate() + 1);
        query = query.lt('created_at', end.toISOString());
      }

      const { data, count, error } = await query;
      if (error) throw error;

      // Enrich with profile data
      const actorIds = [...new Set((data ?? []).map((l) => l.actor_id).filter(Boolean))] as string[];
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

      const enriched: AuditLog[] = (data ?? []).map((log) => ({
        ...log,
        actor_email: profileMap[log.actor_id]?.email ?? '',
        actor_username: profileMap[log.actor_id]?.username ?? (log.actor_id ? log.actor_id.slice(0, 8) : 'Sistema'),
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

  const updateFilters = useCallback((partial: Partial<AuditFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

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
