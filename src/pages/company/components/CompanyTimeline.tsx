import { useMemo } from 'react';
import { fmtDate, fmtYear } from '@/lib/formatting';
import type { GameCompany } from '@/types/gameCompany';

interface TimelineEvent {
  marker: string;
  label:  string;
  detail?: string;
  icon:   string;
  cls:    string;
}

interface Props { company: GameCompany }

export default function CompanyTimeline({ company }: Props) {
  const events = useMemo<TimelineEvent[]>(() => {
    const list: TimelineEvent[] = [];

    if (company.start_date) {
      list.push({
        marker: String(fmtYear(company.start_date) ?? company.start_date),
        label:  'Fundación',
        detail: company.country ? `Fundada en ${company.country}` : undefined,
        icon:   'ri-building-4-line',
        cls:    'bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark',
      });
    }

    if (company.changed_date && company.changed_date !== company.start_date) {
      const isDefunct = company.status?.toLowerCase() === 'defunct';
      list.push({
        marker: String(fmtYear(company.changed_date) ?? company.changed_date),
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
        marker: fmtDate(company.last_synced_at),
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
