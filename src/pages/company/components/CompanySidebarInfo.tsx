import { fmtDate } from '@/lib/formatting';
import type { GameCompany } from '@/types/gameCompany';

interface Props { company: GameCompany }

export default function CompanySidebarInfo({ company }: Props) {
  const items = [
    { icon: 'ri-map-pin-2-line',  label: 'País',           value: company.country },
    { icon: 'ri-calendar-line',   label: 'Fundación',      value: fmtDate(company.start_date) },
    { icon: 'ri-node-tree',       label: 'Empresa matriz', value: company.parent_company_name },
  ].filter(i => i.value);

  return (
    <>
      {items.length > 0 && (
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
      )}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] px-4 py-3 text-[11px] text-[var(--text-tertiary)]">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>IGDB ID: {company.igdb_id}</span>
          <span>Fuente: IGDB</span>
          {company.last_synced_at && (
            <span>Actualizado: {fmtDate(company.last_synced_at)}</span>
          )}
        </div>
      </div>
    </>
  );
}
