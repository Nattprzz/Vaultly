import { useParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import SeoHead from '@/components/feature/SeoHead';
import ItemHero from '../components/ItemHero';
import ItemInfo from '../components/ItemInfo';
import ItemGallery from '../components/ItemGallery';
import ItemReviews from '../components/ItemReviews';
import ItemCommunityStats from '../components/ItemCommunityStats';
import ItemTrackerSidebar from '../components/ItemTrackerSidebar';
import RelatedItems from '../components/RelatedItems';
import RelatedPeople from '../components/RelatedPeople';
import { ITEM_DETAIL_MOCK } from '@/mocks/itemDetail';
import { useCatalogItem, getItemYear, getItemRating, getItemGenres, getItemBackdrop, getItemScreenshots } from '@/hooks/useCatalogItem';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { CatalogItemFull } from '@/hooks/useCatalogItem';
import type { ItemDetail } from '@/mocks/itemDetail';
import { SCHEMA_TYPE_BY_APP_CATEGORY, toAppCategory } from '@/lib/categories';
import { getSiteUrl } from '@/lib/site';

// Convert a real CatalogItemFull into the ItemDetail shape the existing components expect
function toItemDetail(item: CatalogItemFull, categoryId: string): ItemDetail {
  const meta = item.metadata ?? {};
  const year = parseInt(getItemYear(item) || '0', 10);
  const rating = getItemRating(item) ?? 0;
  const genres = getItemGenres(item);
  const backdrop = getItemBackdrop(item);
  const screenshots = getItemScreenshots(item);

  const gallery = screenshots.slice(0, 4).map((url, i) => ({
    id: `${item.slug}-shot-${i}`,
    url,
    caption: `${item.title} — imagen ${i + 1}`,
  }));

  const base: ItemDetail = {
    id: item.slug,
    category: categoryId,
    title: item.title,
    cover: item.image_url ?? '',
    backdrop: backdrop ?? item.image_url ?? '',
    rating: Math.round(rating * 10) / 10,
    year,
    genre: genres[0] ?? '',
    description: item.description ?? 'Sin descripción disponible.',
    tags: genres.slice(0, 6),
    community_rating: Math.round(rating * 10) / 10,
    total_ratings: Number(meta.ratings_count ?? meta.vote_count ?? 0),
    total_reviews: 0,
    gallery: gallery.length > 0 ? gallery : undefined,
  };

  // Games (IGDB)
  if (categoryId === 'videojuegos') {
    const devs = meta.developers as string[] | undefined;
    const pubs = meta.publishers as string[] | undefined;
    const plats = meta.platforms as string[] | undefined;
    base.developer = devs?.[0] ?? undefined;
    base.publisher = pubs?.[0] ?? undefined;
    base.platforms = plats ?? undefined;
    base.tags = (meta.tags as string[] | undefined)?.slice(0, 6) ?? genres.slice(0, 6);
  }

  // Movies (TMDB)
  if (categoryId === 'peliculas') {
    base.director = (meta.director as string) ?? undefined;
    base.cast = (meta.cast as string[]) ?? undefined;
    const runtime = meta.runtime as number | undefined;
    if (runtime) base.duration = `${Math.floor(runtime / 60)}h ${runtime % 60}min`;
  }

  // Series (TMDB)
  if (categoryId === 'series') {
    base.cast = (meta.cast as string[]) ?? undefined;
    base.seasons = (meta.seasons as number) ?? undefined;
    base.episodes = (meta.episodes as number) ?? undefined;
    const networks = meta.networks as string[] | undefined;
    base.network = networks?.[0] ?? undefined;
  }

  // Books (Google Books)
  if (categoryId === 'libros') {
    const authors = meta.authors as string[] | undefined;
    base.author = authors?.[0] ?? undefined;
    base.pages = (meta.page_count as number) ?? undefined;
    base.isbn = (meta.isbn as string) ?? undefined;
  }

  if (categoryId === 'conciertos') {
    const artists = meta.artists as string[] | undefined;
    base.artist = artists?.[0] ?? undefined;
    base.venue = (meta.venue as string) ?? undefined;
    base.city = (meta.city as string) ?? undefined;
  }

  return base;
}

function buildJsonLd(item: ItemDetail, categoryId: string) {
  const appCategory = toAppCategory(categoryId);
  const schemaType = appCategory ? SCHEMA_TYPE_BY_APP_CATEGORY[appCategory] : 'CreativeWork';
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: item.title,
    description: item.description,
    image: item.cover,
    url: `${siteUrl}/catalog/${categoryId}/${item.id}`,
    datePublished: String(item.year),
    genre: item.genre,
    ...(item.total_ratings > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: item.community_rating,
            bestRating: 10,
            worstRating: 1,
            ratingCount: item.total_ratings,
            reviewCount: item.total_reviews,
          },
        }
      : {}),
  };
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 animate-pulse">
      <div className="w-full h-[380px] md:h-[480px] bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-2/3"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6"></div>
          </div>
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="aspect-[2/3] bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Source badge ──────────────────────────────────────────────────────────────
function SourceBadge({ source }: { source: string }) {
  const config = {
    cache: { label: 'Desde caché', icon: 'ri-database-2-line', cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    external_cached: { label: 'Guardado en caché', icon: 'ri-save-line', cls: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' },
    external: { label: 'API externa', icon: 'ri-global-line', cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    mock: { label: 'Datos de ejemplo', icon: 'ri-test-tube-line', cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400' },
  }[source] ?? { label: source, icon: 'ri-information-line', cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.cls}`}>
      <i className={config.icon}></i>
      {config.label}
    </span>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ItemDetailPage() {
  const { category = '', id = '' } = useParams<{ category: string; id: string }>();

  // Scroll reveal refs
  const sourceBadgeRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });
  const infoRef = useScrollReveal<HTMLDivElement>();
  const peopleRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px 0px -30px 0px' });
  const galleryRef = useScrollReveal<HTMLDivElement>();
  const statsRef = useScrollReveal<HTMLDivElement>();
  const reviewsRef = useScrollReveal<HTMLDivElement>();
  const sidebarRef = useScrollReveal<HTMLDivElement>({ rootMargin: '0px' });

  // Check mock data first (for pre-seeded items like g1, m1, etc.)
  const mockItem = ITEM_DETAIL_MOCK[id];

  // Always try to fetch real data (unless it's a pure mock id with no slug structure)
  const isRealSlug = id.includes('-') || (!mockItem && id.length > 4);
  const { item: realItem, loading, error, source } = useCatalogItem(isRealSlug ? id : '');

  // Decide which data to show
  const resolvedCategoryId = realItem
    ? (toAppCategory(realItem.category) ?? category)
    : (toAppCategory(category) ?? category);

  const fullItem: ItemDetail | null = realItem
    ? toItemDetail(realItem, resolvedCategoryId)
    : mockItem
      ? { ...mockItem, category: resolvedCategoryId }
      : null;

  const dataSource = realItem ? (source ?? 'external') : (mockItem ? 'mock' : null);

  // Loading state
  if (loading && !mockItem) {
    return (
      <>
        <Navbar />
        <div className="pt-16">
          <DetailSkeleton />
        </div>
      </>
    );
  }

  // Not found
  if (!fullItem && !loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 pt-16">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <i className="ri-file-unknow-line text-3xl"></i>
          </div>
          <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Ítem no encontrado</p>
          {error && <p className="text-sm text-rose-500 max-w-xs text-center">{error}</p>}
          <button
            onClick={() => window.history.length > 1 ? window.history.back() : undefined}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline cursor-pointer"
          >
            Volver al catalogo
          </button>
        </div>
      </div>
    );
  }

  if (!fullItem) return null;

  const jsonLd = buildJsonLd(fullItem, resolvedCategoryId);
  const seoTitle = `${fullItem.title} (${fullItem.year}) — ${fullItem.genre} | Vaultly`;
  const seoDesc = (fullItem.description ?? '').length > 155
    ? `${fullItem.description.slice(0, 152)}...`
    : fullItem.description;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        keywords={`${fullItem.title}, ${fullItem.genre}, ${fullItem.year}, Vaultly`}
        canonical={`/catalog/${resolvedCategoryId}/${id}`}
        ogType="article"
        ogImage={fullItem.cover}
        jsonLd={jsonLd}
      />
      <Navbar />
      <div className="pt-16">
        {/* Hero — has its own internal reveal */}
        <ItemHero item={fullItem} />

        {/* Main content */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

          {/* Source badge row */}
          {dataSource && (
            <div
              ref={sourceBadgeRef}
              className="sr-item flex items-center gap-3 mb-6"
            >
              <SourceBadge source={dataSource} />
              {loading && (
                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Actualizando datos...
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left column ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-10">

              {/* Description + details */}
              <div
                ref={infoRef}
                className="sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
              >
                <ItemInfo item={fullItem} />
              </div>

              {/* Related people / entities */}
              <div ref={peopleRef} className="sr-item">
                <RelatedPeople item={fullItem} itemId={realItem?.id ?? null} />
              </div>

              {/* Gallery */}
              {fullItem.gallery && fullItem.gallery.length > 0 && (
                <div
                  ref={galleryRef}
                  className="sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
                >
                  <ItemGallery gallery={fullItem.gallery} title={fullItem.title} />
                </div>
              )}

              {/* Community stats */}
              <div ref={statsRef} className="sr-item">
                <ItemCommunityStats
                  communityRating={fullItem.community_rating}
                  totalRatings={fullItem.total_ratings}
                  totalReviews={fullItem.total_reviews}
                />
              </div>

              {/* Reviews */}
              <div
                ref={reviewsRef}
                className="sr-item bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
              >
                <ItemReviews
                  itemId={fullItem.id}
                  totalReviews={fullItem.total_reviews}
                  communityRating={fullItem.community_rating}
                />
              </div>
            </div>

            {/* ── Right column: sidebar ── */}
            <div
              ref={sidebarRef}
              className="sr-item-right w-full lg:w-72 flex-shrink-0 flex flex-col gap-6"
            >
              <div className="sticky top-24">
                <ItemTrackerSidebar item={fullItem} />
                <div className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5">
                  <RelatedItems category={resolvedCategoryId} currentId={id} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
