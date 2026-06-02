import { Link } from 'react-router-dom';
import { ItemDetail } from '@/mocks/itemDetail';
import { PEOPLE_MOCK, PERSON_NAME_TO_ID } from '@/mocks/people';
import { buildEntitySlug } from '@/hooks/useEntity';

interface Props {
  item: ItemDetail;
}

const LABEL_TO_ENTITY_TYPE: Record<string, string> = {
  'Director': 'director',
  'Reparto': 'actor',
  'Autor': 'author',
  'Artista': 'artist',
  'Desarrollador': 'developer',
  'Publisher': 'publisher',
};

const LABEL_ICON: Record<string, string> = {
  'Director': 'ri-movie-line',
  'Reparto': 'ri-user-star-line',
  'Autor': 'ri-quill-pen-line',
  'Artista': 'ri-music-2-line',
  'Desarrollador': 'ri-code-box-line',
  'Publisher': 'ri-building-line',
};

const LABEL_COLOR: Record<string, string> = {
  'Director': '#f43f5e',
  'Reparto': '#8b5cf6',
  'Autor': '#10b981',
  'Artista': '#0ea5e9',
  'Desarrollador': '#f59e0b',
  'Publisher': '#6366f1',
};

/** Rich person chip with avatar if available */
function PersonChip({ name, entityType }: { name: string; entityType?: string }) {
  const personId = PERSON_NAME_TO_ID[name];
  const person = personId ? PEOPLE_MOCK[personId] : null;
  const linkTo = personId
    ? `/person/${personId}`
    : entityType
      ? `/entity/${buildEntitySlug(name, entityType)}`
      : null;

  const inner = (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-xs font-medium text-zinc-700 dark:text-zinc-300">
      {person?.photo ? (
        <img
          src={person.photo}
          alt={name}
          className="w-4 h-4 rounded-full object-cover object-top flex-shrink-0"
        />
      ) : (
        <i className="ri-user-line text-zinc-400 text-xs flex-shrink-0"></i>
      )}
      {name}
      {linkTo && <i className="ri-arrow-right-s-line text-zinc-400 text-xs flex-shrink-0"></i>}
    </span>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="cursor-pointer">
        {inner}
      </Link>
    );
  }
  return <span>{inner}</span>;
}

const PERSON_FIELDS = new Set(['Director', 'Reparto', 'Autor', 'Artista', 'Desarrollador', 'Publisher']);

export default function ItemInfo({ item }: Props) {
  const details: { label: string; value: string | string[] }[] = [];

  if (item.developer) details.push({ label: 'Desarrollador', value: item.developer });
  if (item.publisher) details.push({ label: 'Publisher', value: item.publisher });
  if (item.platforms) details.push({ label: 'Plataformas', value: item.platforms });
  if (item.director) details.push({ label: 'Director', value: item.director });
  if (item.cast) details.push({ label: 'Reparto', value: item.cast.slice(0, 6) });
  if (item.duration) details.push({ label: 'Duración', value: item.duration });
  if (item.network) details.push({ label: 'Plataforma', value: item.network });
  if (item.seasons) details.push({ label: 'Temporadas', value: String(item.seasons) });
  if (item.episodes) details.push({ label: 'Episodios', value: String(item.episodes) });
  if (item.author) details.push({ label: 'Autor', value: item.author });
  if (item.pages) details.push({ label: 'Páginas', value: String(item.pages) });
  if (item.isbn) details.push({ label: 'ISBN', value: item.isbn });
  if (item.artist) details.push({ label: 'Artista', value: item.artist });
  if (item.venue) details.push({ label: 'Recinto', value: item.venue });
  if (item.city) details.push({ label: 'Ciudad', value: item.city });

  return (
    <div className="flex flex-col gap-8">
      {/* Description */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Descripción</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">{item.description}</p>
      </div>

      {/* Details */}
      {details.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Información</h2>
          <div className="flex flex-col gap-4">
            {details.map(d => {
              const isPerson = PERSON_FIELDS.has(d.label);
              const icon = LABEL_ICON[d.label];
              const color = LABEL_COLOR[d.label];

              return (
                <div key={d.label} className="flex flex-col gap-2">
                  {/* Label row */}
                  <div className="flex items-center gap-1.5">
                    {icon && (
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        <i className={`${icon} text-xs`} style={{ color: color ?? '#71717a' }}></i>
                      </div>
                    )}
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {d.label}
                    </span>
                  </div>

                  {/* Value */}
                  {Array.isArray(d.value) ? (
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      {d.value.map(v =>
                        isPerson ? (
                          <PersonChip key={v} name={v} entityType={LABEL_TO_ENTITY_TYPE[d.label]} />
                        ) : (
                          <span
                            key={v}
                            className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                          >
                            {v}
                          </span>
                        )
                      )}
                    </div>
                  ) : isPerson ? (
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      <PersonChip name={d.value as string} entityType={LABEL_TO_ENTITY_TYPE[d.label]} />
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-800 dark:text-zinc-200 font-medium pl-5">
                      {d.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Setlist */}
      {item.setlist && item.setlist.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Setlist (extracto)</h2>
          <ol className="flex flex-col gap-1">
            {item.setlist.map((song, i) => (
              <li
                key={song}
                className="flex items-center gap-3 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <span className="text-xs font-bold text-zinc-300 dark:text-zinc-600 w-5 text-right flex-shrink-0">
                  {i + 1}
                </span>
                <i className="ri-music-2-line text-zinc-400 text-sm flex-shrink-0"></i>
                <span className="text-sm text-zinc-800 dark:text-zinc-200">{song}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
