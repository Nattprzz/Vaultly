import { useState } from 'react';

interface Props { description: string | null }

export default function CompanyDescription({ description }: Props) {
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

  const paragraphs  = description.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const needsExpand = paragraphs.length > 3;
  const visible     = needsExpand && !expanded ? paragraphs.slice(0, 3) : paragraphs;

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
