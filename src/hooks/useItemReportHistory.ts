import { useState, useEffect } from 'react';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';

const EDGE_URL = edgeFunctionUrl('item-reports');

export interface ResolvedReport {
  id: string;
  reason: string;
  details: string | null;
  status: 'resolved' | 'dismissed';
  reported_at: string;
  resolved_at: string | null;
  resolved_note: string | null;
}

interface ReportHistoryResult {
  reports: ResolvedReport[];
  loading: boolean;
  error: boolean;
}

export function useItemReportHistory(itemId: string): ReportHistoryResult {
  const [reports, setReports] = useState<ResolvedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
