import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import SeoHead from '@/components/feature/SeoHead';
import { useEntity, TYPE_LABELS, TYPE_ICONS } from '@/hooks/useEntity';
import EntityHero from './components/EntityHero';
import EntityPopularityStats from './components/EntityPopularityStats';
import EntityFilmography from './components/EntityFilmography';
import EntityTopWork from './components/EntityTopWork';
import EntityRelated from './components/EntityRelated';
import { getSiteUrl } from '@/lib/site';

// ── Skeleton ───────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 animate-pulse">
      <div className="w-full h-80 bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
      </div>
    </div>
  );
}

// ── Bio expandable ─────────────────────────────────────────────────────────────
function EntityBio({ bio, name }: { bio: string; name: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = bio.length > 300;
  const displayed = isLong && !expanded ? bio.slice(0, 300) + '…' : bio;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 mb-8">
      <h2
        className="text-base font-bold text-zinc-900 dark:text-white mb-3"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Sobre {name}
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{displayed}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-3 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {expanded ? 'Leer menos' : 'Leer más'}
        </button>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function EntityPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { entity, items, loading, error } = useEntity(slug);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-16"><PageSkeleton /></div>
      </>
    );
  }

  if (error || !entity) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 pt-16">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <i className="ri-user-unfollow-line text-3xl"></i>
          </div>
          <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Entidad no encontrada</p>
          {error && <p className="text-sm text-rose-500 max-w-xs text-center">{error}</p>}
          <Link
            to="/catalog"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline cursor-pointer"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const typeLabel = TYPE_LABELS[entity.type] ?? entity.type;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['actor', 'director', 'author', 'artist'].includes(entity.type) ? 'Person' : 'Organization',
    name: entity.name,
    description: entity.bio ?? undefined,
    image: entity.image_url ?? undefined,
    url: `${getSiteUrl()}/entity/${slug}`,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SeoHead
        title={`${entity.name} — ${typeLabel} | Vaultly`}
        description={
          entity.bio
            ? entity.bio.slice(0, 155)
            : `${entity.name} es ${typeLabel.toLowerCase()} con ${items.length} obra${items.length !== 1 ? 's' : ''} en Vaultly.`
        }
        keywords={`${entity.name}, ${typeLabel}, filmografía, obras, Vaultly`}
        canonical={`/entity/${slug}`}
        ogImage={entity.image_url ?? undefined}
        jsonLd={jsonLd}
      />
      <Navbar />

      <div className="pt-16">
        {/* ── Hero ── */}
        <EntityHero entity={entity} items={items} slug={slug} />

        {/* ── Content ── */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

          {/* Bio */}
          {entity.bio && <EntityBio bio={entity.bio} name={entity.name} />}

          {/* Popularity stats */}
          {items.length > 0 && <EntityPopularityStats items={items} />}

          {/* Top work highlight */}
          {items.length > 0 && <EntityTopWork items={items} />}

          {/* Filmography */}
          {items.length > 0 ? (
            <EntityFilmography items={items} entityName={entity.name} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <i className="ri-inbox-line text-2xl text-zinc-400"></i>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Aún no hay obras vinculadas a esta entidad
              </p>
              <p className="text-xs text-zinc-400 max-w-xs">
                Las obras se añaden automáticamente cuando se buscan ítems relacionados en el catálogo
              </p>
              <Link
                to="/catalog"
                className="mt-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Explorar catálogo
              </Link>
            </div>
          )}

          {/* Related entities / collaborators */}
          <EntityRelated items={items} currentSlug={slug} />
        </div>
      </div>
    </div>
  );
}
