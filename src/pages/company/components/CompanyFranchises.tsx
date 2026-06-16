import { useMemo } from 'react';
import type { GameCompanyGame } from '@/types/gameCompany';

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

interface Props { games: GameCompanyGame[] }

export default function CompanyFranchises({ games }: Props) {
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
