/**
 * useItemReportHistory.ts — historial de reportes resueltos de un ítem.
 *
 * Carga los reportes con estado "resolved" o "dismissed" de un ítem concreto.
 * Se usa en el panel de administración para mostrar el historial de moderación
 * junto al formulario de edición del ítem.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDGE_URL = edgeFunctionUrl('item-reports');

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Reporte ya gestionado (resuelto o descartado) de un ítem del catálogo. */
export interface ResolvedReport {
  /** ID único del reporte */
  id: string;
  /** Motivo del reporte */
  reason: string;
  /** Detalle adicional proporcionado por el usuario que reportó */
  details: string | null;
  /** Estado final del reporte */
  status: 'resolved' | 'dismissed';
  /** Fecha en que se creó el reporte (ISO) */
  reported_at: string;
  /** Fecha en que fue gestionado (ISO), o null si aún no lo fue */
  resolved_at: string | null;
  /** Nota interna del administrador al resolver */
  resolved_note: string | null;
}

interface ReportHistoryResult {
  /** Lista de reportes resueltos o descartados del ítem */
  reports: ResolvedReport[];
  /** true mientras se carga el historial */
  loading: boolean;
  /** true si la petición falló */
  error: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Carga el historial de reportes resueltos o descartados de un ítem.
 *
 * Filtra los reportes "pending" para mostrar solo los ya gestionados,
 * de modo que el administrador pueda consultar el historial de moderación.
 *
 * @param itemId ID del ítem cuyo historial se quiere consultar.
 */
export function useItemReportHistory(itemId: string): ReportHistoryResult {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [reports, setReports] = useState<ResolvedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchHistory = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        const res = await fetch(`${EDGE_URL}?item_id=${encodeURIComponent(itemId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        const all: ResolvedReport[] = (json.reports ?? []).filter(
          (r: { status: string }) => r.status === 'resolved' || r.status === 'dismissed',
        );
        if (!cancelled) setReports(all);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();
    return () => { cancelled = true; };
  }, [itemId]);

  return { reports, loading, error };
}
