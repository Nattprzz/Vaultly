/**
 * ItemHero.tsx — hero cinematográfico de la página de detalle de un ítem.
 *
 * Muestra un banner de fondo (backdrop) a pantalla completa con gradiente
 * degradado hacia el fondo de la app, y una portada que se superpone al banner.
 * Junto a la portada presenta el título, metadatos (año, género, duración,
 * temporadas, páginas), puntuación con estrellas y tags de género.
 * Los tres bloques (backdrop, portada e info) aparecen con una animación
 * secuencial de entrada staggered mediante clases CSS y setTimeout.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link, useNavigate } from 'react-router-dom';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import { ItemDetail } from '@/types/itemDetail';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useCategories } from '@/hooks/useCategoryColors';

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del hero de detalle de ítem. */
interface Props {
  item: ItemDetail;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ItemHero({ item }: Props) {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const CATEGORIES = useCategories();
  const cat = CATEGORIES.find(c => c.id === item.category);
  const navigate = useNavigate();

  const backdropRef = useRef<HTMLDivElement>(null);
  const posterRef   = useRef<HTMLDivElement>(null);
  const infoRef     = useRef<HTMLDivElement>(null);

  // ─── Efectos ──────────────────────────────────────────────────────────────

  // Animación de entrada staggered: backdrop → portada → info
  useEffect(() => {
    const schedule: [React.RefObject<HTMLElement | null>, number][] = [
      [backdropRef, 0],
      [posterRef, 80],
      [infoRef, 160],
    ];

    const timers = schedule.map(([ref, delay]) =>
      setTimeout(() => ref.current?.classList.add('sr-visible'), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [item.id]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /** Vuelve a la página anterior o al listado de la categoría si no hay historial. */
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/catalog/${item.category}`);
  };

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const filledStars = Math.round(item.rating);

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <>
      {/* Banner de fondo cinematic con gradiente */}
      <div
        ref={backdropRef as React.RefObject<HTMLDivElement>}
        className="sr-item relative w-full h-[260px] md:h-[320px] overflow-hidden"
      >
        {item.backdrop ? (
          <img
            src={item.backdrop}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${cat?.accent ?? '#3b82f6'}30 0%, #09090b 100%)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/50 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/80 via-transparent to-transparent" />
      </div>

      {/* Portada e información superpuestas al banner */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="-mt-20 md:-mt-28 relative z-10 flex flex-col sm:flex-row gap-5 md:gap-8 items-start">

          {/* Portada */}
          <div
            ref={posterRef as React.RefObject<HTMLDivElement>}
            className="sr-item-scale flex-shrink-0"
          >
            <div className="w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
              {item.cover ? (
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `linear-gradient(160deg, ${cat?.accent ?? '#3b82f6'}20 0%, transparent 70%)` }}
                >
                  <i className={`${cat?.icon ?? 'ri-image-line'} text-4xl opacity-40`} style={{ color: cat?.accent }} />
                </div>
              )}
            </div>
          </div>

          {/* Columna de información */}
          <div
            ref={infoRef as React.RefObject<HTMLDivElement>}
            className="sr-item flex-1 min-w-0 sm:pt-2"
          >
            {/* Migas de pan */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3 flex-wrap">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-arrow-left-line text-xs" />
                Volver
              </button>
              <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600" />
              <Link
                to={`/catalog/${item.category}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {cat?.label}
              </Link>
              <i className="ri-arrow-right-s-line text-zinc-300 dark:text-zinc-600" />
              <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">{item.title}</span>
            </div>

            {/* Badge de categoría */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ background: `${cat?.accent}20`, color: cat?.accent }}
            >
              <i className={cat?.icon} />
              {cat?.label}
            </div>

            {/* Título */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-3 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {item.title}
            </h1>

            {/* Fila de metadatos */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              {item.year > 0 && <span>{item.year}</span>}
              {item.genre && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" />
                  <span>{item.genre}</span>
                </>
              )}
              {item.duration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" />
                  <span>{item.duration}</span>
                </>
              )}
              {item.seasons && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" />
                  <span>{item.seasons} temporadas · {item.episodes} ep.</span>
                </>
              )}
              {item.pages && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" />
                  <span>{item.pages} pág.</span>
                </>
              )}
            </div>

            {/* Puntuación numérica + fila de 10 estrellas */}
            {item.rating > 0 && (
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl font-black text-zinc-900 dark:text-white leading-none"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-zinc-400">/10</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <i
                      key={i}
                      className={`text-sm ${i < filledStars ? 'ri-star-fill text-amber-400' : 'ri-star-line text-zinc-300 dark:text-zinc-600'}`}
                    />
                  ))}
                </div>
                {item.total_ratings > 0 && (
                  <span className="text-xs text-zinc-400 hidden sm:inline">
                    {item.total_ratings.toLocaleString()} valoraciones
                  </span>
                )}
              </div>
            )}

            {/* Tags de género */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
