import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { type Person } from '@/mocks/people';

interface Props {
  person: Person;
}

export default function PersonHero({ person }: Props) {
  const avgRating =
    person.works.length > 0
      ? (person.works.reduce((s, w) => s + w.rating, 0) / person.works.length).toFixed(1)
      : '—';

  // Reveal refs
  const backdropRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items: [React.RefObject<HTMLElement | null>, number][] = [
      [backdropRef, 0],
      [photoRef, 100],
      [breadcrumbRef, 120],
      [badgeRef, 200],
      [titleRef, 290],
      [metaRef, 380],
    ];
    const timers = items.map(([ref, delay]) =>
      setTimeout(() => ref.current?.classList.add('sr-visible'), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [person.id]);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>
      {/* Backdrop */}
      <div
        ref={backdropRef as React.RefObject<HTMLDivElement>}
        className="sr-item absolute inset-0 w-full h-full"
      >
        <img
          src={person.backdrop}
          alt={person.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-6 pt-10 pb-8">
        {/* Breadcrumb */}
        <nav
          ref={breadcrumbRef as React.RefObject<HTMLElement>}
          className="sr-item-up flex items-center gap-2 text-xs text-zinc-400 mb-6"
        >
          <Link to="/" className="hover:text-white transition-colors cursor-pointer">Inicio</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link to="/catalog" className="hover:text-white transition-colors cursor-pointer">Catálogo</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-zinc-300">{person.name}</span>
        </nav>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
          {/* Photo */}
          <div
            ref={photoRef as React.RefObject<HTMLDivElement>}
            className="sr-item-scale w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0"
          >
            <img
              src={person.photo}
              alt={person.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Role badge */}
            <span
              ref={badgeRef as React.RefObject<HTMLSpanElement>}
              className="sr-item inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium mb-3"
            >
              <i className="ri-user-star-line"></i>
              {person.role}
            </span>

            <h1
              ref={titleRef as React.RefObject<HTMLHeadingElement>}
              className="sr-item text-3xl md:text-4xl font-black text-white mb-2 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {person.name}
            </h1>

            <div
              ref={metaRef as React.RefObject<HTMLDivElement>}
              className="sr-item flex flex-wrap items-center gap-3 text-sm text-zinc-400"
            >
              <span className="flex items-center gap-1.5">
                <i className="ri-map-pin-line text-xs"></i>
                {person.nationality}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span className="flex items-center gap-1.5">
                <i className="ri-calendar-line text-xs"></i>
                Nacido en {person.birthYear}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span className="flex items-center gap-1.5">
                <i className="ri-film-line text-xs"></i>
                {person.works.length} obras
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span className="flex items-center gap-1.5">
                <i className="ri-star-fill text-amber-400 text-xs"></i>
                <span className="text-white font-semibold">{avgRating}</span>
                <span>media</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
