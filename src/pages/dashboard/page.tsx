import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useCategories } from '@/hooks/useCategoryColors';
import DashboardHeader from './components/DashboardHeader';
import DashboardNotifications from './components/DashboardNotifications';
import StatsCards from './components/StatsCards';
import CurrentlyTracking from './components/CurrentlyTracking';
import RecentActivity from './components/RecentActivity';
import CategoryProgress from './components/CategoryProgress';
import WeeklyActivity from './components/WeeklyActivity';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { WeeklyActivityPoint } from '@/hooks/useDashboardStats';

const ALL_CAT = 'all';

export default function DashboardPage() {
  const dashData = useDashboardStats();
  const CATEGORIES = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CAT);

  // Scroll reveal refs
  const headerRef   = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const notifRef    = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const statsRef    = useScrollReveal<HTMLElement>();
  const trackingRef = useScrollReveal<HTMLElement>();
  const activityRef = useScrollReveal<HTMLDivElement>();
  const weeklyRef   = useScrollReveal<HTMLDivElement>();
  const progressRef = useScrollReveal<HTMLDivElement>();

  // ── Filtered data (client-side only, no tracker mutation) ──────────────────

  const filteredActivity = useMemo(
    () => activeCategory === ALL_CAT
      ? dashData.recentActivity
      : dashData.recentActivity.filter(i => i.category === activeCategory),
    [activeCategory, dashData.recentActivity],
  );

  const filteredTracking = useMemo(
    () => activeCategory === ALL_CAT
      ? dashData.currentlyTracking
      : dashData.currentlyTracking.filter(i => i.category === activeCategory),
    [activeCategory, dashData.currentlyTracking],
  );

  const filteredCategoryStats = useMemo(
    () => activeCategory === ALL_CAT
      ? dashData.categoryStats
      : dashData.categoryStats.filter(c => c.id === activeCategory),
    [activeCategory, dashData.categoryStats],
  );

  const filteredWeekly = useMemo((): WeeklyActivityPoint[] => {
    if (activeCategory === ALL_CAT) return dashData.weeklyActivity;
    if (dashData.rawRows.length === 0) return dashData.weeklyActivity;

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(date); dayEnd.setHours(23, 59, 59, 999);
      const count = dashData.rawRows.filter(r => {
        if (r.category !== activeCategory) return false;
        const t = new Date(r.updated_at).getTime();
        return t >= dayStart.getTime() && t <= dayEnd.getTime();
      }).length;
      return { day: formatter.format(date).slice(0, 1).toUpperCase(), count };
    });
  }, [activeCategory, dashData.rawRows, dashData.weeklyActivity]);

  // Empty state when a category filter returns no data at all
  const activeCatMeta  = CATEGORIES.find(c => c.id === activeCategory);
  const categoryIsEmpty =
    activeCategory !== ALL_CAT &&
    !dashData.loading &&
    filteredActivity.length === 0 &&
    filteredTracking.length === 0;

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)]">
      <SeoHead
        title="Dashboard — Vaultly"
        description="Tu panel personal de Vaultly. Consulta tu actividad, progreso y estadísticas de tracking cultural."
        canonical="/dashboard"
        noIndex
      />
      <Sidebar />
      <main className="pt-14 md:pt-0 md:pl-64">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

          <div ref={headerRef} className="sr-item">
            <DashboardHeader stats={dashData.stats} loading={dashData.loading} />
          </div>

          {/* ── Category filter chips ───────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-8 -mt-2">
            <button
              onClick={() => setActiveCategory(ALL_CAT)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === ALL_CAT
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <i className="ri-apps-2-line text-[11px]"></i>
              Todo
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
                style={activeCategory === cat.id ? { background: cat.accent } : {}}
              >
                <i className={`${cat.icon} text-[11px]`}></i>
                {cat.label}
              </button>
            ))}
          </div>

          <div ref={notifRef} className="sr-item">
            <DashboardNotifications
              stats={dashData.stats}
              recentActivity={dashData.recentActivity}
              loading={dashData.loading}
            />
          </div>

          {/* Stats always show global totals */}
          <section ref={statsRef} className="sr-item mb-8">
            <StatsCards stats={dashData.stats} loading={dashData.loading} />
          </section>

          {/* ── Empty state for filtered category ──────────────────────────── */}
          {categoryIsEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-2xl"
                style={{ background: `${activeCatMeta?.accent ?? '#52525b'}18` }}
              >
                <i
                  className={`${activeCatMeta?.icon ?? 'ri-stack-line'} text-3xl`}
                  style={{ color: activeCatMeta?.accent ?? '#52525b' }}
                ></i>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                  No tienes elementos en esta categoría todavía
                </p>
                <p className="text-sm text-zinc-500">
                  Explora el catálogo y añade {activeCatMeta?.label.toLowerCase() ?? 'ítems'} a tu tracker.
                </p>
              </div>
              <Link
                to={`/catalog/${activeCategory}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                <i className="ri-compass-3-line"></i>
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              <section ref={trackingRef} className="sr-item mb-8">
                <CurrentlyTracking items={filteredTracking} loading={dashData.loading} />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div ref={activityRef} className="sr-item">
                    <RecentActivity items={filteredActivity} loading={dashData.loading} />
                  </div>
                  <div ref={weeklyRef} className="sr-item">
                    <WeeklyActivity data={filteredWeekly} loading={dashData.loading} />
                  </div>
                </div>
                <div ref={progressRef} className="sr-item-right">
                  <CategoryProgress categories={filteredCategoryStats} loading={dashData.loading} />
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
