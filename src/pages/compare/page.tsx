import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PEOPLE_MOCK, type Person } from '@/mocks/people';
import Navbar from '@/components/feature/Navbar';
import CompareSelector from './components/CompareSelector';
import CompareChart from './components/CompareChart';
import CompareStats from './components/CompareStats';
import CompareWorks from './components/CompareWorks';

// Suggested pairs for quick start
const SUGGESTED_PAIRS: [string, string][] = [
  ['christopher-nolan', 'denis-villeneuve'],
  ['cillian-murphy', 'timothee-chalamet'],
  ['fromsoftware', 'cd-projekt-red'],
  ['liu-cixin', 'isaac-asimov'],
  ['emily-blunt', 'florence-pugh'],
  ['pedro-pascal', 'cillian-murphy'],
];

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [entityA, setEntityA] = useState<Person | null>(null);
  const [entityB, setEntityB] = useState<Person | null>(null);

  // Sync from URL params
  useEffect(() => {
    const idA = searchParams.get('a');
    const idB = searchParams.get('b');
    if (idA && PEOPLE_MOCK[idA]) setEntityA(PEOPLE_MOCK[idA]);
    if (idB && PEOPLE_MOCK[idB]) setEntityB(PEOPLE_MOCK[idB]);
  }, [searchParams]);

  // Update URL when selection changes
  const handleSelectA = (p: Person | null) => {
    setEntityA(p);
    const params = new URLSearchParams(searchParams);
    if (p) params.set('a', p.id); else params.delete('a');
    setSearchParams(params, { replace: true });
  };

  const handleSelectB = (p: Person | null) => {
    setEntityB(p);
    const params = new URLSearchParams(searchParams);
    if (p) params.set('b', p.id); else params.delete('b');
    setSearchParams(params, { replace: true });
  };

  const handleSuggestedPair = (idA: string, idB: string) => {
    const a = PEOPLE_MOCK[idA];
    const b = PEOPLE_MOCK[idB];
    if (a && b) {
      setEntityA(a);
      setEntityB(b);
      setSearchParams({ a: idA, b: idB }, { replace: true });
    }
  };

  const bothSelected = entityA && entityB;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <div className="pt-16 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/entities"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xs"></i>
              Entidades
            </Link>
            <span className="text-zinc-200 dark:text-zinc-700">/</span>
            <span className="text-xs text-zinc-400">Comparar</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1
                className="text-3xl font-black text-zinc-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Comparar entidades
              </h1>
              <p className="text-sm text-zinc-500 mt-1 max-w-lg">
                Enfrenta dos actores, directores, autores o estudios y analiza su evolución de ratings, consistencia y trayectoria.
              </p>
            </div>

            {bothSelected && (
              <button
                onClick={() => { handleSelectA(null); handleSelectB(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-refresh-line text-sm"></i>
                Nueva comparación
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
        {/* Selector */}
        <CompareSelector
          entityA={entityA}
          entityB={entityB}
          onSelectA={handleSelectA}
          onSelectB={handleSelectB}
        />

        {/* Suggested pairs — only when nothing selected */}
        {!bothSelected && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <h3
              className="text-sm font-bold text-zinc-900 dark:text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Comparaciones sugeridas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUGGESTED_PAIRS.map(([idA, idB]) => {
                const a = PEOPLE_MOCK[idA];
                const b = PEOPLE_MOCK[idB];
                if (!a || !b) return null;
                return (
                  <button
                    key={`${idA}-${idB}`}
                    onClick={() => handleSuggestedPair(idA, idB)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer text-left group"
                  >
                    {/* Avatars */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900 z-10">
                        <img src={a.photo} alt={a.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900">
                        <img src={b.photo} alt={b.name} className="w-full h-full object-cover object-top" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {a.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">vs {b.name}</p>
                    </div>

                    <i className="ri-arrow-right-line text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors flex-shrink-0"></i>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {bothSelected && (
          <>
            {/* Chart */}
            <CompareChart entityA={entityA} entityB={entityB} />

            {/* Stats + Works side by side on large screens */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
              <CompareStats entityA={entityA} entityB={entityB} />
              <CompareWorks entityA={entityA} entityB={entityB} />
            </div>

            {/* Share / link */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <i className="ri-share-line text-zinc-500 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">Compartir comparación</p>
                  <p className="text-xs text-zinc-400">La URL ya incluye los parámetros de esta comparación</p>
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                <i className="ri-clipboard-line text-sm"></i>
                Copiar enlace
              </button>
            </div>
          </>
        )}

        {/* Empty state */}
        {!entityA && !entityB && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
              <i className="ri-scales-3-line text-3xl text-zinc-400"></i>
            </div>
            <h3
              className="text-lg font-bold text-zinc-900 dark:text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Elige dos entidades para comparar
            </h3>
            <p className="text-sm text-zinc-400 max-w-sm">
              Selecciona cualquier actor, director, autor o estudio del catálogo y analiza su trayectoria en detalle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
