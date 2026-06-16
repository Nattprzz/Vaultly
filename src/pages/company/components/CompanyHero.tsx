import { fmtYear, fmtNumber } from '@/lib/formatting';
import type { GameCompany } from '@/types/gameCompany';

const ACTIVE_STATUSES   = new Set(['active', 'active company', 'operating', 'alive']);
const INACTIVE_STATUSES = new Set(['inactive', 'closed', 'dissolved', 'defunct', 'bankrupt']);

const STATUS_VARIANTS = {
  active: {
    label: 'Activa',
    dot: 'bg-green-500',
    cls: 'border bg-green-100 text-green-900 border-green-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/35',
  },
  inactive: {
    label: 'Inactiva',
    dot: 'bg-red-500',
    cls: 'border bg-red-100 text-red-800 border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/35',
  },
  unknown: {
    label: 'Desconocido',
    dot: 'bg-slate-400',
    cls: 'border bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-400/10 dark:text-slate-400 dark:border-slate-400/25',
  },
} as const;

function statusBadge(value: string | null | undefined) {
  const n = (value ?? '').toLowerCase().trim();
  if (ACTIVE_STATUSES.has(n))   return STATUS_VARIANTS.active;
  if (INACTIVE_STATUSES.has(n)) return STATUS_VARIANTS.inactive;
  return STATUS_VARIANTS.unknown;
}

interface Props { company: GameCompany }

export default function CompanyHero({ company }: Props) {
  const rating   = company.average_rating != null ? Number(company.average_rating).toFixed(1) : null;
  const status   = statusBadge(company.status);
  const founding = fmtYear(company.start_date);

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="absolute inset-0 bg-[var(--surface)]" />
      {company.logo_url && (
        <img
          src={company.logo_url}
          aria-hidden
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full scale-[2] object-contain blur-[80px] opacity-[0.07] dark:opacity-[0.13] select-none"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">

          <div className="flex-shrink-0">
            <div className="relative flex h-32 w-32 md:h-40 md:w-40 items-center justify-center overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl shadow-black/10 dark:shadow-black/40">
              {company.logo_url
                ? <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain p-5" />
                : <i className="ri-building-4-line text-5xl text-[var(--text-tertiary)]" />}
            </div>
          </div>

          <div className="min-w-0 flex-1 pb-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand-dark/15 dark:text-brand-dark">
                <i className="ri-gamepad-line" />
                Compañía de videojuegos
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-black leading-none tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {company.name}
            </h1>

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

            <div className="mt-5 flex flex-wrap items-center gap-3 md:gap-5">
              {rating && (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-500 dark:text-amber-400">
                    <i className="ri-star-fill" />
                    {rating}
                  </div>
                  {company.rating_count > 0 && (
                    <span className="text-sm text-[var(--text-tertiary)]">
                      {fmtNumber(company.rating_count)} valoraciones
                    </span>
                  )}
                </div>
              )}
              {company.developed_count > 0 && (
                <span className="text-sm text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--text-primary)]">{fmtNumber(company.developed_count)}</span>{' '}
                  desarrollados
                </span>
              )}
              {company.published_count > 0 && (
                <span className="text-sm text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--text-primary)]">{fmtNumber(company.published_count)}</span>{' '}
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
