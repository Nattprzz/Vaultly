/**
 * page.tsx — página de perfil público de una entidad del catálogo.
 *
 * Muestra el hero con estadísticas rápidas, la bio expandible, las estadísticas
 * de popularidad, la obra destacada, la filmografía completa y los colaboradores
 * frecuentes. Incluye SEO completo con JSON-LD de tipo `Person` u `Organization`.
 * Si la entidad no existe o hay un error, muestra un estado vacío con enlace al catálogo.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { useParams, Link } from 'react-router-dom';

// ─── Componentes ─────────────────────────────────────────────────────────────

import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import EntityHero from './components/EntityHero';
import EntityPopularityStats from './components/EntityPopularityStats';
import EntityFilmography from './components/EntityFilmography';
import EntityTopWork from './components/EntityTopWork';
import EntityRelated from './components/EntityRelated';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useEntity, TYPE_LABELS, TYPE_ICONS } from '@/hooks/useEntity';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { getSiteUrl } from '@/lib/site';

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/** Esqueleto de carga animado mientras se resuelven los datos de la entidad. */
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)] animate-pulse">
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

/** Props del componente de biografía expandible. */
interface EntityBioProps {
  /** Texto completo de la bio. */
  bio: string;
  /** Nombre de la entidad, usado en el encabezado "Sobre X". */
  name: string;
}

/**
 * Bio de la entidad con truncado a 300 caracteres y botón "Leer más / menos".
 *
 * @param bio  - Texto completo de la biografía.
 * @param name - Nombre de la entidad para el encabezado de sección.
 */
function EntityBio({ bio, name }: EntityBioProps) {
  // ─── Estado ─────────────────────────────────────────────────────────────

  const [expanded, setExpanded] = useState(false);

  // ─── Datos derivados ────────────────────────────────────────────────────

  const isLong   = bio.length > 300;
  const displayed = isLong && !expanded ? bio.slice(0, 300) + '…' : bio;

  // ─── Renderizado ────────────────────────────────────────────────────────

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

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EntityPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { entity, items, loading, error } = useEntity(slug);

  // ─── Renderizado: carga ──────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="pt-14 md:pt-0 md:pl-64"><PageSkeleton /></div>
      </>
    );
  }

  // ─── Renderizado: error / entidad no encontrada ──────────────────────────

  if (error || !entity) {
    return (
      <div className="min-h-screen bg-[var(--surface)] dark:bg-[var(--bg)] flex flex-col">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 pt-14 md:pt-0 md:pl-64">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <i className="ri-user-unfollow-line text-3xl"></i>
          </div>
          <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Entidad no encontrada</p>
          {error && <p className="text-sm text-red-500 max-w-xs text-center">{error}</p>}
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

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const typeLabel = TYPE_LABELS[entity.type] ?? entity.type;

  /** Structured data JSON-LD: `Person` para roles creativos, `Organization` para estudios. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['actor', 'director', 'author', 'artist'].includes(entity.type) ? 'Person' : 'Organization',
    name: entity.name,
    description: entity.bio ?? undefined,
    image: entity.image_url ?? undefined,
    url: `${getSiteUrl()}/entity/${slug}`,
  };

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)]">
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
      <Sidebar />

      <div className="pt-14 md:pt-0 md:pl-64">
        <EntityHero entity={entity} items={items} slug={slug} />

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
          {entity.bio && <EntityBio bio={entity.bio} name={entity.name} />}

          {items.length > 0 && <EntityPopularityStats items={items} />}

          {items.length > 0 && <EntityTopWork items={items} />}

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

          <EntityRelated items={items} currentSlug={slug} />
        </div>
      </div>
    </div>
  );
}
