import { type Person } from '@/mocks/people';

interface Props {
  person: Person;
}

export default function PersonBio({ person }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2
        className="text-lg font-bold text-zinc-900 dark:text-white mb-4"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Biografía
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm mb-6">
        {person.bio}
      </p>

      {/* Known for */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Conocido/a por
        </h3>
        <div className="flex flex-wrap gap-2">
          {person.known_for.map(title => (
            <span
              key={title}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
            >
              {title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
