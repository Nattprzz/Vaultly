import type { Person } from '@/mocks/people';

const COLOR_A = '#f43f5e';
const COLOR_B = '#06b6d4';

function getAvg(works: Person['works']) {
  if (!works.length) return 0;
  return works.reduce((s, w) => s + w.rating, 0) / works.length;
}

function getPeak(works: Person['works']) {
  if (!works.length) return 0;
  return Math.max(...works.map(w => w.rating));
}

function getLowest(works: Person['works']) {
  if (!works.length) return 0;
  return Math.min(...works.map(w => w.rating));
}

function getConsistency(works: Person['works']): number {
  if (works.length < 2) return 10;
  const ratings = works.map(w => w.rating);
  const mean = ratings.reduce((s, r) => s + r, 0) / ratings.length;
  const variance = ratings.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / ratings.length;
  return Math.max(0, 10 - Math.sqrt(variance) * 2);
}

function getTrend(works: Person['works']): number {
  if (works.length < 2) return 0;
  const sorted = [...works].sort((a, b) => a.year - b.year);
  return sorted[sorted.length - 1].rating - sorted[0].rating;
}

function getActiveYears(works: Person['works']): number {
  if (works.length < 2) return 0;
  const years = works.map(w => w.year);
  return Math.max(...years) - Math.min(...years);
}

function getBestWork(works: Person['works']) {
  if (!works.length) return null;
  return works.reduce((b, w) => (w.rating > b.rating ? w : b), works[0]);
}

interface StatRowProps {
  label: string;
  icon: string;
  valA: string | number;
  valB: string | number;
  numA: number;
  numB: number;
  higherIsBetter?: boolean;
  suffix?: string;
}

function StatRow({ label, icon, valA, valB, numA, numB, higherIsBetter = true, suffix = '' }: StatRowProps) {
  const winnerA = higherIsBetter ? numA > numB : numA < numB;
  const winnerB = higherIsBetter ? numB > numA : numB < numA;
  const tie = numA === numB;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      {/* A value */}
      <div className="flex-1 flex items-center justify-end gap-1.5">
        {winnerA && !tie && (
          <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: `${COLOR_A}20` }}>
            <i className="ri-trophy-fill text-xs" style={{ color: COLOR_A }}></i>
          </div>
        )}
        <span
          className="text-sm font-bold"
          style={{ color: winnerA && !tie ? COLOR_A : '#71717a' }}
        >
          {valA}{suffix}
        </span>
      </div>

      {/* Label center */}
      <div className="flex flex-col items-center gap-0.5 w-32 flex-shrink-0">
        <i className={`${icon} text-xs text-zinc-400`}></i>
        <span className="text-xs text-zinc-400 text-center leading-tight">{label}</span>
        {tie && <span className="text-xs text-zinc-300 font-medium">Empate</span>}
      </div>

      {/* B value */}
      <div className="flex-1 flex items-center gap-1.5">
        <span
          className="text-sm font-bold"
          style={{ color: winnerB && !tie ? COLOR_B : '#71717a' }}
        >
          {valB}{suffix}
        </span>
        {winnerB && !tie && (
          <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: `${COLOR_B}20` }}>
            <i className="ri-trophy-fill text-xs" style={{ color: COLOR_B }}></i>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  entityA: Person;
  entityB: Person;
}

export default function CompareStats({ entityA, entityB }: Props) {
  const avgA = getAvg(entityA.works);
  const avgB = getAvg(entityB.works);
  const peakA = getPeak(entityA.works);
  const peakB = getPeak(entityB.works);
  const lowestA = getLowest(entityA.works);
  const lowestB = getLowest(entityB.works);
  const consistencyA = getConsistency(entityA.works);
  const consistencyB = getConsistency(entityB.works);
  const trendA = getTrend(entityA.works);
  const trendB = getTrend(entityB.works);
  const yearsA = getActiveYears(entityA.works);
  const yearsB = getActiveYears(entityB.works);
  const bestA = getBestWork(entityA.works);
  const bestB = getBestWork(entityB.works);

  // Overall winner
  let winsA = 0;
  let winsB = 0;
  const comparisons = [
    { a: avgA, b: avgB, higher: true },
    { a: peakA, b: peakB, higher: true },
    { a: consistencyA, b: consistencyB, higher: true },
    { a: trendA, b: trendB, higher: true },
    { a: entityA.works.length, b: entityB.works.length, higher: true },
  ];
  comparisons.forEach(({ a, b, higher }) => {
    if (higher ? a > b : a < b) winsA++;
    else if (higher ? b > a : b < a) winsB++;
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {/* Header with entity names */}
      <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-zinc-800">
        {/* Entity A */}
        <div className="flex items-center gap-3 p-5" style={{ borderBottom: `3px solid ${COLOR_A}` }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src={entityA.photo} alt={entityA.name} className="w-full h-full object-cover object-top" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {entityA.name}
            </p>
            <p className="text-xs text-zinc-400">{entityA.role}</p>
          </div>
        </div>

        {/* Center label */}
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Estadísticas</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-black" style={{ color: COLOR_A }}>{winsA}</span>
            <span className="text-xs text-zinc-400">vs</span>
            <span className="text-lg font-black" style={{ color: COLOR_B }}>{winsB}</span>
          </div>
          <span className="text-xs text-zinc-400 mt-0.5">victorias</span>
        </div>

        {/* Entity B */}
        <div className="flex items-center justify-end gap-3 p-5" style={{ borderBottom: `3px solid ${COLOR_B}` }}>
          <div className="min-w-0 text-right">
            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {entityB.name}
            </p>
            <p className="text-xs text-zinc-400">{entityB.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src={entityB.photo} alt={entityB.name} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>

      {/* Stats rows */}
      <div className="px-6 py-2">
        <StatRow
          label="Rating medio"
          icon="ri-star-line"
          valA={avgA.toFixed(2)}
          valB={avgB.toFixed(2)}
          numA={avgA}
          numB={avgB}
        />
        <StatRow
          label="Pico máximo"
          icon="ri-arrow-up-circle-line"
          valA={peakA.toFixed(1)}
          valB={peakB.toFixed(1)}
          numA={peakA}
          numB={peakB}
        />
        <StatRow
          label="Rating mínimo"
          icon="ri-arrow-down-circle-line"
          valA={lowestA.toFixed(1)}
          valB={lowestB.toFixed(1)}
          numA={lowestA}
          numB={lowestB}
        />
        <StatRow
          label="Consistencia"
          icon="ri-pulse-line"
          valA={consistencyA.toFixed(1)}
          valB={consistencyB.toFixed(1)}
          numA={consistencyA}
          numB={consistencyB}
          suffix="/10"
        />
        <StatRow
          label="Tendencia carrera"
          icon="ri-line-chart-line"
          valA={(trendA >= 0 ? '+' : '') + trendA.toFixed(1)}
          valB={(trendB >= 0 ? '+' : '') + trendB.toFixed(1)}
          numA={trendA}
          numB={trendB}
        />
        <StatRow
          label="Obras en catálogo"
          icon="ri-film-line"
          valA={entityA.works.length}
          valB={entityB.works.length}
          numA={entityA.works.length}
          numB={entityB.works.length}
        />
        <StatRow
          label="Años de carrera"
          icon="ri-time-line"
          valA={yearsA > 0 ? `${yearsA} años` : '—'}
          valB={yearsB > 0 ? `${yearsB} años` : '—'}
          numA={yearsA}
          numB={yearsB}
        />
      </div>

      {/* Best works */}
      <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
        {[
          { entity: entityA, best: bestA, color: COLOR_A },
          { entity: entityB, best: bestB, color: COLOR_B },
        ].map(({ entity, best, color }) => (
          <div key={entity.id} className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mejor obra</p>
            {best ? (
              <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
                <div className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                  <img src={best.cover} alt={best.title} className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{best.title}</p>
                  <p className="text-xs text-zinc-400">{best.year} · {best.genre}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <i className="ri-star-fill text-xs" style={{ color }}></i>
                    <span className="text-xs font-bold" style={{ color }}>{best.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">Sin datos</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
