import { useState } from 'react';
import type { CastMember } from '@/types/itemDetail';

const LIMIT = 10;

function CastCard({ member }: { member: CastMember }) {
  const initials = member.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/40">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <span className="text-xl font-bold text-zinc-500">{initials}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-100 leading-tight line-clamp-1">{member.name}</p>
        {member.character && (
          <p className="text-xs text-zinc-500 leading-tight line-clamp-1 mt-0.5 italic">{member.character}</p>
        )}
      </div>
    </div>
  );
}

interface Props {
  cast: CastMember[];
  sectionTitle?: string;
}

export default function ItemCastSection({ cast, sectionTitle = 'Reparto principal' }: Props) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? cast : cast.slice(0, LIMIT);

  if (cast.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">{sectionTitle}</h2>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full font-medium">
          {cast.length}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {shown.map((member, i) => (
          <CastCard key={`${member.name}-${i}`} member={member} />
        ))}
      </div>

      {cast.length > LIMIT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-5 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 bg-zinc-800/60 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
          {expanded ? 'Ver menos' : `Ver ${cast.length - LIMIT} más`}
        </button>
      )}
    </div>
  );
}
