import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Person } from '@/mocks/people';

interface Props {
  entities: Person[];
  viewMode: 'grid' | 'list';
}

const ROLE_COLORS: Record<string, { bg: string; text: string; icon: string; stroke: string }> = {
  actor: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: 'ri-user-smile-line', stroke: '#f59e0b' },
  actriz: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', icon: 'ri-user-heart-line', stroke: '#f43f5e' },
  'actor/actriz': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', icon: 'ri-user-heart-line', stroke: '#f43f5e' },
  director: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: 'ri-movie-2-line', stroke: '#f97316' },
  autor: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: 'ri-quill-pen-line', stroke: '#10b981' },
  desarrollador: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-400', icon: 'ri-gamepad-line', stroke: '#06b6d4' },
  publisher: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400', icon: 'ri-building-2-line', stroke: '#8b5cf6' },
  artista: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400', icon: 'ri-music-2-line', stroke: '#ec4899' },
};

function getRoleStyle(role: string) {
  const key = role.toLowerCase();
  return ROLE_COLORS[key] ?? { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-600 dark:text-zinc-400', icon: 'ri-user-line', stroke: '#71717a' };
}

function getAvgRating(works: Person['works']): number | null {
  if (!works.length) return null;
  return works.reduce((s, w) => s + w.rating, 0) / works.length;
}

function getBestWork(works: Person['works']): Person['works'][0] | null {
  if (!works.length) return null;
  return works.reduce((best, w) => (w.rating > best.rating ? w : best), works[0]);
}

// ── Sparkline ──────────────────────────────────────────────────────────────────
interface SparklineProps {
  works: Person['works'];
  stroke: string;
  width?: number;
  height?: number;
  compact?: boolean;
}

function RatingSparkline({ works, stroke, width = 120, height = 36, compact = false }: SparklineProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  if (works.length < 2) {
    // Single point — just show a dot
    if (works.length === 1) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stroke }} />
          <span className="text-xs font-semibold" style={{ color: stroke }}>{works[0].rating.toFixed(1)}</span>
          <span className="text-xs text-zinc-400">{works[0].year}</span>
        </div>
      );
    }
    return null;
  }

  // Sort by year
  const sorted = [...works].sort((a, b) => a.year - b.year);
  const ratings = sorted.map(w => w.rating);
  const minR = Math.min(...ratings);
  const maxR = Math.max(...ratings);
  const range = maxR - minR || 1;

  const pad = compact ? 4 : 6;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const toX = (i: number) => pad + (i / (sorted.length - 1)) * innerW;
  const toY = (r: number) => pad + innerH - ((r - minR) / range) * innerH;

  const points = sorted.map((w, i) => ({ x: toX(i), y: toY(w.rating), work: w }));

  // Build SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(height).toFixed(1)} L ${points[0].x.toFixed(1)} ${(height).toFixed(1)} Z`;

  const maxIdx = ratings.indexOf(maxR);
  const minIdx = ratings.indexOf(minR);

  return (
    <div className="relative select-none" style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Area fill */}
        <defs>
          <linearGradient id={`grad-${stroke.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${stroke.replace('#', '')})`} />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={stroke}
          strokeWidth={compact ? 1.5 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Max point */}
        <circle
          cx={points[maxIdx].x}
          cy={points[maxIdx].y}
          r={compact ? 2.5 : 3.5}
          fill={stroke}
          stroke="white"
          strokeWidth={1.5}
        />

        {/* Min point (only if different from max) */}
        {minIdx !== maxIdx && (
          <circle
            cx={points[minIdx].x}
            cy={points[minIdx].y}
            r={compact ? 2 : 2.5}
            fill="white"
            stroke={stroke}
            strokeWidth={1.5}
          />
        )}

        {/* Invisible hover targets */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={compact ? 6 : 8}
            fill="transparent"
            className="cursor-crosshair"
            onMouseEnter={() =>
              setTooltip({
                x: p.x,
                y: p.y,
                label: `${p.work.title} (${p.work.year})\n${p.work.rating.toFixed(1)}`,
              })
            }
          />
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - (compact ? 36 : 44),
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-zinc-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
            {tooltip.label.split('\n').map((line, i) => (
              <div key={i} className={i === 1 ? 'font-bold text-center' : 'text-zinc-300 text-center'}>
                {line}
              </div>
            ))}
          </div>
          <div
            className="w-2 h-2 bg-zinc-900 rotate-45 mx-auto -mt-1"
          />
        </div>
      )}
    </div>
  );
}

// ── Sparkline label row ────────────────────────────────────────────────────────
function SparklineSection({ works, stroke, compact = false }: { works: Person['works']; stroke: string; compact?: boolean }) {
  if (works.length < 2) return null;

  const sorted = [...works].sort((a, b) => a.year - b.year);
  const ratings = sorted.map(w => w.rating);
  const minR = Math.min(...ratings);
  const maxR = Math.max(...ratings);
  const trend = ratings[ratings.length - 1] - ratings[0];

  return (
    <div className={`flex flex-col gap-1 ${compact ? '' : 'pt-2 border-t border-zinc-100 dark:border-zinc-800'}`}>
      {!compact && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-medium">Evolución de ratings</span>
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                <i className="ri-arrow-up-line text-xs"></i>+{trend.toFixed(1)}
              </span>
            ) : trend < 0 ? (
              <span className="text-xs font-semibold text-rose-500 flex items-center gap-0.5">
                <i className="ri-arrow-down-line text-xs"></i>{trend.toFixed(1)}
              </span>
            ) : (
              <span className="text-xs font-semibold text-zinc-400">—</span>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
          <span className="text-xs font-bold leading-none" style={{ color: stroke }}>{maxR.toFixed(1)}</span>
          <span className="text-xs text-zinc-400 leading-none">{minR.toFixed(1)}</span>
        </div>
        <RatingSparkline
          works={works}
          stroke={stroke}
          width={compact ? 80 : 110}
          height={compact ? 28 : 36}
          compact={compact}
        />
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <span className="text-xs text-zinc-400 leading-none">{sorted[0].year}</span>
          <span className="text-xs text-zinc-400 leading-none">{sorted[sorted.length - 1].year}</span>
        </div>
      </div>
    </div>
  );
}

// ── Grid card ──────────────────────────────────────────────────────────────────
function EntityGridCard({ entity }: { entity: Person }) {
  const roleStyle = getRoleStyle(entity.role);
  const avgRating = getAvgRating(entity.works);
  const bestWork = getBestWork(entity.works);

  return (
    <Link
      to={`/person/${entity.id}`}
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Photo area */}
      <div className="relative h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={entity.photo}
          alt={entity.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Role badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
          <i className={`${roleStyle.icon} text-xs`}></i>
          {entity.role}
        </div>

        {/* Rating badge */}
        {avgRating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <i className="ri-star-fill text-amber-400 text-xs"></i>
            <span className="text-white text-xs font-bold">{avgRating.toFixed(1)}</span>
          </div>
        )}

        {/* Works count */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <i className="ri-film-line text-zinc-300 text-xs"></i>
            <span className="text-white text-xs font-semibold">{entity.works.length} obras</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div>
          <h3
            className="font-bold text-zinc-900 dark:text-white text-sm leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {entity.name}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">{entity.nationality} · {entity.birthYear}</p>
        </div>

        {/* Known for chips */}
        <div className="flex flex-wrap gap-1">
          {entity.known_for.slice(0, 2).map(k => (
            <span key={k} className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {k}
            </span>
          ))}
        </div>

        {/* Sparkline */}
        {entity.works.length >= 2 && (
          <SparklineSection works={entity.works} stroke={roleStyle.stroke} />
        )}

        {/* Best work — only if no sparkline */}
        {entity.works.length < 2 && bestWork && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="w-7 h-9 rounded overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
              <img src={bestWork.cover} alt={bestWork.title} className="w-full h-full object-cover object-top" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-400">Mejor obra</p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">{bestWork.title}</p>
            </div>
            <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
              <i className="ri-star-fill text-amber-400 text-xs"></i>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{bestWork.rating}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        <i className="ri-arrow-right-line text-xs"></i>
      </div>
    </Link>
  );
}

// ── List row ───────────────────────────────────────────────────────────────────
function EntityListRow({ entity }: { entity: Person }) {
  const roleStyle = getRoleStyle(entity.role);
  const avgRating = getAvgRating(entity.works);
  const bestWork = getBestWork(entity.works);
  const ratingPct = avgRating ? (avgRating / 10) * 100 : 0;

  return (
    <Link
      to={`/person/${entity.id}`}
      className="group flex items-center gap-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 p-4 transition-all duration-200 cursor-pointer"
    >
      {/* Photo */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
        <img src={entity.photo} alt={entity.name} className="w-full h-full object-cover object-top" />
      </div>

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {entity.name}
          </h3>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
            <i className={`${roleStyle.icon} text-xs`}></i>
            {entity.role}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">{entity.nationality} · Desde {entity.birthYear}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {entity.known_for.slice(0, 3).map(k => (
            <span key={k} className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md">
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* Works count */}
      <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0 w-16">
        <span className="text-xl font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {entity.works.length}
        </span>
        <span className="text-xs text-zinc-400">obras</span>
      </div>

      {/* Rating */}
      <div className="hidden md:flex flex-col items-center gap-1.5 flex-shrink-0 w-20">
        {avgRating ? (
          <>
            <div className="flex items-center gap-1">
              <i className="ri-star-fill text-amber-400 text-sm"></i>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">{avgRating.toFixed(1)}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${ratingPct}%` }}
              />
            </div>
          </>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </div>

      {/* Sparkline — visible on lg+ */}
      {entity.works.length >= 2 && (
        <div className="hidden lg:flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-xs text-zinc-400 mb-0.5">Evolución</span>
          <SparklineSection works={entity.works} stroke={roleStyle.stroke} compact />
        </div>
      )}

      {/* Best work */}
      {bestWork && (
        <div className="hidden xl:flex items-center gap-2 flex-shrink-0 w-40">
          <div className="w-8 h-10 rounded overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
            <img src={bestWork.cover} alt={bestWork.title} className="w-full h-full object-cover object-top" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-zinc-400">Mejor obra</p>
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">{bestWork.title}</p>
            <div className="flex items-center gap-0.5 mt-0.5">
              <i className="ri-star-fill text-amber-400 text-xs"></i>
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{bestWork.rating}</span>
            </div>
          </div>
        </div>
      )}

      {/* Arrow */}
      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-200 flex-shrink-0">
        <i className="ri-arrow-right-line text-xs"></i>
      </div>
    </Link>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function EntitiesGrid({ entities, viewMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Stagger reveal on mount / when entities change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>('.entity-reveal'));
    items.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)';
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const idx = items.indexOf(el);
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, Math.min(idx * 40, 600));
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -30px 0px', threshold: 0.05 }
    );

    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [entities, viewMode]);

  if (entities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
          <i className="ri-user-search-line text-2xl text-zinc-400"></i>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Sin resultados
        </h3>
        <p className="text-sm text-zinc-500 max-w-xs">
          No hay entidades que coincidan con los filtros seleccionados. Prueba con otros criterios.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div ref={containerRef} className="flex flex-col gap-2">
        {entities.map(entity => (
          <div key={entity.id} className="entity-reveal">
            <EntityListRow entity={entity} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
      {entities.map(entity => (
        <div key={entity.id} className="entity-reveal">
          <EntityGridCard entity={entity} />
        </div>
      ))}
    </div>
  );
}
