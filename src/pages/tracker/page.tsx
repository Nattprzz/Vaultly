import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import SeoHead from '@/components/feature/SeoHead';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useTracker, TrackerStatus } from '@/hooks/useTracker';
import TrackerHeader from './components/TrackerHeader';
import CategoryTabs from './components/CategoryTabs';
import StatusFilters from './components/StatusFilters';
import TrackerGrid from './components/TrackerGrid';
import { enrichEntries, type EnrichedEntry } from './components/trackerEntryUtils';
import TrackerList from './components/TrackerList';
import TrackerEmpty from './components/TrackerEmpty';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CATEGORIES } from '@/mocks/catalog';
import { isAppCategory } from '@/lib/categories';

type SortOption = 'updated' | 'added' | 'rating' | 'title';
type ViewMode = 'grid' | 'list';

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

export default function TrackerPage() {
  const { isLoggedIn, profile } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { category: paramCategory } = useParams<{ category?: string }>();
  const { entries, loading } = useTracker();

  const [activeCategory, setActiveCategory] = useState(paramCategory ?? 'all');
  const [statusFilter, setStatusFilter] = useState<TrackerStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Scroll reveal refs
  const headerRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const tabsRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const filtersRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const gridRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  const activeCategories = useMemo(
    () => CATEGORIES
      .filter(category => settings.activeCategories.includes(category.id))
      .map(category => category.id),
    [settings.activeCategories],
  );

  useEffect(() => {
    if (!paramCategory) {
      setActiveCategory('all');
      return;
    }

    if (isAppCategory(paramCategory) && activeCategories.includes(paramCategory)) {
      setActiveCategory(paramCategory);
      return;
    }

    navigate('/tracker', { replace: true });
  }, [activeCategories, navigate, paramCategory]);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setStatusFilter('all');
    if (id === 'all') navigate('/tracker');
    else navigate(`/tracker/${id}`);
  };

  const allEnriched = useMemo(
    () => enrichEntries(entries).filter(entry => activeCategories.includes(entry.category)),
    [activeCategories, entries],
  );

  const byCat = useMemo(() =>
    activeCategory === 'all'
      ? allEnriched
      : allEnriched.filter(e => e.category === activeCategory),
    [allEnriched, activeCategory],
  );

  const statusCounts = useMemo(() => ({
    all:         byCat.length,
    in_progress: byCat.filter(e => e.status === 'in_progress').length,
    pending:     byCat.filter(e => e.status === 'pending').length,
    completed:   byCat.filter(e => e.status === 'completed').length,
    dropped:     byCat.filter(e => e.status === 'dropped').length,
  }), [byCat]);

  const filtered = useMemo(() =>
    statusFilter === 'all' ? byCat : byCat.filter(e => e.status === statusFilter),
    [byCat, statusFilter],
  );

  const sorted = useMemo(() => sortEntries(filtered, sortBy), [filtered, sortBy]);

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SeoHead
        title="Mi Tracker — Vaultly"
        description="Gestiona tu lista de seguimiento personal en Vaultly."
        canonical="/tracker"
        noIndex
      />
      <Navbar />
      <main className="pt-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

          <div ref={headerRef} className="sr-item">
            <TrackerHeader entries={entries} />
          </div>

          <div ref={tabsRef} className="sr-item">
            <CategoryTabs
              activeCategory={activeCategory}
              onSelect={handleCategorySelect}
              entries={entries}
              activeCategories={activeCategories}
            />
          </div>

          <div ref={filtersRef} className="sr-item">
            <StatusFilters
              activeStatus={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              counts={statusCounts}
            />
          </div>

          <div ref={gridRef} className="sr-item">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <i className="ri-loader-4-line text-3xl text-zinc-400 animate-spin"></i>
                  <p className="text-sm text-zinc-400">Cargando tu tracker...</p>
                </div>
              </div>
            ) : sorted.length === 0 ? (
              <TrackerEmpty category={activeCategory} statusFilter={statusFilter} />
            ) : viewMode === 'grid' ? (
              <TrackerGrid enriched={sorted} />
            ) : (
              <TrackerList enriched={sorted} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
