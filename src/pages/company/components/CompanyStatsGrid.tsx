import { useMemo } from 'react';
import { fmtNumber } from '@/lib/formatting';
import type { GameCompany } from '@/types/gameCompany';

interface StatItem {
  icon:    string;
  label:   string;
  value:   string | number | null | undefined;
  iconCls: string;
}

interface Props { company: GameCompany }

export default function CompanyStatsGrid({ company }: Props) {
  const stats = useMemo<StatItem[]>(() => [
    { icon: 'ri-code-box-line',     label: 'Desarrollados',      value: company.developed_count  > 0  ? fmtNumber(company.developed_count)              : null, iconCls: 'bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark' },
    { icon: 'ri-send-plane-line',   label: 'Publicados',         value: company.published_count  > 0  ? fmtNumber(company.published_count)              : null, iconCls: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    { icon: 'ri-git-branch-line',   label: 'Ports',              value: company.ported_count     > 0  ? fmtNumber(company.ported_count)                 : null, iconCls: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    { icon: 'ri-tools-line',        label: 'Soporte',            value: company.supported_count  > 0  ? fmtNumber(company.supported_count)              : null, iconCls: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { icon: 'ri-puzzle-line',       label: 'DLCs / expansiones', value: company.dlc_count        > 0  ? fmtNumber(company.dlc_count)                    : null, iconCls: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
    { icon: 'ri-close-circle-line', label: 'Cancelados',         value: company.cancelled_count  > 0  ? fmtNumber(company.cancelled_count)              : null, iconCls: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    { icon: 'ri-star-line',         label: 'Valoración media',   value: company.average_rating  != null ? Number(company.average_rating).toFixed(1)     : null, iconCls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { icon: 'ri-group-line',        label: 'Total valoraciones', value: company.rating_count     > 0  ? fmtNumber(company.rating_count)                 : null, iconCls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  ].filter(s => s.value != null), [company]);

  if (!stats.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Estadísticas</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {stats.map(stat => (
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
