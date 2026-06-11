import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategoryColors';
import type { TrackerEntry } from '@/hooks/useTracker';

interface Props {
  entries: Record<string, TrackerEntry>;
  activeCategory: string;
}

const CATEGORY_SUBTITLES: Record<string, string> = {
  videojuegos: 'Juegos que estás siguiendo, completando o tienes pendientes.',
  peliculas:   'Películas que has visto, estás viendo o tienes en lista de espera.',
  series:      'Series que sigues, has terminado o has abandonado.',
  libros:      'Libros que lees, has terminado o tienes por leer.',
  conciertos:  'Conciertos que has asistido o planeas asistir.',
};

export default function TrackerHero({ entries, activeCategory }: Props) {
  const { profile, user } = useAuth();
  const CATEGORIES = useCategories();
  const cat = CATEGORIES.find(c => c.id === activeCategory);

  const total = Object.values(entries).filter(e =>
    activeCategory === 'all' || e.category === activeCategory
  ).length;

  const displayName = profile?.display_name ?? profile?.username ?? user?.email?.split('@')[0] ?? 'Usuario';
  const initials = (profile as { initials?: string } | null)?.initials ?? displayName.slice(0, 2).toUpperCase();

  const isCategoryPage = activeCategory !== 'all';
  const heroTitle = isCategoryPage ? cat?.label ?? activeCategory : displayName;
  const heroSubtitle = isCategoryPage
    ? CATEGORY_SUBTITLES[activeCategory] ?? `Elementos de ${cat?.label} en tu tracker.`
    : 'Gestiona todo lo que has visto, leído, jugado o escuchado.';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] mb-6">
      {/* Ambient layers */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isCategoryPage && cat
            ? `linear-gradient(135deg, ${cat.accent}10 0%, transparent 60%)`
            : 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(249,115,22,0.05) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
        style={{ background: isCategoryPage && cat ? `${cat.accent}08` : 'rgba(59,130,246,0.06)' }}
      />

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
        {/* Icon or Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {isCategoryPage ? (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                style={{ background: `${cat?.accent}20`, color: cat?.accent }}
              >
                <i className={cat?.icon} />
              </div>
            ) : profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-16 w-16 rounded-2xl object-cover object-top ring-2 ring-[var(--brand-accent)]/30"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-black text-white ring-2 ring-blue-500/30">
                {initials}
              </div>
            )}
            {!isCategoryPage && (
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[var(--surface)] bg-emerald-500" />
            )}
          </div>

          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              {isCategoryPage ? 'Tu tracker' : 'Tu colección personal'}
            </p>
            <h1
              className="text-2xl font-black text-[var(--text-primary)] md:text-3xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {heroTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {heroSubtitle}
              {total > 0 && (
                <span className="ml-2 font-semibold" style={{ color: isCategoryPage ? cat?.accent : 'var(--brand-accent)' }}>
                  {total} {total === 1 ? 'elemento' : 'elementos'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-shrink-0 items-center gap-3 md:ml-auto">
          <Link
            to={isCategoryPage ? `/catalog/${activeCategory}` : '/catalog'}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-accent-hover)] cursor-pointer whitespace-nowrap"
          >
            <i className="ri-compass-3-line" />
            {isCategoryPage ? `Explorar ${cat?.label ?? activeCategory}` : 'Explorar catálogo'}
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            Añadir item
          </Link>
        </div>
      </div>
    </div>
  );
}
