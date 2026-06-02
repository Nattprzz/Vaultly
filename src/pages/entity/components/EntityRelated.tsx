import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { EntityItem } from '@/hooks/useEntity';
import { TYPE_LABELS, TYPE_ICONS } from '@/hooks/useEntity';
import { PEOPLE_MOCK } from '@/mocks/people';

interface Props {
  items: EntityItem[];
  currentSlug: string;
}

interface Collaborator {
  id: string;
  name: string;
  photo: string;
  role: string;
  sharedWorkIds: string[];
  sharedWorkTitles: string[];
  collaborationCount: number;
}

// Derive entity type from person role string
function roleToType(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('director')) return 'director';
  if (r.includes('actor') || r.includes('actriz')) return 'actor';
  if (r.includes('autor') || r.includes('author')) return 'author';
  if (r.includes('artista') || r.includes('artist')) return 'artist';
  if (r.includes('desarrollador') || r.includes('developer')) return 'developer';
  if (r.includes('publisher')) return 'publisher';
  return 'creator';
}

export default function EntityRelated({ items, currentSlug }: Props) {
  const [showAll, setShowAll] = useState(false);

  // Build set of item IDs this entity has worked on
  const myItemIds = useMemo(
    () => new Set(items.map(i => i.id)),
    [items]
  );

  // Find collaborators from PEOPLE_MOCK
  const collaborators = useMemo<Collaborator[]>(() => {
    if (myItemIds.size === 0) return [];

    const result: Collaborator[] = [];

    Object.values(PEOPLE_MOCK).forEach(person => {
      // Skip the current entity itself
      if (person.id === currentSlug) return;

      const shared = person.works.filter(w => myItemIds.has(w.id));
      if (shared.length === 0) return;

      result.push({
        id: person.id,
        name: person.name,
        photo: person.photo,
        role: person.role,
        sharedWorkIds: shared.map(w => w.id),
        sharedWorkTitles: shared.map(w => w.title),
        collaborationCount: shared.length,
      });
    });

    // Sort by number of shared works desc, then name asc
    return result.sort((a, b) =>
      b.collaborationCount - a.collaborationCount || a.name.localeCompare(b.name)
    );
  }, [myItemIds, currentSlug]);

  if (collaborators.length === 0) return null;

  const LIMIT = 8;
  const displayed = showAll ? collaborators : collaborators.slice(0, LIMIT);
  const hasMore = collaborators.length > LIMIT && !showAll;

  return (
    <div className="mt-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-zinc-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Colaboradores frecuentes
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personas y estudios que han trabajado en las mismas obras
          </p>
        </div>
        <span className="text-sm text-zinc-400 font-medium">
          {collaborators.length} encontrado{collaborators.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayed.map(collab => {
          const type = roleToType(collab.role);
          const typeIcon = TYPE_ICONS[type] ?? 'ri-user-line';
          const typeLabel = TYPE_LABELS[type] ?? collab.role;

          return (
            <Link
              key={collab.id}
              to={`/entity/${collab.id}`}
              className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={collab.photo}
                      alt={collab.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Type icon badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                    <i className={`${typeIcon} text-zinc-500 dark:text-zinc-400`} style={{ fontSize: 9 }}></i>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                    {collab.name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{typeLabel}</p>
                </div>
              </div>

              {/* Collaboration badge */}
              <div className="mt-3 flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                  <i className="ri-links-line text-zinc-400 text-xs"></i>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {collab.collaborationCount} obra{collab.collaborationCount !== 1 ? 's' : ''} en común
                  </span>
                </div>
              </div>

              {/* Shared works list */}
              <div className="mt-2.5 flex flex-col gap-1">
                {collab.sharedWorkTitles.slice(0, 2).map((title, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0"></div>
                    <span className="text-xs text-zinc-400 truncate">{title}</span>
                  </div>
                ))}
                {collab.sharedWorkTitles.length > 2 && (
                  <span className="text-xs text-zinc-400 italic pl-2.5">
                    +{collab.sharedWorkTitles.length - 2} más
                  </span>
                )}
              </div>

              {/* Arrow hint */}
              <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  Ver perfil
                  <i className="ri-arrow-right-line text-xs"></i>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Show more */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line text-sm"></i>
            Ver {collaborators.length - LIMIT} colaboradores más
          </button>
        </div>
      )}
    </div>
  );
}
