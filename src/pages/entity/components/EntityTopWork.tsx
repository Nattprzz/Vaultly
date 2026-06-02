import { Link } from 'react-router-dom';
import type { EntityItem } from '@/hooks/useEntity';
import { CATEGORIES } from '@/mocks/catalog';
import { toAppCategory } from '@/lib/categories';

interface Props {
  items: EntityItem[];
}

function getItemRating(item: EntityItem): number | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r) : null;
}

export default function EntityTopWork({ items }: Props) {
  const rated = items.filter(i => getItemRating(i) != null);
  if (rated.length < 2) return null;

  const topWork = rated.reduce((best, i) =>
    (getItemRating(i) ?? 0) > (getItemRating(best) ?? 0) ? i : best,
    rated[0]
  );

  const rating = getItemRating(topWork) ?? 0;
  const year = topWork.release_date?.slice(0, 4) ?? '';
  const categoryId = toAppCategory(topWork.category) ?? topWork.category;
  const cat = CATEGORIES.find(c => c.id === categoryId);

  const genre = (() => {
    const g = topWork.metadata?.genres ?? topWork.metadata?.genre;
    if (Array.isArray(g)) return g[0] ?? '';
    return String(g ?? '');
  })();

  // Rating bar fill
  const fillPct = (rating / 10) * 100;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden mb-8">
      <div className="flex flex-col sm:flex-row">
        {/* Cover */}
        <div className="relative w-full sm:w-48 flex-shrink-0">
          <div className="aspect-[2/3] sm:aspect-auto sm:h-full min-h-[200px] bg-zinc-100 dark:bg-zinc-800">
            {topWork.image_url ? (
              <img
                src={topWork.image_url}
                alt={topWork.title}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className={`${cat?.icon ?? 'ri-image-line'} text-4xl text-zinc-300 dark:text-zinc-600`}></i>
              </div>
            )}
          </div>
          {/* Trophy overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
            <i className="ri-trophy-fill text-xs"></i>
            Obra destacada
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {cat && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-semibold mb-3"
                style={{ background: cat.accent }}
              >
                <i className={`${cat.icon} text-xs`}></i>
                {cat.label}
              </span>
            )}

            <h3
              className="text-2xl font-black text-zinc-900 dark:text-white mb-2 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {topWork.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-4">
              {year && (
                <span className="flex items-center gap-1">
                  <i className="ri-calendar-line text-xs"></i>
                  {year}
                </span>
              )}
              {genre && (
                <span className="flex items-center gap-1">
                  <i className="ri-price-tag-3-line text-xs"></i>
                  {genre}
                </span>
              )}
              {topWork.role && (
                <span className="flex items-center gap-1 italic">
                  <i className="ri-user-line text-xs"></i>
                  {topWork.role}
                </span>
              )}
            </div>

            {/* Rating display */}
            <div className="flex items-end gap-3 mb-4">
              <div>
                <p
                  className="text-5xl font-black text-amber-500 leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {rating.toFixed(1)}
                </p>
                <p className="text-xs text-zinc-400 mt-1">de 10 puntos</p>
              </div>
              <div className="flex-1 pb-5">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <div
                      key={n}
                      className="flex-1 h-2 rounded-full transition-all duration-700"
                      style={{
                        background: n <= Math.round(rating)
                          ? (rating >= 9 ? '#10b981' : rating >= 7 ? '#f59e0b' : '#94a3b8')
                          : undefined,
                        backgroundColor: n <= Math.round(rating) ? undefined : 'rgb(228 228 231)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-400">
                  {rating >= 9 ? 'Obra maestra' : rating >= 8 ? 'Excelente' : rating >= 7 ? 'Muy buena' : 'Buena'}
                </p>
              </div>
            </div>
          </div>

          <Link
            to={`/catalog/${categoryId}/${topWork.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap self-start"
          >
            Ver en catálogo
            <i className="ri-arrow-right-line text-sm"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
