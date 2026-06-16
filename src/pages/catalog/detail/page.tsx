/**
 * page.tsx — página de detalle de ítem del catálogo.
 *
 * Orquesta la vista completa de un ítem: hero con banner y portada,
 * panel lateral del tracker, navegación sticky por secciones y el
 * contenido paginado (info, reparto, galería, tráiler, estadísticas,
 * reseñas y ítems relacionados). Construye el objeto ItemDetail a partir
 * del registro raw de Supabase usando helpers de metadatos por categoría.
 * Emite JSON-LD para SEO y usa scroll-reveal en las secciones principales.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { useParams, Link, useNavigate } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth }          from '@/hooks/useAuth';
import { useCatalogItem, getItemYear, getItemRating, getItemGenres, getItemBackdrop, getItemScreenshots, getItemTrailers } from '@/hooks/useCatalogItem';
import { useScrollReveal }  from '@/hooks/useScrollReveal';
import { useCategories }    from '@/hooks/useCategoryColors';

// ─── Componentes ──────────────────────────────────────────────────────────────

import Sidebar              from '@/components/feature/Sidebar';
import SeoHead              from '@/components/feature/SeoHead';
import ItemInfo             from '../components/ItemInfo';
import ItemGallery          from '../components/ItemGallery';
import ItemReviews          from '../components/ItemReviews';
import ItemCommunityStats   from '../components/ItemCommunityStats';
import ItemTrackerSidebar   from '../components/ItemTrackerSidebar';
import RelatedItems         from '../components/RelatedItems';
import RelatedPeople        from '../components/RelatedPeople';
import ItemCastSection      from '../components/ItemCastSection';
import ItemTrailerSection   from '../components/ItemTrailerSection';
import ItemMyTracking       from '../components/ItemMyTracking';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CatalogItemFull }             from '@/hooks/useCatalogItem';
import type { ItemDetail, CastMember, CrewMember } from '@/types/itemDetail';

// ─── Constantes ──────────────────────────────────────────────────────────────

import { SCHEMA_TYPE_BY_APP_CATEGORY, toAppCategory } from '@/lib/categories';
import { getSiteUrl }                                  from '@/lib/site';

// ─── Helpers de metadata ──────────────────────────────────────────────────────

/**
 * Extrae la clave de YouTube del trailer desde distintos campos del metadata.
 * @param meta - Objeto metadata del ítem.
 * @returns ID del vídeo de YouTube, o undefined si no se encuentra.
 */
function extractTrailerKey(meta: Record<string, unknown>): string | undefined {
  if (typeof meta.trailer_key === 'string' && meta.trailer_key) return meta.trailer_key;
  if (typeof meta.trailer_url === 'string') {
    const m = (meta.trailer_url as string).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (m?.[1]) return m[1];
  }
  const trailers = meta.trailers as { url?: string; source?: string }[] | undefined;
  if (Array.isArray(trailers)) {
    const trailer = trailers.find(v => v.source === 'youtube' && v.url)
      ?? trailers.find(v => typeof v.url === 'string' && /(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(v.url));
    const m = trailer?.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (m?.[1]) return m[1];
  }
  const videos = meta.videos as { key?: string; site?: string; type?: string }[] | undefined;
  if (Array.isArray(videos)) {
    const t = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
      ?? videos.find(v => v.site === 'YouTube');
    if (t?.key) return t.key;
  }
  return undefined;
}

type RawPerson = Record<string, unknown>;

/**
 * Extrae el reparto con fotos desde los distintos campos posibles del metadata.
 * @param meta - Objeto metadata del ítem.
 * @returns Array de hasta 12 miembros del reparto con nombre, personaje y foto.
 */
function extractCastDetailed(meta: Record<string, unknown>): CastMember[] {
  const buildFrom = (arr: unknown[]): CastMember[] | null => {
    if (!arr.length) return null;
    if (typeof arr[0] === 'object' && arr[0] !== null) {
      return (arr as RawPerson[]).slice(0, 12).map(m => ({
        name:      String(m.name ?? ''),
        character: String(m.character ?? m.character_name ?? ''),
        photo: m.photo
          ? String(m.photo)
          : m.profile_path
            ? `https://image.tmdb.org/t/p/w185${m.profile_path}`
            : null,
      })).filter(m => m.name);
    }
    if (typeof arr[0] === 'string') {
      return (arr as string[]).slice(0, 12).map(name => ({ name, character: '', photo: null }));
    }
    return null;
  };

  const direct = meta.cast_detailed ?? meta.cast_with_characters ?? meta.cast;
  if (Array.isArray(direct)) {
    const r = buildFrom(direct);
    if (r?.length) return r;
  }
  const credits = (meta.credits as { cast?: unknown[] } | undefined)?.cast;
  if (Array.isArray(credits)) {
    const r = buildFrom(credits);
    if (r?.length) return r;
  }
  return [];
}

/**
 * Extrae el equipo técnico relevante (director, guion, música, etc.) del metadata.
 * @param meta - Objeto metadata del ítem.
 * @returns Array de miembros del equipo con nombre y trabajo.
 */
function extractCrewDetailed(meta: Record<string, unknown>): CrewMember[] {
  const result: CrewMember[] = [];
  if (typeof meta.director   === 'string' && meta.director)   result.push({ name: meta.director,   job: 'Director' });
  if (typeof meta.screenplay === 'string' && meta.screenplay) result.push({ name: meta.screenplay, job: 'Guion'    });
  if (typeof meta.composer   === 'string' && meta.composer)   result.push({ name: meta.composer,   job: 'Música'   });

  const IMPORTANT = new Set(['Director', 'Screenplay', 'Writer', 'Original Music Composer', 'Producer', 'Director of Photography']);
  const rawCrew = (meta.crew ?? (meta.credits as { crew?: RawPerson[] } | undefined)?.crew) as RawPerson[] | undefined;
  if (Array.isArray(rawCrew)) {
    rawCrew.forEach(m => {
      const name = String(m.name ?? '');
      const job  = String(m.job  ?? '');
      if (name && IMPORTANT.has(job) && !result.some(r => r.name === name && r.job === job)) {
        result.push({ name, job });
      }
    });
  }
  return result;
}

// ─── toItemDetail ─────────────────────────────────────────────────────────────

/**
 * Construye un objeto ItemDetail tipado a partir del registro raw de Supabase.
 * Normaliza los campos de metadata de cada categoría al modelo compartido.
 * @param item       - Registro completo de Supabase.
 * @param categoryId - Identificador de categoría normalizado.
 * @returns Objeto ItemDetail listo para consumo de componentes.
 */
function toItemDetail(item: CatalogItemFull, categoryId: string): ItemDetail {
  const meta        = item.metadata ?? {};
  const year        = parseInt(getItemYear(item) || '0', 10);
  const rating      = getItemRating(item) ?? 0;
  const genres      = getItemGenres(item);
  const backdrop    = getItemBackdrop(item);
  const screenshots = getItemScreenshots(item);
  const trailers    = getItemTrailers(item);

  const backdropList: string[] = [];
  backdropList.push(...screenshots);
  const extra = meta.backdrop_list as string[] | undefined;
  if (Array.isArray(extra)) backdropList.push(...extra);
  const uniqueBackdrops = [...new Set(backdropList)];

  const gallery = uniqueBackdrops.slice(0, 8).map((url, i) => ({
    id:      `${item.slug}-shot-${i}`,
    url,
    caption: `${item.title} — imagen ${i + 1}`,
  }));

  const trailerKey   = extractTrailerKey(meta);
  const castDetailed = extractCastDetailed(meta);
  const crewDetailed = extractCrewDetailed(meta);
  const ratingCount  = meta.rating_count ?? meta.ratings_count ?? meta.vote_count ?? 0;

  const base: ItemDetail = {
    id:               item.slug,
    category:         categoryId,
    title:            item.title,
    cover:            item.image_url ?? '',
    backdrop:         backdrop ?? item.image_url ?? '',
    rating:           Math.round(rating * 10) / 10,
    year,
    genre:            genres[0] ?? '',
    description:      item.description ?? 'Sin descripción disponible.',
    tags:             genres.slice(0, 6),
    community_rating: Math.round(rating * 10) / 10,
    total_ratings:    Number(ratingCount),
    total_reviews:    0,
    gallery:          gallery.length > 0 ? gallery : undefined,
    trailer_key:      trailerKey,
    trailers:         trailers.length > 0 ? trailers : undefined,
    cast_detailed:    castDetailed.length > 0 ? castDetailed : undefined,
    crew_detailed:    crewDetailed.length > 0 ? crewDetailed : undefined,
    backdrops:        uniqueBackdrops.length > 0 ? uniqueBackdrops : undefined,
  };

  if (categoryId === 'peliculas') {
    base.director             = meta.director as string | undefined;
    base.cast                 = meta.cast as string[] | undefined;
    const runtime             = meta.runtime as number | undefined;
    if (runtime) base.duration = `${Math.floor(runtime / 60)}h ${runtime % 60}min`;
    base.original_language    = meta.original_language as string | undefined;
    const oc                  = meta.origin_country as string[] | string | undefined;
    base.origin_country       = Array.isArray(oc) ? oc[0] : (oc ?? undefined);
    base.production_companies = (meta.production_companies as string[] | undefined)?.slice(0, 3);
    base.keywords             = (meta.keywords as string[] | undefined)?.slice(0, 12);
  }

  if (categoryId === 'series') {
    base.cast                 = meta.cast as string[] | undefined;
    base.seasons              = meta.seasons as number | undefined;
    base.episodes             = meta.episodes as number | undefined;
    const nets                = meta.networks as string[] | undefined;
    base.network              = nets?.[0];
    const runtime             = meta.runtime as number | undefined;
    if (runtime) base.duration = `${runtime} min/ep`;
    base.original_language    = meta.original_language as string | undefined;
    const oc                  = meta.origin_country as string[] | string | undefined;
    base.origin_country       = Array.isArray(oc) ? oc[0] : (oc ?? undefined);
    base.last_air_date        = meta.last_air_date as string | undefined;
    base.series_status        = meta.status as string | undefined;
    base.production_companies = (meta.production_companies as string[] | undefined)?.slice(0, 3);
    base.keywords             = (meta.keywords as string[] | undefined)?.slice(0, 12);
  }

  if (categoryId === 'videojuegos') {
    const devs                = meta.developers as string[] | undefined;
    const pubs                = meta.publishers as string[] | undefined;
    base.developer            = devs?.[0];
    base.publisher            = pubs?.[0];
    base.platforms            = meta.platforms as string[] | undefined;
    base.tags                 = (meta.tags as string[] | undefined)?.slice(0, 6) ?? genres.slice(0, 6);
    base.metacritic           = meta.metacritic != null ? Number(meta.metacritic) : undefined;
    base.website              = meta.website as string | undefined;
    base.interactive_map_url  = meta.interactive_map_url as string | undefined;
    base.interactive_map_source = meta.interactive_map_source as string | undefined;
    base.esrb                 = (meta.esrb_rating as string) ?? (meta.esrb as string) ?? undefined;
    base.playtime             = meta.playtime != null ? Number(meta.playtime) : undefined;
    base.achievements_count   = meta.achievements_count != null ? Number(meta.achievements_count) : undefined;
  }

  if (categoryId === 'libros') {
    const authors  = meta.authors as string[] | undefined;
    base.author    = authors?.[0];
    base.authors   = authors;
    base.pages     = meta.page_count as number | undefined;
    base.isbn      = meta.isbn as string | undefined;
    base.language  = meta.language as string | undefined;
    const pub      = meta.publisher as string | string[] | undefined;
    base.publisher = Array.isArray(pub) ? pub[0] : pub;
  }

  if (categoryId === 'conciertos') {
    const artists   = meta.artists as string[] | undefined;
    base.artist     = artists?.[0];
    base.venue      = meta.venue as string | undefined;
    base.city       = meta.city as string | undefined;
    base.country    = meta.country as string | undefined;
    base.event_date = (meta.date as string) ?? (meta.start_date as string) ?? undefined;
    base.event_time = meta.start_time as string | undefined;
  }

  return base;
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

/**
 * Genera el objeto JSON-LD de Schema.org para el ítem.
 * @param item       - Datos del ítem.
 * @param categoryId - Categoría normalizada de la app.
 * @returns Objeto JSON-LD listo para ser incrustado en la página.
 */
function buildJsonLd(item: ItemDetail, categoryId: string) {
  const appCategory = toAppCategory(categoryId);
  const schemaType  = appCategory ? SCHEMA_TYPE_BY_APP_CATEGORY[appCategory] : 'CreativeWork';
  const siteUrl     = getSiteUrl();
  return {
    '@context':    'https://schema.org',
    '@type':       schemaType,
    name:          item.title,
    description:   item.description,
    image:         item.cover,
    url:           `${siteUrl}/catalog/${categoryId}/${item.id}`,
    datePublished: String(item.year),
    genre:         item.genre,
    ...(item.total_ratings > 0
      ? {
          aggregateRating: {
            '@type':      'AggregateRating',
            ratingValue:  item.community_rating,
            bestRating:   10,
            worstRating:  1,
            ratingCount:  item.total_ratings,
            reviewCount:  item.total_reviews,
          },
        }
      : {}),
  };
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/** Skeleton de carga mientras se obtiene el ítem de Supabase. */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="w-full h-[280px] bg-[var(--surface-raised)]" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row gap-5 lg:gap-8 -mt-20 lg:-mt-24 relative z-10 items-start">
          <div className="w-32 sm:w-40 lg:w-48 aspect-[2/3] bg-[var(--surface-raised)] rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0 pt-4 sm:pt-14 lg:pt-20 flex flex-col gap-3">
            <div className="h-3 bg-[var(--surface-raised)] rounded w-28" />
            <div className="h-8 bg-[var(--surface-raised)] rounded-xl w-2/3" />
            <div className="h-4 bg-[var(--surface-raised)] rounded w-1/2" />
            <div className="h-7 bg-[var(--surface-raised)] rounded w-1/3" />
            <div className="flex gap-2 flex-wrap">
              <div className="h-6 bg-[var(--surface-raised)] rounded-full w-16" />
              <div className="h-6 bg-[var(--surface-raised)] rounded-full w-20" />
            </div>
            <div className="h-14 bg-[var(--surface-raised)] rounded w-full max-w-prose mt-1" />
          </div>
          <div className="w-full sm:min-w-[260px] lg:w-72 flex-shrink-0 sm:pt-14 lg:pt-20">
            <div className="h-64 bg-[var(--surface-raised)] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Badge de fuente de datos visible solo para administradores.
 * @param source - Identificador de la fuente ('cache', 'external', etc.).
 */
function SourceBadge({ source }: { source: string }) {
  const config = {
    cache:           { label: 'Desde caché',        icon: 'ri-database-2-line', cls: 'bg-emerald-900/30 text-emerald-400 border-emerald-800' },
    external_cached: { label: 'Guardado en caché',  icon: 'ri-save-line',       cls: 'bg-sky-900/30 text-sky-400 border-sky-800'             },
    external:        { label: 'API externa',         icon: 'ri-global-line',     cls: 'bg-amber-900/30 text-amber-400 border-amber-800'        },
    mock:            { label: 'Datos de ejemplo',    icon: 'ri-test-tube-line',  cls: 'bg-zinc-800 text-zinc-400 border-zinc-700'              },
  }[source] ?? { label: source, icon: 'ri-information-line', cls: 'bg-zinc-800 text-zinc-400 border-zinc-700' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.cls}`}>
      <i className={config.icon}></i>
      {config.label}
    </span>
  );
}

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Definición de una pestaña de la navegación sticky. */
interface Tab { id: string; label: string; icon: string }

// ─── Componente principal ────────────────────────────────────────────────────

export default function ItemDetailPage() {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const { category = '', id = '' } = useParams<{ category: string; id: string }>();
  const navigate   = useNavigate();
  const CATEGORIES = useCategories();
  const { profile, isLoggedIn } = useAuth();
  const isAdmin    = profile?.role === 'admin';

  const infoRef    = useScrollReveal<HTMLElement>();
  const peopleRef  = useScrollReveal<HTMLElement>({ rootMargin: '0px 0px -30px 0px' });
  const galleryRef = useScrollReveal<HTMLElement>();
  const statsRef   = useScrollReveal<HTMLElement>();
  const reviewsRef = useScrollReveal<HTMLElement>();

  const { item: realItem, loading, error, source } = useCatalogItem(id, category);

  const resolvedCategoryId = realItem
    ? (toAppCategory(realItem.category) ?? category)
    : (toAppCategory(category) ?? category);

  const fullItem: ItemDetail | null = realItem
    ? toItemDetail(realItem, resolvedCategoryId)
    : null;

  const cat        = fullItem ? CATEGORIES.find(c => c.id === fullItem.category) : null;
  const dataSource = realItem ? (source ?? 'external') : null;

  const [activeSection, setActiveSection] = useState('info');

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const visibleTabs = useMemo((): Tab[] => {
    if (!fullItem) return [];
    const tabs: Tab[] = [
      { id: 'info', label: 'Información', icon: 'ri-information-line' },
    ];
    if (isLoggedIn) {
      tabs.push({ id: 'mi-seguimiento', label: 'Mi seguimiento', icon: 'ri-bookmark-line' });
    }
    if (fullItem.cast_detailed?.length || fullItem.cast?.length) {
      tabs.push({ id: 'cast', label: 'Reparto', icon: 'ri-user-star-line' });
    }
    if (fullItem.gallery?.length) {
      tabs.push({ id: 'media', label: 'Imágenes', icon: 'ri-image-line' });
    }
    if (fullItem.trailer_key) {
      tabs.push({ id: 'videos', label: 'Vídeos', icon: 'ri-play-circle-line' });
    }
    tabs.push({ id: 'related', label: 'Relacionados', icon: 'ri-grid-line' });
    return tabs;
  }, [fullItem, isLoggedIn]);

  // ─── Efectos ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!fullItem) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (top.target.id) setActiveSection(top.target.id);
        }
      },
      { threshold: 0, rootMargin: '-15% 0px -60% 0px' },
    );
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [fullItem]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /**
   * Desplaza la página a la sección indicada con offset para la navegación fija.
   * @param sectionId - id del elemento de sección destino.
   */
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const mobileNav  = window.innerWidth < 768 ? 56 : 0;
    const stickyTabs = 48;
    const gap        = 8;
    const top = el.getBoundingClientRect().top + window.scrollY - mobileNav - stickyTabs - gap;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // ─── Renderizado ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <div className="pt-14 md:pt-0 md:pl-64">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (!fullItem && !loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-14 md:pt-0 md:pl-64">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[var(--surface-raised)]">
            <i className="ri-file-unknow-line text-3xl text-[var(--text-tertiary)]"></i>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">Ítem no encontrado</p>
          {error && <p className="text-sm text-[var(--state-danger)] max-w-xs text-center">{error}</p>}
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/catalog'))}
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] underline cursor-pointer"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  if (!fullItem) return null;

  const jsonLd      = buildJsonLd(fullItem, resolvedCategoryId);
  const seoTitle    = `${fullItem.title} (${fullItem.year}) — ${fullItem.genre} | Vaultly`;
  const seoDesc     = (fullItem.description ?? '').length > 155
    ? `${fullItem.description.slice(0, 152)}...`
    : fullItem.description;
  const filledStars = Math.round(fullItem.rating);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        keywords={`${fullItem.title}, ${fullItem.genre}, ${fullItem.year}, Vaultly`}
        canonical={`/catalog/${resolvedCategoryId}/${id}`}
        ogType="article"
        ogImage={fullItem.cover}
        jsonLd={jsonLd}
      />
      <Sidebar />

      <div className="pt-14 md:pt-0 md:pl-64">

        {/* Banner de fondo con gradiente hacia zinc-950 */}
        <div className="relative w-full h-[280px] overflow-hidden select-none">
          {fullItem.backdrop ? (
            <img
              src={fullItem.backdrop}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(135deg, ${cat?.accent ?? '#3b82f6'}25 0%, #09090b 100%)` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] to-transparent opacity-60" />
        </div>

        {/* Portada, información y panel lateral del tracker */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row gap-5 lg:gap-8 -mt-20 lg:-mt-24 relative z-10 items-start">

            {/* Portada */}
            <div className="flex-shrink-0">
              <div
                className="w-32 sm:w-40 lg:w-48 aspect-[2/3] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)' }}
              >
                {fullItem.cover ? (
                  <img
                    src={fullItem.cover}
                    alt={fullItem.title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(160deg, ${cat?.accent ?? '#3b82f6'}20 0%, transparent 70%)` }}
                  >
                    <i
                      className={`${cat?.icon ?? 'ri-image-line'} text-4xl opacity-30`}
                      style={{ color: cat?.accent }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Información del ítem */}
            <div className="flex-1 min-w-0 pt-4 sm:pt-14 lg:pt-20">

              {/* Migas de pan */}
              <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-4 flex-wrap">
                <button
                  onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(`/catalog/${fullItem.category}`))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-arrow-left-line text-xs" />
                  Volver
                </button>
                <i className="ri-arrow-right-s-line text-[var(--border-strong)]" />
                <Link
                  to={`/catalog/${fullItem.category}`}
                  className="hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  {cat?.label}
                </Link>
                <i className="ri-arrow-right-s-line text-[var(--border-strong)]" />
                <span className="text-[var(--text-secondary)] truncate max-w-[200px]">{fullItem.title}</span>
              </div>

              {/* Badge de categoría */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: `${cat?.accent ?? '#3b82f6'}18`, color: cat?.accent ?? '#3b82f6' }}
              >
                <i className={cat?.icon} />
                {cat?.label}
              </div>

              {/* Título */}
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-3 leading-[1.05]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {fullItem.title}
              </h1>

              {/* Fila de metadatos */}
              <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-[var(--text-secondary)]">
                {fullItem.year > 0 && <span>{fullItem.year}</span>}
                {fullItem.genre && (
                  <><span className="text-[var(--border)]">·</span><span>{fullItem.genre}</span></>
                )}
                {fullItem.duration && (
                  <><span className="text-[var(--border)]">·</span><span>{fullItem.duration}</span></>
                )}
                {fullItem.seasons && (
                  <><span className="text-[var(--border)]">·</span><span>{fullItem.seasons} temp. · {fullItem.episodes} ep.</span></>
                )}
                {fullItem.pages && (
                  <><span className="text-[var(--border)]">·</span><span>{fullItem.pages} pág.</span></>
                )}
              </div>

              {/* Puntuación comunitaria */}
              {fullItem.rating > 0 && (
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-4xl font-black text-[var(--text-primary)] leading-none"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {fullItem.rating.toFixed(1)}
                    </span>
                    <span className="text-[var(--text-tertiary)] text-sm">/10</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 10 }, (_, i) => (
                      <i
                        key={i}
                        className={`text-sm ${i < filledStars ? 'ri-star-fill text-amber-400' : 'ri-star-line text-[var(--border-strong)]'}`}
                      />
                    ))}
                  </div>
                  {fullItem.total_ratings > 0 && (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {fullItem.total_ratings.toLocaleString()} valoraciones
                    </span>
                  )}
                </div>
              )}

              {/* Tags de género */}
              {fullItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {fullItem.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Descripción corta (primeras 3 líneas) */}
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm line-clamp-3 max-w-prose">
                {fullItem.description}
              </p>

              {dataSource && isAdmin && (
                <div className="mt-3">
                  <SourceBadge source={dataSource} />
                </div>
              )}
            </div>

            {/* Panel lateral del tracker */}
            <div className="w-full sm:w-auto sm:min-w-[260px] lg:w-72 flex-shrink-0 sm:pt-14 lg:pt-20">
              <div className="sticky top-6">
                <ItemTrackerSidebar item={fullItem} />
              </div>
            </div>

          </div>
        </div>

        {/* Navegación sticky por secciones */}
        {visibleTabs.length > 1 && (
          <div className="sticky top-14 md:top-0 z-20 mt-6 bg-[var(--bg)]/98 backdrop-blur-sm border-b border-[var(--border)]">
            <div className="max-w-screen-xl mx-auto px-4 md:px-6">
              <div
                className="flex items-center gap-0.5 overflow-x-auto py-1.5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {visibleTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                      activeSection === tab.id
                        ? 'bg-[var(--surface-raised)] text-[var(--text-primary)]'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]'
                    }`}
                  >
                    <i className={`${tab.icon} text-sm`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Secciones de contenido */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-8 mt-8 pb-16">

            {/* Información y ficha técnica */}
            <section
              id="info"
              data-section
              ref={infoRef}
              className="sr-item bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
            >
              <ItemInfo item={fullItem} rawItem={realItem ?? undefined} />
            </section>

            {/* Mi seguimiento */}
            {isLoggedIn && (
              <section
                id="mi-seguimiento"
                data-section
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
              >
                <ItemMyTracking item={fullItem} />
              </section>
            )}

            {/* Reparto del ítem */}
            {fullItem.cast_detailed && fullItem.cast_detailed.length > 0 && (
              <section
                id="cast"
                data-section
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
              >
                <ItemCastSection
                  cast={fullItem.cast_detailed}
                  sectionTitle={
                    fullItem.category === 'conciertos' ? 'Artistas' :
                    fullItem.category === 'libros'     ? 'Autores'  :
                    'Reparto principal'
                  }
                />
              </section>
            )}

            {/* Personas y estudios desde la BD de entidades */}
            <section ref={peopleRef} className="sr-item">
              <RelatedPeople item={fullItem} itemId={realItem?.id ?? null} />
            </section>

            {/* Galería de imágenes */}
            {fullItem.gallery && fullItem.gallery.length > 0 && (
              <section
                id="media"
                data-section
                ref={galleryRef}
                className="sr-item bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
              >
                <ItemGallery gallery={fullItem.gallery} title={fullItem.title} />
              </section>
            )}

            {/* Tráiler oficial */}
            {fullItem.trailer_key && (
              <section
                id="videos"
                data-section
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
              >
                <ItemTrailerSection trailerKey={fullItem.trailer_key} title={fullItem.title} />
              </section>
            )}

            {/* Estadísticas de la comunidad */}
            <section ref={statsRef} className="sr-item">
              <ItemCommunityStats
                communityRating={fullItem.community_rating}
                totalRatings={fullItem.total_ratings}
                totalReviews={fullItem.total_reviews}
              />
            </section>

            {/* Reseñas públicas */}
            <section
              ref={reviewsRef}
              className="sr-item bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
            >
              <ItemReviews
                itemId={fullItem.id}
                totalReviews={fullItem.total_reviews}
                communityRating={fullItem.community_rating}
              />
            </section>

            {/* Ítems relacionados */}
            <section
              id="related"
              data-section
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
            >
              <RelatedItems category={resolvedCategoryId} currentId={id} itemId={realItem?.id ?? null} />
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
