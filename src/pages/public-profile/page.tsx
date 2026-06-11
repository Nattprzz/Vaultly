import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import { supabase } from '@/lib/supabase';
import PublicProfileHero from './components/PublicProfileHero';
import PublicTrackerList from './components/PublicTrackerList';
import PublicProfileStats from './components/PublicProfileStats';
import PublicProfileReviews from './components/PublicProfileReviews';
import type { PublicPrivacyFlags } from '@/types/privacy';

type Tab = 'tracker' | 'stats' | 'reviews';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'tracker',  label: 'Lista de seguimiento', icon: 'ri-stack-line' },
  { id: 'stats',    label: 'Estadísticas',          icon: 'ri-bar-chart-box-line' },
  { id: 'reviews',  label: 'Reseñas',               icon: 'ri-quill-pen-line' },
];

interface PublicUser extends PublicPrivacyFlags {
  id: string;
  username: string;
  display_name: string;
  initials: string;
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('tracker');
  const [publicUser, setPublicUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      setLoading(true);
      setNotFound(false);
      setPublicUser(null);

      const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name, initials, is_public, share_tracker, show_ratings, show_reviews')
        .eq('username', username)
        .maybeSingle();

      if (!data || data.is_public === false) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // show_item_status lives in user_tracker_settings (readable for public profiles via RLS)
      const { data: ts } = await supabase
        .from('user_tracker_settings')
        .select('show_item_status')
        .eq('user_id', data.id)
        .maybeSingle();

      setPublicUser({
        ...(data as PublicUser),
        show_item_status: ts?.show_item_status ?? true,
      });
      setLoading(false);
    };
    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)] flex items-center justify-center">
        <Sidebar />
        <div className="flex flex-col items-center gap-3 pt-14 md:pt-0 md:pl-64">
          <div className="w-10 h-10 rounded-xl bg-brand dark:bg-brand-dark flex items-center justify-center animate-pulse">
            <i className="ri-archive-2-line text-white"></i>
          </div>
          <p className="text-sm text-zinc-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)]">
        <SeoHead title="Perfil no encontrado — Vaultly" description="Este perfil no existe o no está disponible." canonical={`/u/${username}`} />
        <Sidebar />
        <main className="pt-14 md:pt-0 md:pl-64 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5">
            <i className="ri-user-unfollow-line text-3xl text-zinc-400"></i>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Perfil no encontrado
          </h1>
          <p className="text-sm text-zinc-500 mb-6 max-w-xs">
            El usuario <strong>@{username}</strong> no existe o su perfil no es público.
          </p>
          <Link to="/catalog" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
            <i className="ri-compass-3-line"></i>
            Explorar catálogo
          </Link>
        </main>
      </div>
    );
  }

  const displayName = publicUser?.display_name ?? username ?? '';
  const initials = publicUser?.initials ?? displayName.slice(0, 2).toUpperCase();
  const privacy: PublicPrivacyFlags = {
    is_public: publicUser?.is_public ?? false,
    share_tracker: publicUser?.share_tracker ?? false,
    show_ratings: publicUser?.show_ratings ?? false,
    show_reviews: publicUser?.show_reviews ?? false,
    show_item_status: publicUser?.show_item_status ?? true,
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)]">
      <SeoHead
        title={`${displayName} (@${username}) — Vaultly`}
        description={`Perfil público de ${displayName} en Vaultly. Descubre su lista de seguimiento, estadísticas y reseñas culturales.`}
        canonical={`/u/${username}`}
      />
      <Sidebar />
      <main className="pt-14 md:pt-0 md:pl-64">
        <div className="bg-[var(--bg)] dark:bg-[var(--bg)] pb-0">
          <PublicProfileHero username={username ?? ''} userId={publicUser?.id ?? null} displayName={displayName} initials={initials} privacy={privacy} />
        </div>
        <div className="bg-[var(--surface)] dark:bg-[var(--bg)] border-b border-zinc-100 dark:border-zinc-800 sticky top-16 z-30 mt-6">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-1 overflow-x-auto">
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
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
          {activeTab === 'tracker'  && <PublicTrackerList userId={publicUser?.id ?? null} privacy={privacy} />}
          {activeTab === 'stats'    && <PublicProfileStats userId={publicUser?.id ?? null} privacy={privacy} />}
          {activeTab === 'reviews'  && (
            <PublicProfileReviews
              userId={publicUser?.id ?? null}
              displayName={displayName}
              initials={initials}
              privacy={privacy}
            />
          )}
        </div>
      </main>
    </div>
  );
}
