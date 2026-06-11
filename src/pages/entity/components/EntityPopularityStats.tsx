import { useMemo } from 'react';
import type { EntityItem } from '@/hooks/useEntity';
import { useCategories } from '@/hooks/useCategoryColors';
import { toAppCategory } from '@/lib/categories';

interface Props {
  items: EntityItem[];
}

function getItemRating(item: EntityItem): number | null {
  const r = item.metadata?.rating;
  return r != null ? Number(r) : null;
}
function getItemYear(item: EntityItem): number | null {
  const y = item.release_date?.slice(0, 4);
  return y ? Number(y) : null;
}
function getItemGenre(item: EntityItem): string {
  const g = item.metadata?.genres ?? item.metadata?.genre;
  if (Array.isArray(g)) return g[0] ?? '';
  return String(g ?? '');
}

export default function EntityPopularityStats({ items }: Props) {
  const CATEGORIES = useCategories();
  const ratedItems = useMemo(() => items.filter(i => getItemRating(i) != null), [items]);

  // ── Rating distribution (0-10 buckets of 1) ──
  const ratingBuckets = useMemo(() => {
    const buckets: Record<string, number> = {};
    for (let i = 1; i <= 10; i++) buckets[String(i)] = 0;
    ratedItems.forEach(item => {
      const r = getItemRating(item) ?? 0;
      const bucket = Math.min(10, Math.max(1, Math.round(r)));
      buckets[String(bucket)] = (buckets[String(bucket)] ?? 0) + 1;
    });
    return Object.entries(buckets).map(([score, count]) => ({ score: Number(score), count }));
  }, [ratedItems]);

  const maxBucketCount = Math.max(...ratingBuckets.map(b => b.count), 1);

  // ── Timeline: avg rating per year ──
  const timeline = useMemo(() => {
    const byYear: Record<number, number[]> = {};
    ratedItems.forEach(item => {
      const y = getItemYear(item);
      const r = getItemRating(item);
      if (y && r != null) {
        if (!byYear[y]) byYear[y] = [];
        byYear[y].push(r);
      }
    });
    return Object.entries(byYear)
      .map(([year, ratings]) => ({
        year: Number(year),
        avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
        count: ratings.length,
      }))
      .sort((a, b) => a.year - b.year);
  }, [ratedItems]);

  // ── Genre breakdown ──
  const genreBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      const g = getItemGenre(item);
      if (g) counts[g] = (counts[g] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([genre, count]) => ({ genre, count }));
  }, [items]);

  const maxGenreCount = Math.max(...genreBreakdown.map(g => g.count), 1);

  // ── Category breakdown ──
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      const id = toAppCategory(item.category) ?? item.category;
      counts[id] = (counts[id] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([catId, count]) => {
        const cat = CATEGORIES.find(c => c.id === catId);
        return { catId, count, cat };
      });
  }, [items, CATEGORIES]);

  const totalItems = items.length;
  const avgRating = ratedItems.length > 0
    ? ratedItems.reduce((s, i) => s + (getItemRating(i) ?? 0), 0) / ratedItems.length
    : null;
  const topRated = ratedItems.length > 0
    ? ratedItems.reduce((best, i) => (getItemRating(i) ?? 0) > (getItemRating(best) ?? 0) ? i : best, ratedItems[0])
    : null;
  const lowestRated = ratedItems.length > 0
    ? ratedItems.reduce((worst, i) => (getItemRating(i) ?? 10) < (getItemRating(worst) ?? 10) ? i : worst, ratedItems[0])
    : null;

  if (items.length === 0) return null;

  // ── Timeline chart dimensions ──
  const chartH = 80;
  const chartW = 300;
  const minAvg = timeline.length > 0 ? Math.min(...timeline.map(t => t.avg)) : 0;
  const maxAvg = timeline.length > 0 ? Math.max(...timeline.map(t => t.avg)) : 10;
  const range = maxAvg - minAvg || 1;

  const points = timeline.map((t, i) => {
    const x = timeline.length > 1 ? (i / (timeline.length - 1)) * chartW : chartW / 2;
    const y = chartH - ((t.avg - minAvg) / range) * (chartH - 10) - 5;
    return { x, y, ...t };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = points.length > 1
    ? `M${points[0].x},${chartH} ${points.map(p => `L${p.x},${p.y}`).join(' ')} L${points[points.length - 1].x},${chartH} Z`
    : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

      {/* ── Left: Summary stats ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-5">
        <h3
          className="text-sm font-bold text-zinc-900 dark:text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Resumen
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4">
            <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {totalItems}
            </p>
            <p className="text-xs text-zinc-500">obras totales</p>
          </div>
          {avgRating != null && (
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4">
              <p className="text-2xl font-black text-amber-500 leading-none mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {avgRating.toFixed(1)}
              </p>
              <p className="text-xs text-zinc-500">rating medio</p>
            </div>
          )}
          {topRated && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-trophy-fill text-emerald-500 text-sm"></i>
                <p className="text-xs text-zinc-500">mejor valorada</p>
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{topRated.title}</p>
              <p className="text-xs text-emerald-500 font-semibold mt-0.5">{(getItemRating(topRated) ?? 0).toFixed(1)} / 10</p>
            </div>
          )}
          {lowestRated && lowestRated.id !== topRated?.id && (
            <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-arrow-down-line text-zinc-400 text-sm"></i>
                <p className="text-xs text-zinc-500">menor valoración</p>
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{lowestRated.title}</p>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">{(getItemRating(lowestRated) ?? 0).toFixed(1)} / 10</p>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        {categoryBreakdown.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Por categoría</p>
            <div className="flex flex-col gap-2">
              {categoryBreakdown.map(({ catId, count, cat }) => (
                <div key={catId} className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${cat?.icon ?? 'ri-folder-line'} text-xs`} style={{ color: cat?.accent ?? '#888' }}></i>
                  </div>
                  <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(count / totalItems) * 100}%`,
                        background: cat?.accent ?? '#888',
                      }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-4 text-right flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Center: Rating timeline ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <h3
          className="text-sm font-bold text-zinc-900 dark:text-white mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Evolución de ratings
        </h3>
        <p className="text-xs text-zinc-400 mb-5">Rating medio por año de lanzamiento</p>

        {timeline.length >= 2 ? (
          <div className="relative">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full"
              style={{ height: 100 }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
              <polyline
                points={polyline}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#f59e0b" />
              ))}
            </svg>

            {/* Year labels */}
            <div className="flex justify-between mt-2">
              {points.map((p, i) => (
                <span key={i} className="text-xs text-zinc-400" style={{ fontSize: 10 }}>
                  {p.year}
                </span>
              ))}
            </div>

            {/* Data points list */}
            <div className="mt-4 flex flex-col gap-1.5 max-h-32 overflow-y-auto">
              {[...points].reverse().map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{p.year}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 rounded-full bg-amber-400" style={{ width: `${(p.avg / 10) * 60}px` }}></div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-8 text-right">{p.avg.toFixed(1)}</span>
                    <span className="text-zinc-400 w-12 text-right">({p.count} obra{p.count !== 1 ? 's' : ''})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : timeline.length === 1 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="text-4xl font-black text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {timeline[0].avg.toFixed(1)}
            </div>
            <p className="text-xs text-zinc-400">Rating en {timeline[0].year}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-zinc-400 text-sm">
            Sin datos de rating
          </div>
        )}
      </div>

      {/* ── Right: Genre breakdown + rating distribution ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-5">
        {/* Genre breakdown */}
        {genreBreakdown.length > 0 && (
          <div>
            <h3
              className="text-sm font-bold text-zinc-900 dark:text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Géneros
            </h3>
            <div className="flex flex-col gap-2.5">
              {genreBreakdown.map(({ genre, count }) => (
                <div key={genre} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 w-20 flex-shrink-0 truncate">{genre}</span>
                  <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-zinc-600 to-zinc-400 dark:from-zinc-400 dark:to-zinc-600 transition-all duration-700"
                      style={{ width: `${(count / maxGenreCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-4 text-right flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating distribution histogram */}
        {ratedItems.length > 0 && (
          <div>
            <h3
              className="text-sm font-bold text-zinc-900 dark:text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Distribución de ratings
            </h3>
            <div className="flex items-end gap-1 h-16">
              {ratingBuckets.map(({ score, count }) => {
                const heightPct = maxBucketCount > 0 ? (count / maxBucketCount) * 100 : 0;
                const isHigh = score >= 9;
                const isMid = score >= 7 && score < 9;
                const barColor = isHigh ? 'bg-emerald-400' : isMid ? 'bg-amber-400' : 'bg-zinc-300 dark:bg-zinc-600';
                return (
                  <div key={score} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center" style={{ height: 52 }}>
                      <div
                        className={`w-full rounded-t-sm transition-all duration-700 ${barColor}`}
                        style={{ height: `${Math.max(heightPct, count > 0 ? 8 : 0)}%` }}
                        title={`${score}: ${count} obra${count !== 1 ? 's' : ''}`}
                      />
                    </div>
                    <span className="text-zinc-400" style={{ fontSize: 9 }}>{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

