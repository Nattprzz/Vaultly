import { useState, useEffect, useCallback, useRef } from 'react';
import { type ReportStatus } from '@/mocks/admin';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';
import { supabase } from '@/lib/supabase';

const EDGE_URL = edgeFunctionUrl('item-reports');
const STORAGE_KEY = 'vaultly_admin_reports_seen';
const POLL_INTERVAL = 30000; // 30s

export interface AdminReport {
  id: string;
  item_id: string;
  item_slug?: string | null;
  item_title: string;
  item_category: string;
  item_cover: string;
  reason: string;
  details: string | null;
  reported_at: string;
  status: ReportStatus;
  resolved_at?: string | null;
  resolved_note?: string | null;
}

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

export interface UseAdminReportsReturn {
  reports: AdminReport[];
  pendingCount: number;
  newCount: number;
  loading: boolean;
  error: string | null;
  markAllSeen: () => void;
  resolveReport: (id: string, status: ReportStatus, note?: string) => Promise<void>;
  refresh: () => void;
}

export function useAdminReports(): UseAdminReportsReturn {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(getSeenIds);
  const mountedRef = useRef(true);

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

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;
    fetchReports();
    return () => { mountedRef.current = false; };
  }, [fetchReports]);

  // Polling every 30s to pick up new reports in real time
  useEffect(() => {
    const timer = setInterval(fetchReports, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchReports]);

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const newCount = reports.filter(
    r => r.status === 'pending' && !seenIds.has(r.id)
  ).length;

  const markAllSeen = useCallback(() => {
    const allIds = new Set(reports.map(r => r.id));
    setSeenIds(allIds);
    saveSeenIds(allIds);
  }, [reports]);

  const resolveReport = useCallback(async (id: string, status: ReportStatus, note?: string) => {
    // Optimistic update
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
    } catch (err) {
      // Revert on failure
      await fetchReports();
      setError(String(err));
    }
  }, [fetchReports]);

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
