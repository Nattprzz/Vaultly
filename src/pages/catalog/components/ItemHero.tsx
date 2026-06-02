import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ItemDetail } from '@/mocks/itemDetail';
import { CATEGORIES } from '@/mocks/catalog';

interface Props {
  item: ItemDetail;
}

export default function ItemHero({ item }: Props) {
  const cat = CATEGORIES.find(c => c.id === item.category);
  const navigate = useNavigate();

  // Refs for staggered reveal
  const backdropRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items: [React.RefObject<HTMLElement | null>, number][] = [
      [backdropRef, 0],
      [coverRef, 100],
      [breadcrumbRef, 150],
      [badgeRef, 200],
      [titleRef, 280],
      [metaRef, 360],
      [ratingRef, 430],
      [tagsRef, 500],
    ];

    const timers = items.map(([ref, delay]) =>
      setTimeout(() => {
        ref.current?.classList.add('sr-visible');
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [item.id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`/catalog/${item.category}`);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef as React.RefObject<HTMLDivElement>}
        className="sr-item relative w-full h-[380px] md:h-[480px] overflow-hidden"
      >
        <img
          src={item.backdrop}
          alt={item.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-black/30 to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-50/90 dark:from-zinc-950/90 via-transparent to-transparent"></div>
      </div>

      {/* Floating info over backdrop */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6 -mt-24 md:-mt-36 relative z-10">

          {/* Cover — mobile only */}
          <div
            ref={coverRef as React.RefObject<HTMLDivElement>}
            className="sr-item-scale flex-shrink-0 w-36 md:w-48 lg:hidden"
          >
            <div className="w-36 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900">
              <img src={item.cover} alt={item.title} className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Text info */}
          <div className="flex-1 pt-0 md:pt-20">

            {/* Breadcrumb + back */}
            <div
              ref={breadcrumbRef as React.RefObject<HTMLDivElement>}
              className="sr-item-up flex items-center gap-2 text-xs text-zinc-500 mb-3 flex-wrap"
            >
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-arrow-left-line text-xs"></i>
                Volver
              </button>
              <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600"></i>
              <Link
                to={`/catalog/${item.category}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-colors"
              >
                {cat?.label}
              </Link>
              <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600"></i>
              <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">{item.title}</span>
            </div>

            {/* Category badge */}
            <div
              ref={badgeRef as React.RefObject<HTMLDivElement>}
              className="sr-item inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ background: `${cat?.accent}20`, color: cat?.accent }}
            >
              <i className={cat?.icon}></i>
              {cat?.label}
            </div>

            <h1
              ref={titleRef as React.RefObject<HTMLHeadingElement>}
              className="sr-item text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-3 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {item.title}
            </h1>

            {/* Meta row */}
            <div
              ref={metaRef as React.RefObject<HTMLDivElement>}
              className="sr-item flex flex-wrap items-center gap-3 mb-4 text-sm text-zinc-500 dark:text-zinc-400"
            >
              <span>{item.year}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
              <span>{item.genre}</span>
              {item.duration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                  <span>{item.duration}</span>
                </>
              )}
              {item.seasons && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                  <span>{item.seasons} temporadas · {item.episodes} ep.</span>
                </>
              )}
              {item.pages && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                  <span>{item.pages} páginas</span>
                </>
              )}
            </div>

            {/* Rating */}
            <div
              ref={ratingRef as React.RefObject<HTMLDivElement>}
              className="sr-item flex items-center gap-3 mb-4"
            >
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <i key={s} className={`text-lg ${s <= Math.round(item.rating / 2) ? 'ri-star-fill text-amber-400' : 'ri-star-line text-zinc-300 dark:text-zinc-600'}`}></i>
                ))}
                <span className="text-2xl font-black text-zinc-900 dark:text-white ml-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.rating}
                </span>
                <span className="text-sm text-zinc-400">/10</span>
              </div>
              <span className="text-sm text-zinc-400 hidden sm:inline">
                {item.total_ratings.toLocaleString()} valoraciones
              </span>
            </div>

            {/* Tags */}
            <div
              ref={tagsRef as React.RefObject<HTMLDivElement>}
              className="sr-item flex flex-wrap gap-2"
            >
              {item.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
