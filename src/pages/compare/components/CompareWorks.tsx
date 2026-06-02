import { useState } from 'react';
import type { Person } from '@/mocks/people';

const COLOR_A = '#f43f5e';
const COLOR_B = '#06b6d4';

type SortMode = 'year' | 'rating_a' | 'rating_b' | 'diff';

interface MergedWork {
  year: number;
  workA: Person['works'][0] | null;
  workB: Person['works'][0] | null;
}

function buildMergedWorks(entityA: Person, entityB: Person): MergedWork[] {
  const allYears = Array.from(
    new Set([
      ...entityA.works.map(w => w.year),
      ...entityB.works.map(w => w.year),
    ])
  ).sort((a, b) => a - b);

  return allYears.map(year => ({
    year,
    workA: entityA.works.find(w => w.year === year) ?? null,
    workB: entityB.works.find(w => w.year === year) ?? null,
  }));
}

interface Props {
  entityA: Person;
  entityB: Person;
}

export default function CompareWorks({ entityA, entityB }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('year');
  const [showOnlyShared, setShowOnlyShared] = useState(false);

  const merged = buildMergedWorks(entityA, entityB);

  const filtered = showOnlyShared
    ? merged.filter(m => m.workA && m.workB)
    : merged;

  const sorted = [...filtered].sort((a, b) => {
    switch (sortMode) {
      case 'year':
        return a.year - b.year;
      case 'rating_a':
        return (b.workA?.rating ?? 0) - (a.workA?.rating ?? 0);
      case 'rating_b':
        return (b.workB?.rating ?? 0) - (a.workB?.rating ?? 0);
      case 'diff': {
        const diffA = Math.abs((a.workA?.rating ?? 0) - (a.workB?.rating ?? 0));
        const diffB = Math.abs((b.workA?.rating ?? 0) - (b.workB?.rating ?? 0));
        return diffB - diffA;
      }
      default:
        return 0;
    }
  });

  const sharedCount = merged.filter(m => m.workA && m.workB).length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Obras por año
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {sharedCount > 0
              ? `${sharedCount} año${sharedCount !== 1 ? 's' : ''} con obras de ambos`
              : 'Sin años compartidos'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Shared toggle */}
          {sharedCount > 0 && (
            <button
              onClick={() => setShowOnlyShared(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                showOnlyShared
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <i className="ri-links-line text-xs"></i>
              Solo compartidos
            </button>
          )}

          {/* Sort */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            {([
              { value: 'year', label: 'Año' },
              { value: 'rating_a', label: entityA.name.split(' ')[0] },
              { value: 'rating_b', label: entityB.name.split(' ')[0] },
              { value: 'diff', label: 'Diferencia' },
            ] as { value: SortMode; label: string }[]).map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortMode(opt.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  sortMode === opt.value
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-0 px-6 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLOR_A }} />
          <span className="text-xs font-semibold text-zinc-500 truncate">{entityA.name}</span>
        </div>
        <div className="w-16 text-center">
          <span className="text-xs font-semibold text-zinc-400">Año</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs font-semibold text-zinc-500 truncate">{entityB.name}</span>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLOR_B }} />
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50 max-h-[480px] overflow-y-auto">
        {sorted.map(({ year, workA, workB }) => {
          const diff = workA && workB ? workA.rating - workB.rating : null;
          const isShared = workA && workB;

          return (
            <div
              key={year}
              className={`grid grid-cols-[1fr_auto_1fr] gap-0 px-6 py-3 transition-colors ${
                isShared ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30' : ''
              }`}
            >
              {/* Work A */}
              <div className="flex items-center gap-3 pr-3">
                {workA ? (
                  <>
                    <div className="w-8 h-10 rounded-md overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img src={workA.cover} alt={workA.title} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{workA.title}</p>
                      <p className="text-xs text-zinc-400">{workA.genre}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="h-1 rounded-full" style={{ width: `${(workA.rating / 10) * 48}px`, backgroundColor: COLOR_A }} />
                        <span className="text-xs font-bold" style={{ color: COLOR_A }}>{workA.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-zinc-300 dark:text-zinc-600 italic">Sin obra</span>
                )}
              </div>

              {/* Year + diff */}
              <div className="w-16 flex flex-col items-center justify-center gap-1">
                <span className="text-xs font-bold text-zinc-500">{year}</span>
                {diff !== null && (
                  <span
                    className="text-xs font-bold"
                    style={{ color: diff > 0 ? COLOR_A : diff < 0 ? COLOR_B : '#71717a' }}
                  >
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                  </span>
                )}
                {isShared && (
                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                )}
              </div>

              {/* Work B */}
              <div className="flex items-center justify-end gap-3 pl-3">
                {workB ? (
                  <>
                    <div className="min-w-0 text-right">
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{workB.title}</p>
                      <p className="text-xs text-zinc-400">{workB.genre}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-xs font-bold" style={{ color: COLOR_B }}>{workB.rating.toFixed(1)}</span>
                        <div className="h-1 rounded-full" style={{ width: `${(workB.rating / 10) * 48}px`, backgroundColor: COLOR_B }} />
                      </div>
                    </div>
                    <div className="w-8 h-10 rounded-md overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img src={workB.cover} alt={workB.title} className="w-full h-full object-cover object-top" />
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-zinc-300 dark:text-zinc-600 italic">Sin obra</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="py-12 text-center">
          <i className="ri-file-list-3-line text-2xl text-zinc-300 dark:text-zinc-600"></i>
          <p className="text-sm text-zinc-400 mt-2">No hay obras que mostrar</p>
        </div>
      )}
    </div>
  );
}
