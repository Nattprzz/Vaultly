import { useState, useEffect } from 'react';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';

const EDGE_URL = edgeFunctionUrl('item-reports');

interface ReportCountResult {
  pending: number;
  total: number;
  loading: boolean;
}

export function useItemReportCount(itemId: string): ReportCountResult {
  const [pending, setPending] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

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
        // silently fail — non-critical indicator
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCount();
    return () => { cancelled = true; };
  }, [itemId]);

  return { pending, total, loading };
}
