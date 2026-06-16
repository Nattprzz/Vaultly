/**
 * useItemReportCount.ts — contador de reportes activos de un ítem del catálogo.
 *
 * Consulta el edge function item-reports y devuelve el número de reportes
 * pendientes y el total acumulado para un ítem concreto.
 * Es un indicador no crítico: los errores de red se silencian.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Servicios ───────────────────────────────────────────────────────────────

import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDGE_URL = edgeFunctionUrl('item-reports');

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ReportCountResult {
  /** Reportes con estado "pending" */
  pending: number;
  /** Total de reportes del ítem, independientemente del estado */
  total: number;
  /** true mientras se realiza la consulta inicial */
  loading: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Devuelve los contadores de reportes de un ítem del catálogo.
 *
 * Se usa en el panel de administración para mostrar cuántos reportes
 * pendientes tiene el ítem seleccionado sin cargar la lista completa.
 *
 * @param itemId ID del ítem cuyos reportes se quieren contar.
 */
export function useItemReportCount(itemId: string): ReportCountResult {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [pending, setPending] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!itemId) return;

    let cancelled = false;

    const fetchCount = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        const res = await fetch(`${EDGE_URL}?item_id=${encodeURIComponent(itemId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) return;
        const json = await res.json();
        const reports: { status: string }[] = json.reports ?? [];
        if (!cancelled) {
          setTotal(reports.length);
          setPending(reports.filter(r => r.status === 'pending').length);
        }
      } catch {
        // indicador no crítico: si falla la petición, se mantiene en 0
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCount();
    return () => { cancelled = true; };
  }, [itemId]);

  return { pending, total, loading };
}
