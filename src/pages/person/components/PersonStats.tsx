import { type Person } from '@/mocks/people';

interface Props {
  person: Person;
}

export default function PersonStats({ person }: Props) {
  const ratings = person.works.map(w => w.rating);
  const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const max = ratings.length > 0 ? Math.max(...ratings) : 0;
  const min = ratings.length > 0 ? Math.min(...ratings) : 0;

  const categoryCounts = person.works.reduce<Record<string, number>>((acc, w) => {
    acc[w.category] = (acc[w.category] ?? 0) + 1;
    return acc;
  }, {});

  const CATEGORY_LABELS: Record<string, string> = {
    games: 'Videojuegos',
    movies: 'Películas',
    series: 'Series',
    books: 'Libros',
    concerts: 'Conciertos',
    anime: 'Anime',
  };

  const stats = [
    { label: 'Obras totales', value: person.works.length, icon: 'ri-film-line' },
    { label: 'Rating medio', value: avg.toFixed(1), icon: 'ri-star-fill', accent: true },
    { label: 'Mejor valorada', value: max.toFixed(1), icon: 'ri-trophy-line' },
    { label: 'Menor valoración', value: min.toFixed(1), icon: 'ri-arrow-down-line' },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2
        className="text-lg font-bold text-zinc-900 dark:text-white mb-5"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Estadísticas
      </h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <i className={`${s.icon} text-lg ${s.accent ? 'text-amber-400' : 'text-zinc-400'}`}></i>
            </div>
            <p className={`text-2xl font-black mb-0.5 ${s.accent ? 'text-amber-500' : 'text-zinc-900 dark:text-white'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {s.value}
            </p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {Object.keys(categoryCounts).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Por categoría
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 dark:text-zinc-400 w-24 flex-shrink-0">
                  {CATEGORY_LABELS[cat] ?? cat}
                </span>
                <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${(count / person.works.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-4 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
