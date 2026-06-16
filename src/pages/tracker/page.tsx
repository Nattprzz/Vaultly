/**
 * tracker/page.tsx — página del tracker personal del usuario.
 *
 * Envuelve el contenido en TrackerProvider para que los sub-componentes
 * puedan acceder al contexto sin prop drilling. TrackerPageContent contiene
 * toda la lógica: cadena de filtros (enrich → categoría → búsqueda → conteos
 * → estado → orden), scroll reveal y navegación por URL de categoría.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { useParams, useNavigate } from 'react-router-dom';

// ─── Componentes ──────────────────────────────────────────────────────────────

import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import TrackerHero from './components/TrackerHero';
import TrackerStats from './components/TrackerStats';
import TrackerDonutChart from './components/TrackerDonutChart';
import TrackerFilters from './components/TrackerFilters';
import TrackerCardGrid from './components/TrackerCardGrid';
import TrackerTimeline from './components/TrackerTimeline';
import TrackerEmpty from './components/TrackerEmpty';

// ─── Contextos ────────────────────────────────────────────────────────────────

import { TrackerProvider, useTrackerContext } from '@/contexts/TrackerContext';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useSettings } from '@/hooks/useSettings';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCategories } from '@/hooks/useCategoryColors';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { TrackerStatus } from '@/hooks/useTracker';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { isAppCategory } from '@/lib/categories';
import { getCategoryStatuses } from '@/constants/tracker-statuses';
import { enrichEntries, type EnrichedEntry } from './components/trackerEntryUtils';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Criterio de ordenación disponible en el tracker. */
type SortOption = 'updated' | 'added' | 'rating' | 'title';

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Ordena una copia del array de entradas según el criterio indicado.
 *
 * @param items - Entradas enriquecidas a ordenar.
 * @param sortBy - Criterio de ordenación.
 * @returns Nueva array ordenada (no muta el original).
 */
function sortEntries(items: EnrichedEntry[], sortBy: SortOption): EnrichedEntry[] {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'updated': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'added':   return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'rating':  return (b.rating ?? -1) - (a.rating ?? -1);
      case 'title':   return a.title.localeCompare(b.title, 'es');
      default:        return 0;
    }
  });
}

// ─── Componente ──────────────────────────────────────────────────────────────

/** Punto de entrada de la página — proporciona el contexto del tracker. */
export default function TrackerPage() {
  return (
    <TrackerProvider>
      <TrackerPageContent />
    </TrackerProvider>
  );
}

/** Contenido real de la página; necesita estar dentro de TrackerProvider. */
function TrackerPageContent() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const { settings } = useSettings();
  const navigate = useNavigate();
  const { category: paramCategory } = useParams<{ category?: string }>();
  const { entries, loading } = useTrackerContext();
  const CATEGORIES = useCategories();

  const [activeCategory, setActiveCategory] = useState(paramCategory ?? 'all');
  const [statusFilter, setStatusFilter]     = useState<TrackerStatus | 'all'>('all');
  const [sortBy, setSortBy]                 = useState<SortOption>('updated');
  const [searchQuery, setSearchQuery]       = useState('');

  // ─── Scroll reveal ───────────────────────────────────────────────────────────

  const heroRef    = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const statsRef   = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const filtersRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const mainRef    = useScrollReveal<HTMLDivElement>();

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!paramCategory) { setActiveCategory('all'); return; }
    if (isAppCategory(paramCategory)) {
      setActiveCategory(paramCategory);
      return;
    }
    navigate('/tracker', { replace: true });
  }, [navigate, paramCategory]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setStatusFilter('all');
    setSearchQuery('');
    if (id === 'all') navigate('/tracker');
    else navigate(`/tracker/${id}`);
  };

  // ─── Datos derivados ─────────────────────────────────────────────────────────

  const activeCategories = useMemo<string[]>(
    () => CATEGORIES
      .filter(c => settings.activeCategories.includes(c.id))
      .map(c => c.id),
    [settings.activeCategories, CATEGORIES],
  );

  // Cadena de filtros: enrich → categoría → búsqueda → conteos → estado → orden
  const allEnriched = useMemo(
    () => enrichEntries(entries, CATEGORIES),
    [entries, CATEGORIES],
  );

  const byCat = useMemo(
    () => activeCategory === 'all'
      ? allEnriched.filter(e => activeCategories.includes(e.category))
      : allEnriched.filter(e => e.category === activeCategory),
    [allEnriched, activeCategory, activeCategories],
  );

  const searched = useMemo(
    () => searchQuery.trim() === ''
      ? byCat
      : byCat.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase().trim())),
    [byCat, searchQuery],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: searched.length };
    const statuses = activeCategory === 'all'
      ? [...new Set(searched.map(e => e.status))]
      : getCategoryStatuses(activeCategory);
    for (const s of statuses) {
      counts[s] = searched.filter(e => e.status === s).length;
    }
    return counts;
  }, [searched, activeCategory]);

  const filtered = useMemo(
    () => statusFilter === 'all' ? searched : searched.filter(e => e.status === statusFilter),
    [searched, statusFilter],
  );

  const sorted = useMemo(() => sortEntries(filtered, sortBy), [filtered, sortBy]);

  // ─── Renderizado ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SeoHead
        title="Mi tracker — Vaultly"
        description="Gestiona tu colección personal en Vaultly. Todo lo que has visto, leído, jugado o escuchado."
        canonical="/tracker"
        noIndex
      />
      <Sidebar />

      <main className="pt-14 md:pt-0 md:pl-64">
        <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-6">

          {/* 1 · Héroe */}
          <div ref={heroRef} className="sr-item">
            <TrackerHero entries={entries} activeCategory={activeCategory} />
          </div>

          {/* 2 · Stats + gráfico de dona */}
          <div ref={statsRef} className="sr-item sr-delay-100">
            <TrackerStats entries={entries} activeCategory={activeCategory} />
            <TrackerDonutChart
              entries={entries}
              activeCategory={activeCategory}
              activeStatus={statusFilter}
              onStatusFilter={setStatusFilter}
            />
          </div>

          {/* 3 · Filtros */}
          <div ref={filtersRef} className="sr-item sr-delay-200">
            <TrackerFilters
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              activeStatus={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              entries={entries}
              activeCategories={activeCategories}
              counts={statusCounts}
            />
          </div>

          {/* 4 · Cuadrícula principal + 5 · Sidebar de timeline */}
          <div ref={mainRef} className="sr-item sr-delay-300">
            {loading ? (
              <div className="flex items-center justify-center py-28">
                <div className="flex flex-col items-center gap-3">
                  <i className="ri-loader-4-line animate-spin text-3xl text-[var(--text-tertiary)]" />
                  <p className="text-sm text-[var(--text-tertiary)]">Cargando tu tracker…</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

                {/* Cuadrícula — ocupa 3/4 en pantallas grandes */}
                <div className="lg:col-span-3">
                  {sorted.length === 0 ? (
                    <TrackerEmpty
                      category={activeCategory}
                      statusFilter={statusFilter}
                    />
                  ) : (
                    <>
                      <p className="mb-4 text-xs text-[var(--text-tertiary)]">
                        {sorted.length} {sorted.length === 1 ? 'elemento' : 'elementos'}
                        {searchQuery.trim() && (
                          <span> para &ldquo;{searchQuery.trim()}&rdquo;</span>
                        )}
                      </p>
                      <TrackerCardGrid enriched={sorted} />
                    </>
                  )}
                </div>

                {/* Timeline — sidebar 1/4 */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <TrackerTimeline />
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
