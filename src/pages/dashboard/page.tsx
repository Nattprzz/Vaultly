import Navbar from '@/components/feature/Navbar';
import SeoHead from '@/components/feature/SeoHead';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import DashboardHeader from './components/DashboardHeader';
import DashboardNotifications from './components/DashboardNotifications';
import StatsCards from './components/StatsCards';
import CurrentlyTracking from './components/CurrentlyTracking';
import RecentActivity from './components/RecentActivity';
import CategoryProgress from './components/CategoryProgress';
import WeeklyActivity from './components/WeeklyActivity';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function DashboardPage() {
  const dashData = useDashboardStats();

  // Scroll reveal refs — header/notifications animate on mount, rest on scroll
  const headerRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const notifRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const statsRef = useScrollReveal<HTMLElement>();
  const trackingRef = useScrollReveal<HTMLElement>();
  const activityRef = useScrollReveal<HTMLDivElement>();
  const weeklyRef = useScrollReveal<HTMLDivElement>();
  const progressRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SeoHead
        title="Dashboard — Vaultly"
        description="Tu panel personal de Vaultly. Consulta tu actividad, progreso y estadísticas de tracking cultural."
        canonical="/dashboard"
        noIndex
      />
      <Navbar />
      <main className="pt-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

          <div ref={headerRef} className="sr-item">
            <DashboardHeader stats={dashData.stats} loading={dashData.loading} />
          </div>

          <div ref={notifRef} className="sr-item">
            <DashboardNotifications
              stats={dashData.stats}
              recentActivity={dashData.recentActivity}
              loading={dashData.loading}
            />
          </div>

          <section ref={statsRef} className="sr-item mb-8">
            <StatsCards stats={dashData.stats} loading={dashData.loading} />
          </section>

          <section ref={trackingRef} className="sr-item mb-8">
            <CurrentlyTracking items={dashData.currentlyTracking} loading={dashData.loading} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div ref={activityRef} className="sr-item">
                <RecentActivity items={dashData.recentActivity} loading={dashData.loading} />
              </div>
              <div ref={weeklyRef} className="sr-item">
                <WeeklyActivity />
              </div>
            </div>
            <div ref={progressRef} className="sr-item-right">
              <CategoryProgress categories={dashData.categoryStats} loading={dashData.loading} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
