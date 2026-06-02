import { Link } from 'react-router-dom';
import { type Person } from '@/mocks/people';

interface Props {
  person: Person;
}

const CATEGORY_LABELS: Record<string, string> = {
  games: 'Videojuego',
  movies: 'Película',
  series: 'Serie',
  books: 'Libro',
  concerts: 'Concierto',
  anime: 'Anime',
};

const CATEGORY_COLORS: Record<string, string> = {
  games: 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400',
  movies: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400',
  series: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  books: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  concerts: 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400',
  anime: 'bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400',
};

export default function PersonWorks({ person }: Props) {
  const sorted = [...person.works].sort((a, b) => b.year - a.year);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2
        className="text-lg font-bold text-zinc-900 dark:text-white mb-5"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Filmografía &amp; Obras
        <span className="ml-2 text-sm font-normal text-zinc-400">({sorted.length})</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sorted.map(work => {
          const isInCatalog = ['g1','g2','g3','g4','g5','g6','m1','m2','s1','s2','b1','c1'].includes(work.id);
          const linkTo = isInCatalog ? `/catalog/${work.category}/${work.id}` : '#';

          return (
            <Link
              key={work.id}
              to={linkTo}
              className={`group flex flex-col gap-2 ${linkTo === '#' ? 'pointer-events-none' : 'cursor-pointer'}`}
            >
              {/* Cover */}
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={work.cover}
                  alt={work.title}
                  title={`${work.title} — ${work.genre}`}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                {/* Rating badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm">
                  <i className="ri-star-fill text-amber-400 text-xs"></i>
                  <span className="text-white text-xs font-semibold">{work.rating}</span>
                </div>
                {/* Hover overlay */}
                {linkTo !== '#' && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <i className="ri-arrow-right-line text-zinc-900 text-sm"></i>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-2 mb-1">
                  {work.title}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[work.category] ?? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                    {CATEGORY_LABELS[work.category] ?? work.category}
                  </span>
                  <span className="text-xs text-zinc-400">{work.year}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5 italic">{work.role}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
