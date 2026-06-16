import type { GameCompany } from '@/types/gameCompany';

interface Props { links: GameCompany['links'] }

export default function CompanyLinks({ links }: Props) {
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
