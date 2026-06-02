import { useState, useRef, useCallback } from 'react';
import type { Person } from '@/mocks/people';

const COLOR_A = '#f43f5e';
const COLOR_B = '#06b6d4';

interface DataPoint {
  year: number;
  rating: number;
  title: string;
  entity: 'A' | 'B';
}

interface TooltipState {
  x: number;
  y: number;
  points: { entity: 'A' | 'B'; rating: number; title: string; year: number; color: string }[];
}

function buildTimeline(entityA: Person, entityB: Person) {
  const allYears = Array.from(
    new Set([
      ...entityA.works.map(w => w.year),
      ...entityB.works.map(w => w.year),
    ])
  ).sort((a, b) => a - b);
  return allYears;
}

function getYearRating(works: Person['works'], year: number): { rating: number; title: string } | null {
  const match = works.find(w => w.year === year);
  return match ? { rating: match.rating, title: match.title } : null;
}

function getConsistency(works: Person['works']): number {
  if (works.length < 2) return 10;
  const ratings = works.map(w => w.rating);
  const mean = ratings.reduce((s, r) => s + r, 0) / ratings.length;
  const variance = ratings.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / ratings.length;
  const stdDev = Math.sqrt(variance);
  return Math.max(0, 10 - stdDev * 2);
}

function getTrend(works: Person['works']): number {
  if (works.length < 2) return 0;
  const sorted = [...works].sort((a, b) => a.year - b.year);
  return sorted[sorted.length - 1].rating - sorted[0].rating;
}

interface Props {
  entityA: Person;
  entityB: Person;
}

export default function CompareChart({ entityA, entityB }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const WIDTH = 800;
  const HEIGHT = 260;
  const PAD_LEFT = 40;
  const PAD_RIGHT = 20;
  const PAD_TOP = 20;
  const PAD_BOTTOM = 40;
  const INNER_W = WIDTH - PAD_LEFT - PAD_RIGHT;
  const INNER_H = HEIGHT - PAD_TOP - PAD_BOTTOM;

  // Build per-entity sorted works
  const worksA = [...entityA.works].sort((a, b) => a.year - b.year);
  const worksB = [...entityB.works].sort((a, b) => a.year - b.year);

  const allYears = buildTimeline(entityA, entityB);
  const minYear = allYears[0];
  const maxYear = allYears[allYears.length - 1];
  const yearRange = maxYear - minYear || 1;

  const allRatings = [...worksA, ...worksB].map(w => w.rating);
  const minRating = Math.max(0, Math.min(...allRatings) - 0.5);
  const maxRating = Math.min(10, Math.max(...allRatings) + 0.5);
  const ratingRange = maxRating - minRating || 1;

  const toX = useCallback((year: number) => PAD_LEFT + ((year - minYear) / yearRange) * INNER_W, [INNER_W, minYear, yearRange]);
  const toY = useCallback((rating: number) => PAD_TOP + INNER_H - ((rating - minRating) / ratingRange) * INNER_H, [INNER_H, minRating, ratingRange]);

  const buildPath = (works: typeof worksA) => {
    if (works.length === 0) return '';
    return works
      .map((w, i) => `${i === 0 ? 'M' : 'L'} ${toX(w.year).toFixed(1)} ${toY(w.rating).toFixed(1)}`)
      .join(' ');
  };

  const buildArea = (works: typeof worksA) => {
    if (works.length === 0) return '';
    const line = buildPath(works);
    const last = works[works.length - 1];
    const first = works[0];
    return `${line} L ${toX(last.year).toFixed(1)} ${(PAD_TOP + INNER_H).toFixed(1)} L ${toX(first.year).toFixed(1)} ${(PAD_TOP + INNER_H).toFixed(1)} Z`;
  };

  const pathA = buildPath(worksA);
  const pathB = buildPath(worksB);
  const areaA = buildArea(worksA);
  const areaB = buildArea(worksB);

  // Y-axis grid lines
  const gridRatings = [7, 7.5, 8, 8.5, 9, 9.5, 10].filter(r => r >= minRating && r <= maxRating);

  // Hover handler
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;

    // Find closest year
    let closestYear = allYears[0];
    let minDist = Infinity;
    for (const y of allYears) {
      const dist = Math.abs(toX(y) - mx);
      if (dist < minDist) { minDist = dist; closestYear = y; }
    }

    if (minDist > 40) { setTooltip(null); return; }

    const points: TooltipState['points'] = [];
    const wA = getYearRating(worksA, closestYear);
    const wB = getYearRating(worksB, closestYear);
    if (wA) points.push({ entity: 'A', rating: wA.rating, title: wA.title, year: closestYear, color: COLOR_A });
    if (wB) points.push({ entity: 'B', rating: wB.rating, title: wB.title, year: closestYear, color: COLOR_B });

    if (points.length === 0) { setTooltip(null); return; }

    const avgY = points.reduce((s, p) => {
      const work = p.entity === 'A' ? worksA.find(w => w.year === closestYear) : worksB.find(w => w.year === closestYear);
      return s + (work ? toY(work.rating) : 0);
    }, 0) / points.length;

    setTooltip({ x: toX(closestYear), y: avgY, points });
  }, [allYears, toX, toY, worksA, worksB]);

  // Stats
  const consistencyA = getConsistency(entityA.works);
  const consistencyB = getConsistency(entityB.works);
  const trendA = getTrend(entityA.works);
  const trendB = getTrend(entityB.works);
  const avgA = entityA.works.reduce((s, w) => s + w.rating, 0) / (entityA.works.length || 1);
  const avgB = entityB.works.reduce((s, w) => s + w.rating, 0) / (entityB.works.length || 1);
  const peakA = Math.max(...entityA.works.map(w => w.rating));
  const peakB = Math.max(...entityB.works.map(w => w.rating));

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Evolución de ratings
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Ratings por obra a lo largo de la carrera · hover para detalles</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: COLOR_A }} />
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <img src={entityA.photo} alt={entityA.name} className="w-full h-full object-cover object-top" />
            </div>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{entityA.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: COLOR_B }} />
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <img src={entityB.photo} alt={entityB.name} className="w-full h-full object-cover object-top" />
            </div>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{entityB.name}</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="px-4 pb-2 relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{ height: 260 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR_A} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLOR_A} stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR_B} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLOR_B} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridRatings.map(r => (
            <g key={r}>
              <line
                x1={PAD_LEFT}
                y1={toY(r)}
                x2={WIDTH - PAD_RIGHT}
                y2={toY(r)}
                stroke="#e4e4e7"
                strokeWidth={0.5}
                strokeDasharray="4 4"
              />
              <text
                x={PAD_LEFT - 6}
                y={toY(r) + 4}
                textAnchor="end"
                fontSize={9}
                fill="#a1a1aa"
              >
                {r}
              </text>
            </g>
          ))}

          {/* Year labels on X axis */}
          {allYears.filter((_, i) => i % Math.ceil(allYears.length / 8) === 0 || i === allYears.length - 1).map(year => (
            <text
              key={year}
              x={toX(year)}
              y={PAD_TOP + INNER_H + 18}
              textAnchor="middle"
              fontSize={9}
              fill="#a1a1aa"
            >
              {year}
            </text>
          ))}

          {/* Area fills */}
          <path d={areaA} fill="url(#gradA)" />
          <path d={areaB} fill="url(#gradB)" />

          {/* Lines */}
          <path d={pathA} fill="none" stroke={COLOR_A} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathB} fill="none" stroke={COLOR_B} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points A */}
          {worksA.map((w, i) => (
            <circle key={i} cx={toX(w.year)} cy={toY(w.rating)} r={4} fill={COLOR_A} stroke="white" strokeWidth={1.5} />
          ))}

          {/* Data points B */}
          {worksB.map((w, i) => (
            <circle key={i} cx={toX(w.year)} cy={toY(w.rating)} r={4} fill={COLOR_B} stroke="white" strokeWidth={1.5} />
          ))}

          {/* Tooltip vertical line */}
          {tooltip && (
            <line
              x1={tooltip.x}
              y1={PAD_TOP}
              x2={tooltip.x}
              y2={PAD_TOP + INNER_H}
              stroke="#71717a"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {/* Tooltip overlay */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-20"
            style={{
              left: `${(tooltip.x / WIDTH) * 100}%`,
              top: `${(tooltip.y / HEIGHT) * 100}%`,
              transform: 'translate(-50%, -110%)',
            }}
          >
            <div className="bg-zinc-900 text-white rounded-xl px-3 py-2.5 shadow-xl min-w-[160px]">
              <p className="text-xs text-zinc-400 font-medium mb-1.5 text-center">{tooltip.points[0]?.year}</p>
              {tooltip.points.map(p => (
                <div key={p.entity} className="flex items-center gap-2 mb-1 last:mb-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 truncate">{p.title}</p>
                  </div>
                  <span className="text-xs font-bold ml-1" style={{ color: p.color }}>{p.rating.toFixed(1)}</span>
                </div>
              ))}
              {tooltip.points.length === 2 && (
                <div className="mt-1.5 pt-1.5 border-t border-zinc-700 text-center">
                  <span className="text-xs text-zinc-400">
                    Diferencia: <span className="font-bold text-white">{Math.abs(tooltip.points[0].rating - tooltip.points[1].rating).toFixed(1)}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick stat bars */}
      <div className="px-6 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
        {[
          {
            label: 'Rating medio',
            valA: avgA.toFixed(2),
            valB: avgB.toFixed(2),
            numA: avgA,
            numB: avgB,
            icon: 'ri-star-line',
          },
          {
            label: 'Pico máximo',
            valA: peakA.toFixed(1),
            valB: peakB.toFixed(1),
            numA: peakA,
            numB: peakB,
            icon: 'ri-arrow-up-circle-line',
          },
          {
            label: 'Consistencia',
            valA: consistencyA.toFixed(1),
            valB: consistencyB.toFixed(1),
            numA: consistencyA,
            numB: consistencyB,
            icon: 'ri-pulse-line',
          },
          {
            label: 'Tendencia',
            valA: (trendA >= 0 ? '+' : '') + trendA.toFixed(1),
            valB: (trendB >= 0 ? '+' : '') + trendB.toFixed(1),
            numA: trendA,
            numB: trendB,
            icon: 'ri-line-chart-line',
          },
        ].map(stat => {
          const winnerA = stat.numA > stat.numB;
          const winnerB = stat.numB > stat.numA;
          return (
            <div key={stat.label} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <i className={`${stat.icon} text-xs text-zinc-400`}></i>
                <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-bold"
                  style={{ color: winnerA ? COLOR_A : '#71717a' }}
                >
                  {stat.valA}
                  {winnerA && <i className="ri-trophy-line text-xs ml-1"></i>}
                </span>
                <span className="text-xs text-zinc-300 dark:text-zinc-600">vs</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: winnerB ? COLOR_B : '#71717a' }}
                >
                  {winnerB && <i className="ri-trophy-line text-xs mr-1"></i>}
                  {stat.valB}
                </span>
              </div>
              {/* Bar */}
              <div className="mt-2 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(stat.numA / (Math.abs(stat.numA) + Math.abs(stat.numB) || 1)) * 100}%`,
                    backgroundColor: COLOR_A,
                  }}
                />
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(stat.numB / (Math.abs(stat.numA) + Math.abs(stat.numB) || 1)) * 100}%`,
                    backgroundColor: COLOR_B,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
