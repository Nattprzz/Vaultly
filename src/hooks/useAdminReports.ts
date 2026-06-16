/**
 * useAdminReports.ts — gestión de reportes de ítems desde el panel de administración.
 *
 * Carga todos los reportes de usuario vía el edge function item-reports
 * y expone herramientas para resolverlos o descartarlos. Hace polling
 * cada 30 segundos para detectar nuevos reportes en tiempo real.
 * Distingue entre reportes pendientes y reportes no vistos para el badge de notificación.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { type ReportStatus } from '@/types/admin';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';
import { auditLog } from '@/lib/audit';

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDGE_URL = edgeFunctionUrl('item-reports');

/** Clave de localStorage para persistir los IDs de reportes ya vistos. */
const STORAGE_KEY = 'vaultly_admin_reports_seen';

/** Intervalo de polling para actualizar los reportes sin requerir recarga manual. */
const POLL_INTERVAL = 30000;

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Reporte de usuario tal como lo devuelve el edge function item-reports. */
export interface AdminReport {
  /** ID único del reporte */
  id: string;
  /** ID del ítem reportado */
  item_id: string;
  /** Slug del ítem reportado, o null si no está disponible */
  item_slug?: string | null;
  /** Título del ítem reportado */
  item_title: string;
  /** Categoría del ítem reportado */
  item_category: string;
  /** URL de la portada del ítem */
  item_cover: string;
  /** Motivo del reporte */
  reason: string;
  /** Detalle adicional del usuario, o null */
  details: string | null;
  /** Fecha en que se creó el reporte (ISO) */
  reported_at: string;
  /** Estado actual del reporte */
  status: ReportStatus;
  /** Fecha en que fue resuelto (ISO), o null si sigue pendiente */
  resolved_at?: string | null;
  /** Nota interna del administrador al resolver */
  resolved_note?: string | null;
}

/** Forma pública del hook. */
export interface UseAdminReportsReturn {
  /** Lista completa de reportes */
  reports: AdminReport[];
  /** Número de reportes con estado "pending" */
  pendingCount: number;
  /** Número de reportes pendientes que el admin aún no ha visto */
  newCount: number;
  /** true durante la carga inicial o el polling */
  loading: boolean;
  /** Mensaje de error, o null si no hubo problemas */
  error: string | null;
  /** Marca todos los reportes actuales como vistos en localStorage */
  markAllSeen: () => void;
  /** Resuelve o descarta un reporte con actualización optimista */
  resolveReport: (id: string, status: ReportStatus, note?: string) => Promise<void>;
  /** Fuerza una recarga inmediata de los reportes */
  refresh: () => void;
}

// ─── Funciones auxiliares ────────────────────────────────────────────────────

function getSeenIds(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function saveSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* noop */ }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Gestiona los reportes de ítems en el panel de administración.
 *
 * Responsabilidades:
 * - Cargar y actualizar reportes con polling cada 30 segundos.
 * - Rastrear qué reportes han sido vistos para el badge de nuevos reportes.
 * - Resolver o descartar reportes con actualización optimista y rollback ante error.
 * - Registrar cada acción de resolución en admin_audit_logs.
 */
export function useAdminReports(): UseAdminReportsReturn {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(getSeenIds);
  const mountedRef = useRef(true);

  // ─── Carga de datos ──────────────────────────────────────────────────────────

  const fetchReports = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch(EDGE_URL, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (mountedRef.current) {
        setReports(json.reports ?? []);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(String(err));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    mountedRef.current = true;
    fetchReports();
    return () => { mountedRef.current = false; };
  }, [fetchReports]);

  useEffect(() => {
    const timer = setInterval(fetchReports, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchReports]);

  // ─── Datos derivados ──────────────────────────────────────────────────────────

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const newCount = reports.filter(
    r => r.status === 'pending' && !seenIds.has(r.id)
  ).length;

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const markAllSeen = useCallback(() => {
    const allIds = new Set(reports.map(r => r.id));
    setSeenIds(allIds);
    saveSeenIds(allIds);
  }, [reports]);

  /**
   * Resuelve o descarta un reporte con actualización optimista.
   * Revierte el estado si el servidor responde con error.
   *
   * @param id ID del reporte a gestionar.
   * @param status Nuevo estado del reporte.
   * @param note Nota interna opcional del administrador.
   */
  const resolveReport = useCallback(async (id: string, status: ReportStatus, note?: string) => {
    const target = reports.find(report => report.id === id);

    setReports(prev => prev.map(r =>
      r.id === id
        ? { ...r, status, resolved_at: new Date().toISOString(), resolved_note: note ?? null }
        : r
    ));

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch(EDGE_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status, resolved_note: note }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await auditLog('update', 'item_reports', id, {
        status,
        resolved_note: note ?? null,
        item_id: target?.item_id ?? null,
        item_slug: target?.item_slug ?? null,
        item_title: target?.item_title ?? null,
        item_category: target?.item_category ?? null,
        reason: target?.reason ?? null,
      });
    } catch (err) {
      await fetchReports();
      setError(String(err));
    }
  }, [fetchReports, reports]);

  return {
    reports,
    pendingCount,
    newCount,
    loading,
    error,
    markAllSeen,
    resolveReport,
    refresh: fetchReports,
  };
}
