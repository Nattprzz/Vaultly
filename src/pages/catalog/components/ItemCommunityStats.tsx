interface Props {
  communityRating: number;
  totalRatings: number;
  totalReviews: number;
}

// Simulated rating distribution based on community rating
function getRatingDistribution(avg: number): number[] {
  const dist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const peak = Math.round(avg) - 1;
  for (let i = 0; i < 10; i++) {
    const distance = Math.abs(i - peak);
    dist[i] = Math.max(2, Math.round(40 * Math.exp(-0.5 * distance * distance)));
  }
  return dist;
}

export default function ItemCommunityStats({ communityRating, totalRatings, totalReviews }: Props) {
  const dist = getRatingDistribution(communityRating);
  const maxVal = Math.max(...dist);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Estadísticas públicas</h3>

      <div className="flex gap-6 items-start">
        {/* Big rating */}
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-5xl font-black text-zinc-900 dark:text-white leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {communityRating}
          </span>
          <div className="flex gap-0.5 mt-2">
            {[1,2,3,4,5].map(s => (
              <i key={s} className={`text-sm ${s <= Math.round(communityRating / 2) ? 'ri-star-fill text-amber-400' : 'ri-star-line text-zinc-300 dark:text-zinc-600'}`}></i>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-1.5 text-center">{(totalRatings / 1000).toFixed(1)}k valoraciones</p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 flex flex-col gap-1.5">
          {dist.map((val, i) => {
            const score = 10 - i;
            const pct = Math.round((val / maxVal) * 100);
            return (
              <div key={score} className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 w-3 text-right flex-shrink-0">{score}</span>
                <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 w-6 text-right flex-shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="text-center">
          <p className="text-lg font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {(totalRatings / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-zinc-500">Valoraciones</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {(totalReviews / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-zinc-500">Reseñas</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {Math.round((totalReviews / totalRatings) * 100)}%
          </p>
          <p className="text-xs text-zinc-500">Reseñaron</p>
        </div>
      </div>
    </div>
  );
}
