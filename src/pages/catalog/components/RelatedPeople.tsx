import { Link } from 'react-router-dom';
import { ItemDetail } from '@/mocks/itemDetail';
import { PEOPLE_MOCK, PERSON_NAME_TO_ID } from '@/mocks/people';
import { useItemEntities, ROLE_CONFIG, type ItemEntity } from '@/hooks/useItemEntities';
import { buildEntitySlug } from '@/hooks/useEntity';

interface Props {
  item: ItemDetail;
  itemId?: string | null;
}

// ─── Role config for mock path ─────────────────────────────────────────────────
const MOCK_ROLE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  Director: { label: 'Director/a', icon: 'ri-movie-line', color: '#f43f5e' },
  Reparto: { label: 'Reparto', icon: 'ri-user-star-line', color: '#8b5cf6' },
  Autor: { label: 'Autor/a', icon: 'ri-quill-pen-line', color: '#10b981' },
  Artista: { label: 'Artista', icon: 'ri-music-2-line', color: '#0ea5e9' },
  Desarrollador: { label: 'Desarrollador', icon: 'ri-code-box-line', color: '#f59e0b' },
  Publisher: { label: 'Publisher', icon: 'ri-building-line', color: '#6366f1' },
};

// ─── Real entity card (Supabase path) ─────────────────────────────────────────
function EntityCard({ entity }: { entity: ItemEntity }) {
  const roleConf = ROLE_CONFIG[entity.role] ?? {
    label: entity.role,
    icon: 'ri-user-line',
    color: '#71717a',
    priority: 99,
  };

  return (
    <Link
      to={`/entity/${entity.slug}`}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700 group-hover:border-zinc-300 dark:group-hover:border-zinc-500 transition-colors"
          style={{ background: entity.image ? undefined : `${roleConf.color}18` }}
        >
          {entity.image ? (
            <img
              src={entity.image}
              alt={entity.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className={`${roleConf.icon} text-lg`} style={{ color: roleConf.color }}></i>
            </div>
          )}
        </div>
        {/* Role dot */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-900"
          style={{ background: roleConf.color }}
        >
          <i className={`${roleConf.icon} text-white`} style={{ fontSize: 7 }}></i>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
          {entity.name}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: roleConf.color }}>
          {roleConf.label}
        </p>
      </div>

      {/* Arrow */}
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <i className="ri-arrow-right-s-line text-zinc-400 text-sm"></i>
      </div>
    </Link>
  );
}

// ─── Mock person card (legacy path) ───────────────────────────────────────────
interface MockPersonEntry {
  name: string;
  role: string;
}

function MockPersonCard({ name, role }: MockPersonEntry) {
  const personId = PERSON_NAME_TO_ID[name];
  const person = personId ? PEOPLE_MOCK[personId] : null;
  const roleConf = MOCK_ROLE_CONFIG[role] ?? { label: role, icon: 'ri-user-line', color: '#71717a' };

  // Determine link target
  const linkTo = personId
    ? `/person/${personId}`
    : `/entity/${buildEntitySlug(name, roleConf.label.toLowerCase())}`;

  return (
    <Link
      to={linkTo}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700 group-hover:border-zinc-300 dark:group-hover:border-zinc-500 transition-colors"
          style={{ background: person?.photo ? undefined : `${roleConf.color}18` }}
        >
          {person?.photo ? (
            <img
              src={person.photo}
              alt={name}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className={`${roleConf.icon} text-lg`} style={{ color: roleConf.color }}></i>
            </div>
          )}
        </div>
        {/* Role dot */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-900"
          style={{ background: roleConf.color }}
        >
          <i className={`${roleConf.icon} text-white`} style={{ fontSize: 7 }}></i>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
          {name}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: roleConf.color }}>
          {roleConf.label}
        </p>
        {person?.known_for && person.known_for.length > 0 && (
          <p className="text-xs text-zinc-400 mt-0.5 truncate">
            {person.known_for.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <i className="ri-arrow-right-s-line text-zinc-400 text-sm"></i>
      </div>
    </Link>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function EntitiesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0"></div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-28"></div>
            <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Role group header ─────────────────────────────────────────────────────────
function RoleGroupHeader({ label, icon, color, count }: { label: string; icon: string; color: string; count: number }) {
  return (
    <div className="flex items-center justify-between mb-1 px-1">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <i className={`${icon} text-sm`} style={{ color }}></i>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <span
        className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
        style={{ background: `${color}18`, color }}
      >
        {count}
      </span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function RelatedPeople({ item, itemId }: Props) {
  const { entities, loading } = useItemEntities(itemId ?? null);

  // ── Real entities path (Supabase) ──────────────────────────────────────────
  if (itemId) {
    if (loading) {
      return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Personas y estudios</h2>
          </div>
          <EntitiesSkeleton count={5} />
        </div>
      );
    }

    if (entities.length === 0) return null;

    // Group by role
    const grouped = entities.reduce<Record<string, ItemEntity[]>>((acc, e) => {
      if (!acc[e.role]) acc[e.role] = [];
      acc[e.role].push(e);
      return acc;
    }, {});

    const roleOrder = ['director', 'developer', 'author', 'artist', 'creator', 'studio', 'publisher', 'actor'];
    const sortedRoles = Object.keys(grouped).sort((a, b) => {
      const ia = roleOrder.indexOf(a);
      const ib = roleOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Personas y estudios</h2>
          <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full font-medium">
            {entities.length}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {sortedRoles.map(role => {
            const conf = ROLE_CONFIG[role] ?? { label: role, icon: 'ri-user-line', color: '#71717a', priority: 99 };
            return (
              <div key={role}>
                <RoleGroupHeader
                  label={conf.label}
                  icon={conf.icon}
                  color={conf.color}
                  count={grouped[role].length}
                />
                <div className="flex flex-col">
                  {grouped[role].map(entity => (
                    <EntityCard key={entity.id} entity={entity} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Mock / legacy path ─────────────────────────────────────────────────────
  // Build grouped entries
  const grouped: Record<string, string[]> = {};

  if (item.director) {
    if (!grouped['Director']) grouped['Director'] = [];
    grouped['Director'].push(item.director);
  }
  if (item.cast && item.cast.length > 0) {
    grouped['Reparto'] = item.cast.slice(0, 8);
  }
  if (item.author) {
    if (!grouped['Autor']) grouped['Autor'] = [];
    grouped['Autor'].push(item.author);
  }
  if (item.artist) {
    if (!grouped['Artista']) grouped['Artista'] = [];
    grouped['Artista'].push(item.artist);
  }
  if (item.developer) {
    if (!grouped['Desarrollador']) grouped['Desarrollador'] = [];
    grouped['Desarrollador'].push(item.developer);
  }
  if (item.publisher && item.publisher !== item.developer) {
    if (!grouped['Publisher']) grouped['Publisher'] = [];
    grouped['Publisher'].push(item.publisher);
  }

  const roleOrder = ['Director', 'Desarrollador', 'Publisher', 'Autor', 'Artista', 'Reparto'];
  const sortedRoles = Object.keys(grouped).sort((a, b) => {
    const ia = roleOrder.indexOf(a);
    const ib = roleOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  if (sortedRoles.length === 0) return null;

  const totalPeople = sortedRoles.reduce((s, r) => s + grouped[r].length, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Personas relacionadas</h2>
        <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full font-medium">
          {totalPeople}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {sortedRoles.map(role => {
          const conf = MOCK_ROLE_CONFIG[role] ?? { label: role, icon: 'ri-user-line', color: '#71717a' };
          return (
            <div key={role}>
              <RoleGroupHeader
                label={conf.label}
                icon={conf.icon}
                color={conf.color}
                count={grouped[role].length}
              />
              <div className="flex flex-col">
                {grouped[role].map(name => (
                  <MockPersonCard key={name} name={name} role={role} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
