import { useState } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import ProfileHero from './components/ProfileHero';
import ProfileStats from './components/ProfileStats';
import ProfileShowcase from './components/ProfileShowcase';
import ProfileReviews from './components/ProfileReviews';

type Tab = 'showcase' | 'stats' | 'reviews';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'showcase', label: 'Destacados',  icon: 'ri-trophy-line' },
  { id: 'stats',    label: 'Estadísticas', icon: 'ri-bar-chart-box-line' },
  { id: 'reviews',  label: 'Reseñas',     icon: 'ri-quill-pen-line' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('showcase');

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)]">
      <SeoHead
        title="Mi Perfil — Vaultly"
        description="Tu perfil público en Vaultly. Muestra tus highlights, estadísticas y reseñas culturales."
        canonical="/profile"
        noIndex
      />
      <Sidebar />
      <main className="pt-14 md:pt-0 md:pl-64">
        {/* Hero section — full width with banner */}
        <div className="bg-[var(--surface)] dark:bg-[var(--bg)] pb-0">
          <ProfileHero isOwn />
        </div>

        {/* Tabs */}
        <div className="bg-[var(--surface)] dark:bg-[var(--bg)] border-b border-zinc-100 dark:border-zinc-800 sticky top-16 z-30">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  <i className={tab.icon}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
          {activeTab === 'showcase' && <ProfileShowcase />}
          {activeTab === 'stats'    && <ProfileStats />}
          {activeTab === 'reviews'  && <ProfileReviews />}
        </div>
      </main>
    </div>
  );
}
