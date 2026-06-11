import { ItemDetail } from '@/types/itemDetail';
import { useItemEntities, ROLE_CONFIG, type ItemEntity } from '@/hooks/useItemEntities';

interface Props {
  item: ItemDetail;
  itemId?: string | null;
}

function EntityCard({ entity }: { entity: ItemEntity }) {
  const roleConf = ROLE_CONFIG[entity.role] ?? {
    label: entity.role,
    icon: 'ri-user-line',
    color: '#71717a',
    priority: 99,
  };

  return (
    <div
      className="group flex items-center gap-3 p-3 rounded-xl"
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700"
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
        <div
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-900"
          style={{ background: roleConf.color }}
        >
          <i className={`${roleConf.icon} text-white`} style={{ fontSize: 7 }}></i>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight line-clamp-1">
          {entity.name}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: roleConf.color }}>
          {roleConf.label}
        </p>
      </div>

      <div className="w-5 h-5 flex-shrink-0"></div>
    </div>
  );
}

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

export default function RelatedPeople({ item, itemId }: Props) {
  const { entities, loading } = useItemEntities(itemId ?? null);
  void item;

  if (!itemId) return null;

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
