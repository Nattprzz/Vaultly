import { Link } from 'react-router-dom';
import type { RelatedGameCompany } from '@/types/gameCompany';

interface Props { companies: RelatedGameCompany[] }

export default function RelatedCompanies({ companies }: Props) {
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
