import { getPlatformStyle, getReadableTextColor } from '@/constants/platformsGames';
import type { GameCompanyFacet } from '@/types/gameCompany';

function PlatformChips({ platforms }: { platforms: GameCompanyFacet[] }) {
  if (!platforms.length) return null;
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Plataformas</h2>
      <div className="flex flex-wrap gap-1.5">
        {platforms.map(p => {
          const style = getPlatformStyle(p.name);
          return (
            <span
              key={p.name}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all hover:brightness-110"
              style={{ backgroundColor: style.color, color: getReadableTextColor(style.color) }}
            >
              <i className={`${style.icon} text-sm flex-shrink-0`} />
              {p.name}
              {p.count ? <span className="opacity-60">· {p.count}</span> : null}
            </span>
          );
        })}
      </div>
    </section>
  );
}

function GenreChips({ items }: { items: GameCompanyFacet[] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Géneros</h2>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span
            key={item.name}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-sunken)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-brand/30 hover:text-[var(--text-primary)] dark:hover:border-brand-dark/30"
          >
            {item.name}{item.count ? ` · ${item.count}` : ''}
          </span>
        ))}
      </div>
    </section>
  );
}

interface Props {
  platforms: GameCompanyFacet[];
  genres:    GameCompanyFacet[];
}

export default function CompanyGenresPlatforms({ platforms, genres }: Props) {
  if (!platforms.length && !genres.length) return null;
  return (
    <>
      <PlatformChips platforms={platforms} />
      <GenreChips items={genres} />
    </>
  );
}
