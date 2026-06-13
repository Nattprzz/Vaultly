import { useEffect, useState } from 'react';
import { getGameCompanyBySlug } from '@/services/gameCompanies';
import type { GameCompany } from '@/types/gameCompany';

interface UseGameCompanyResult {
  company: GameCompany | null;
  loading: boolean;
  error: string | null;
}

const memCache = new Map<string, GameCompany | null>();

export function useGameCompany(slug: string | undefined): UseGameCompanyResult {
  const [company, setCompany] = useState<GameCompany | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const safeSlug = slug?.trim();
    if (!safeSlug) {
      setCompany(null);
      setLoading(false);
      setError('Compañía no encontrada');
      return;
    }

    if (memCache.has(safeSlug)) {
      setCompany(memCache.get(safeSlug) ?? null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getGameCompanyBySlug(safeSlug)
      .then(result => {
        if (cancelled) return;
        memCache.set(safeSlug, result);
        setCompany(result);
      })
      .catch(err => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { company, loading, error };
}
