import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';
import { getPlatformStyle } from '@/constants/platformsGames';
import { useGameCompany } from '@/hooks/useGameCompany';
import type { GameCompany, GameCompanyFacet, GameCompanyGame, RelatedGameCompany } from '@/types/gameCompany';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('es', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

function formatYear(value: string | null): number | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
}

function formatNumber(value: number | null | undefined) {
  return value == null ? null : new Intl.NumberFormat('es').format(value);
}

function statusBadge(value: string | null) {
  if (!value) return null;
  const n = value.toLowerCase();
  if (n === 'active')  return { label: 'Activa',    dot: 'bg-emerald-400', cls: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' };
  if (n === 'defunct') return { label: 'Inactiva',  dot: 'bg-zinc-400',    cls: 'bg-zinc-500/10   text-zinc-500   dark:text-zinc-400'   };
  return                       { label: value,       dot: 'bg-zinc-400',    cls: 'bg-zinc-500/10   text-zinc-500   dark:text-zinc-400'   };
}

function extractFranchises(games: GameCompanyGame[]): string[] {
  if (games.length < 2) return [];
  const titles = games.map(g => g.title);
  const found = new Map<string, number>();

  for (let i = 0; i < titles.length; i++) {
    for (let j = i + 1; j < titles.length; j++) {
      const wa = titles[i].split(' ');
      const wb = titles[j].split(' ');
      let len = 0;
      for (let k = 0; k < Math.min(wa.length, wb.length); k++) {
        const a = wa[k].replace(/[^a-z]/gi, '').toLowerCase();
        const b = wb[k].replace(/[^a-z]/gi, '').toLowerCase();
        if (a && b && a === b) len = k + 1;
        else break;
      }
      if (len >= 2) {
        const f = wa.slice(0, len).join(' ');
        found.set(f, (found.get(f) ?? 0) + 1);
      }
    }
  }

  const sorted = [...found.keys()].sort((a, b) => b.length - a.length);
  const result: string[] = [];
  for (const f of sorted) {
    if (!result.some(r => r.startsWith(f + ' '))) result.push(f);
  }
  return result.slice(0, 8);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-40 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function CompanyHero({ company }: { company: GameCompany }) {
  const rating   = company.average_rating != null ? Number(company.average_rating).toFixed(1) : null;
  const status   = statusBadge(company.status);
  const founding = formatYear(company.start_date);

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      {/* Base */}
      <div className="absolute inset-0 bg-[var(--surface)]" />

      {/* Blurred logo glow */}
      {company.logo_url && (
        <img
          src={company.logo_url}
          aria-hidden
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full scale-[2] object-contain blur-[80px] opacity-[0.07] dark:opacity-[0.13] select-none"
        />
      )}

      {/* Bottom fade into page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="relative flex h-32 w-32 md:h-40 md:w-40 items-center justify-center overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl shadow-black/10 dark:shadow-black/40">
              {company.logo_url
                ? <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain p-5" />
                : <i className="ri-building-4-line text-5xl text-[var(--text-tertiary)]" />}
            </div>
          </div>

          {/* Info block */}
          <div className="min-w-0 flex-1 pb-1">
            {/* Badges */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {status && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand-dark/15 dark:text-brand-dark">
                <i className="ri-gamepad-line" />
                Compañía de videojuegos
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-4xl md:text-6xl font-black leading-none tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {company.name}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
              {company.country && (
                <span className="inline-flex items-center gap-1.5">
                  <i className="ri-map-pin-2-line text-[var(--text-tertiary)]" />
                  {company.country}
                </span>
              )}
              {founding && (
                <span className="inline-flex items-center gap-1.5">
                  <i className="ri-calendar-line text-[var(--text-tertiary)]" />
                  Fundada en {founding}
                </span>
              )}
              {company.parent_company_name && (
                <span className="inline-flex items-center gap-1.5">
                  <i className="ri-node-tree text-[var(--text-tertiary)]" />
                  {company.parent_company_name}
                </span>
              )}
            </div>

            {/* Metrics row */}
            <div className="mt-5 flex flex-wrap items-center gap-3 md:gap-5">
              {rating && (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-500 dark:text-amber-400">
                    <i className="ri-star-fill" />
                    {rating}
                  </div>
                  {company.rating_count > 0 && (
                    <span className="text-sm text-[var(--text-tertiary)]">
                      {formatNumber(company.rating_count)} valoraciones
                    </span>
                  )}
                </div>
              )}
              {company.developed_count > 0 && (
                <span className="text-sm text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--text-primary)]">{formatNumber(company.developed_count)}</span>{' '}
                  desarrollados
                </span>
              )}
              {company.published_count > 0 && (
                <span className="text-sm text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--text-primary)]">{formatNumber(company.published_count)}</span>{' '}
                  publicados
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Popular Games ────────────────────────────────────────────────────────────

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

        {/* Year */}
        {game.release_year && (
          <div className="absolute left-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {game.release_year}
          </div>
        )}

        {/* Rating */}
        {game.rating != null && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
            <i className="ri-star-fill text-[10px] text-amber-400" />
            <span className="text-[11px] font-bold text-white">{Number(game.rating).toFixed(1)}</span>
          </div>
        )}

        {/* Hover tint */}
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

function PopularGames({ games }: { games: GameCompanyGame[] }) {
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

// ─── Stats ────────────────────────────────────────────────────────────────────

interface StatItem {
  icon: string;
  label: string;
  value: string | number | null | undefined;
  iconCls: string;
}

function StatsGrid({ stats }: { stats: StatItem[] }) {
  const visible = stats.filter(s => s.value != null && s.value !== '');
  if (!visible.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Estadísticas</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {visible.map(stat => (
          <div
            key={stat.label}
            className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:shadow-sm dark:hover:border-zinc-600"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconCls}`}>
              <i className={`${stat.icon} text-lg`} />
            </div>
            <p
              className="text-2xl font-black leading-none text-[var(--text-primary)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {stat.value}
            </p>
            <p className="mt-1.5 text-xs font-medium text-[var(--text-secondary)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Franchises ───────────────────────────────────────────────────────────────

function FranchiseSection({ games }: { games: GameCompanyGame[] }) {
  const franchises = useMemo(() => extractFranchises(games), [games]);
  if (!franchises.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Franquicias principales</h2>
      <div className="flex flex-wrap gap-2">
        {franchises.map(name => (
          <span
            key={name}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-brand/40 hover:bg-brand/5 dark:hover:border-brand-dark/40 dark:hover:bg-brand-dark/5 cursor-default"
          >
            <i className="ri-gamepad-fill text-brand dark:text-brand-dark" />
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── Description ──────────────────────────────────────────────────────────────

function DescriptionBlock({ description }: { description: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center">
        <i className="ri-file-text-line mb-2 text-2xl text-[var(--text-tertiary)]" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Sin descripción disponible</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Esta compañía todavía no tiene una descripción importada en Vaultly.
        </p>
      </section>
    );
  }

  const paragraphs = description.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const needsExpand = paragraphs.length > 3;
  const visible = needsExpand && !expanded ? paragraphs.slice(0, 3) : paragraphs;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">Descripción</h2>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
          expanded ? 'max-h-[4000px]' : 'max-h-[420px]'
        }`}
      >
        <div className="space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
          {visible.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
      {needsExpand && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80 dark:text-brand-dark dark:hover:text-brand-dark/80"
        >
          <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

interface TimelineEvent {
  marker: string;
  label: string;
  detail?: string;
  icon: string;
  cls: string;
}

function CompanyTimeline({ company }: { company: GameCompany }) {
  const events = useMemo<TimelineEvent[]>(() => {
    const list: TimelineEvent[] = [];

    if (company.start_date) {
      list.push({
        marker: String(formatYear(company.start_date) ?? company.start_date),
        label:  'Fundación',
        detail: company.country ? `Fundada en ${company.country}` : undefined,
        icon:   'ri-building-4-line',
        cls:    'bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark',
      });
    }

    if (company.changed_date && company.changed_date !== company.start_date) {
      const isDefunct = company.status?.toLowerCase() === 'defunct';
      list.push({
        marker: String(formatYear(company.changed_date) ?? company.changed_date),
        label:  isDefunct ? 'Cierre' : 'Cambio de estado',
        detail: company.parent_company_name
          ? `Adquirida por ${company.parent_company_name}`
          : undefined,
        icon: isDefunct ? 'ri-close-circle-line' : 'ri-refresh-line',
        cls:  isDefunct ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500',
      });
    }

    if (company.last_synced_at) {
      list.push({
        marker: formatDate(company.last_synced_at) ?? '',
        label:  'Última actualización',
        detail: 'Datos sincronizados desde IGDB',
        icon:   'ri-refresh-line',
        cls:    'bg-zinc-500/10 text-zinc-400',
      });
    }

    return list;
  }, [company]);

  if (!events.length) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-6 text-lg font-bold text-[var(--text-primary)]">Línea de tiempo</h2>
      <div className="relative">
        <div className="absolute left-3.5 top-3 bottom-3 w-px bg-[var(--border)]" />
        <div className="space-y-6">
          {events.map((ev, i) => (
            <div key={i} className="relative flex gap-4 pl-10">
              <div className={`absolute left-0 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${ev.cls}`}>
                <i className={`${ev.icon} text-xs`} />
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className="text-sm font-black text-[var(--text-primary)]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {ev.marker}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{ev.label}</span>
                </div>
                {ev.detail && (
                  <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{ev.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Related Companies ────────────────────────────────────────────────────────

function RelatedCompanies({ companies }: { companies: RelatedGameCompany[] }) {
  if (!companies.length) return null;
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">Compañías relacionadas</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {companies.map(company => {
          const inner = (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] p-3 transition-colors hover:border-brand/30 dark:hover:border-brand-dark/30">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <i className="ri-building-4-line text-sm text-[var(--text-tertiary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{company.name}</p>
                <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                  {company.relation ?? 'Relación por catálogo'}
                  {company.shared_games_count ? ` · ${company.shared_games_count} compartidos` : ''}
                </p>
              </div>
              {company.slug && (
                <i className="ri-arrow-right-s-line flex-shrink-0 text-[var(--text-tertiary)]" />
              )}
            </div>
          );
          return company.slug
            ? <Link key={company.slug} to={`/company/${company.slug}`}>{inner}</Link>
            : <div key={company.name}>{inner}</div>;
        })}
      </div>
    </section>
  );
}

// ─── Sidebar: General Info ────────────────────────────────────────────────────

function GeneralInfo({ company }: { company: GameCompany }) {
  const items = [
    { icon: 'ri-map-pin-2-line',  label: 'País',           value: company.country },
    { icon: 'ri-calendar-line',   label: 'Fundación',      value: formatDate(company.start_date) },
    { icon: 'ri-node-tree',       label: 'Empresa matriz', value: company.parent_company_name },
  ].filter(i => i.value);

  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Información</h2>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--surface-sunken)]">
              <i className={`${item.icon} text-xs text-[var(--text-secondary)]`} />
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-tertiary)]">{item.label}</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Sidebar: External Links ──────────────────────────────────────────────────

function ExternalLinks({ links }: { links: GameCompany['links'] }) {
  const items = [
    { key: 'website',   label: 'Web oficial', icon: 'ri-global-line',      href: links.website,   cls: 'text-blue-500' },
    { key: 'twitter',   label: 'Twitter / X',  icon: 'ri-twitter-x-line',   href: links.twitter,   cls: 'text-zinc-600 dark:text-zinc-300' },
    { key: 'discord',   label: 'Discord',       icon: 'ri-discord-line',      href: links.discord,   cls: 'text-indigo-500' },
    { key: 'wikipedia', label: 'Wikipedia',     icon: 'ri-wikipedia-line',    href: links.wikipedia, cls: 'text-zinc-500' },
    { key: 'linkedin',  label: 'LinkedIn',      icon: 'ri-linkedin-box-line', href: links.linkedin,  cls: 'text-blue-600' },
  ].filter(i => i.href);

  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Enlaces</h2>
      <div className="space-y-2">
        {items.map(item => (
          <a
            key={item.key}
            href={item.href!}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] px-3 py-2.5 transition-colors hover:border-[var(--text-tertiary)]/25"
          >
            <i className={`${item.icon} flex-shrink-0 text-base ${item.cls}`} />
            <span className="text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
              {item.label}
            </span>
            <i className="ri-external-link-line ml-auto flex-shrink-0 text-xs text-[var(--text-tertiary)]" />
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Sidebar: Platforms ───────────────────────────────────────────────────────

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
              className="inline-flex items-center gap-1.5 rounded-full border bg-[var(--surface-sunken)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition-all hover:brightness-110"
              style={{ borderColor: `${style.color}55` }}
            >
              <i className={`${style.icon} text-sm flex-shrink-0`} style={{ color: style.color }} />
              {p.name}
              {p.count ? <span className="opacity-40">· {p.count}</span> : null}
            </span>
          );
        })}
      </div>
    </section>
  );
}

// ─── Sidebar: Genres ──────────────────────────────────────────────────────────

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

// ─── Sidebar: Metadata ────────────────────────────────────────────────────────

function MetadataFooter({ company }: { company: GameCompany }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] px-4 py-3 text-[11px] text-[var(--text-tertiary)]">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>IGDB ID: {company.igdb_id}</span>
        <span>Fuente: IGDB</span>
        {company.last_synced_at && (
          <span>Actualizado: {formatDate(company.last_synced_at)}</span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompanyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { company, loading, error } = useGameCompany(slug);

  const description = company?.description_es || company?.description || null;

  const stats = useMemo<StatItem[]>(() => {
    if (!company) return [];
    return [
      { icon: 'ri-code-box-line',     label: 'Desarrollados',      value: company.developed_count  > 0 ? formatNumber(company.developed_count)              : null, iconCls: 'bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark' },
      { icon: 'ri-send-plane-line',   label: 'Publicados',         value: company.published_count  > 0 ? formatNumber(company.published_count)              : null, iconCls: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
      { icon: 'ri-git-branch-line',   label: 'Ports',              value: company.ported_count     > 0 ? formatNumber(company.ported_count)                 : null, iconCls: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
      { icon: 'ri-tools-line',        label: 'Soporte',            value: company.supported_count  > 0 ? formatNumber(company.supported_count)              : null, iconCls: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
      { icon: 'ri-puzzle-line',       label: 'DLCs / expansiones', value: company.dlc_count        > 0 ? formatNumber(company.dlc_count)                    : null, iconCls: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
      { icon: 'ri-close-circle-line', label: 'Cancelados',         value: company.cancelled_count  > 0 ? formatNumber(company.cancelled_count)              : null, iconCls: 'bg-red-500/10 text-red-600 dark:text-red-400' },
      { icon: 'ri-star-line',         label: 'Valoración media',   value: company.average_rating  != null ? Number(company.average_rating).toFixed(1)       : null, iconCls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
      { icon: 'ri-group-line',        label: 'Total valoraciones', value: company.rating_count     > 0 ? formatNumber(company.rating_count)                 : null, iconCls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    ].filter(s => s.value != null);
  }, [company]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <div className="pt-14 md:pt-0 md:pl-64"><PageSkeleton /></div>
      </div>
    );
  }

  // ── Not found ──
  if (error || !company) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <SeoHead
          title="Compañía no encontrada | Vaultly"
          description="No hemos encontrado esta compañía en Vaultly."
          canonical={`/company/${slug ?? ''}`}
        />
        <Sidebar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-14 text-center md:pt-0 md:pl-64">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <i className="ri-building-4-line text-3xl text-[var(--text-tertiary)]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-primary)]">Compañía no encontrada</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {error ?? 'No hay una compañía con este slug en Supabase.'}
            </p>
          </div>
          <Link
            to="/catalog"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-brand-dark"
          >
            <i className="ri-arrow-left-line" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // ── Page ──
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SeoHead
        title={`${company.name} | Vaultly`}
        description={description ? description.slice(0, 155) : `${company.name} en Vaultly.`}
        keywords={`${company.name}, videojuegos, compañía, desarrolladora, publisher, Vaultly`}
        canonical={`/company/${company.slug}`}
        ogImage={company.logo_url ?? undefined}
      />
      <Sidebar />

      <div className="pt-14 md:pt-0 md:pl-64">

        {/* ── Hero ── */}
        <CompanyHero company={company} />

        <main className="mx-auto max-w-screen-xl px-4 py-8 md:px-6 md:py-10 space-y-10">

          {/* 1. Popular games — main section, full width */}
          <PopularGames games={company.popular_games} />

          {/* 2. Stats grid */}
          {stats.length > 0 && <StatsGrid stats={stats} />}

          {/* 3. Franchises */}
          <FranchiseSection games={company.popular_games} />

          {/* 4–9. Two-column layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">

            {/* Main column */}
            <div className="space-y-6">
              <DescriptionBlock description={description} />
              <CompanyTimeline company={company} />
              <RelatedCompanies companies={company.related_companies} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <GeneralInfo company={company} />
              <ExternalLinks links={company.links} />
              <PlatformChips platforms={company.platforms} />
              <GenreChips items={company.genres} />
              <MetadataFooter company={company} />
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}
