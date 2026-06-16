import { Link } from 'react-router-dom';
import type { GameCompanyGame } from '@/types/gameCompany';

function PopularGameCard({ game }: { game: GameCompanyGame }) {
  const inner = (
    <div className="group flex flex-col">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[var(--surface-sunken)]">
        {game.cover_url ? (
          <img
            src={game.cover_url}
            alt={game.title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center text-[var(--text-tertiary)]">
            <i className="ri-gamepad-line text-3xl" />
            <p className="text-[11px] font-medium leading-tight line-clamp-4">{game.title}</p>
          </div>
        )}

        {game.release_year && (
          <div className="absolute left-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {game.release_year}
          </div>
        )}

        {game.rating != null && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
            <i className="ri-star-fill text-[10px] text-amber-400" />
            <span className="text-[11px] font-bold text-white">{Number(game.rating).toFixed(1)}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
      </div>

      <div className="mt-2.5">
        <h3 className="line-clamp-2 text-xs font-semibold leading-tight text-[var(--text-primary)] transition-colors group-hover:text-brand dark:group-hover:text-brand-dark">
          {game.title}
        </h3>
        {game.genres.length > 0 && (
          <p className="mt-1 text-[11px] leading-tight text-[var(--text-tertiary)] line-clamp-1">
            {game.genres.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );

  if (!game.slug) return <div>{inner}</div>;
  return (
    <Link
      to={`/catalog/videojuegos/${game.slug}`}
      className="block transition-transform duration-200 hover:-translate-y-0.5"
    >
      {inner}
    </Link>
  );
}

interface Props { games: GameCompanyGame[] }

export default function CompanyPopularGames({ games }: Props) {
  return (
    <section>
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Juegos populares</h2>
        {games.length > 0 && (
          <span className="text-sm text-[var(--text-tertiary)]">{games.length} destacados</span>
        )}
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {games.map(game => (
            <PopularGameCard key={game.igdb_id ?? game.slug ?? game.title} game={game} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
          <i className="ri-gamepad-line mb-3 text-4xl text-[var(--text-tertiary)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Sin juegos populares</p>
          <p className="mt-1 max-w-xs text-sm text-[var(--text-secondary)]">
            La importación todavía no incluye juegos destacados para esta compañía.
          </p>
        </div>
      )}
    </section>
  );
}
