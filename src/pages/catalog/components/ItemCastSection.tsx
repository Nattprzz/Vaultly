/**
 * ItemCastSection.tsx — sección de reparto del ítem.
 *
 * Presenta las fotos y nombres de los miembros del reparto en una cuadrícula
 * responsive. Cada tarjeta enlaza a la página /cast/[slug] de la persona.
 * Si el miembro no tiene foto, muestra sus iniciales generadas a partir del
 * nombre. Cuando el reparto supera LIMIT elementos, el excedente queda oculto
 * y el usuario puede expandirlo con un botón.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { CastMember } from '@/types/itemDetail';

// ─── Constantes ──────────────────────────────────────────────────────────────

const LIMIT = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generatePersonSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/-+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Sub-componente ──────────────────────────────────────────────────────────

function CastCard({ member }: { member: CastMember }) {
  const initials = member.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase();

  const slug = generatePersonSlug(member.name);

  const cardContent = (
    <div className="flex flex-col gap-2">
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)]">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--surface-raised)]">
            <span className="text-xl font-bold text-[var(--text-tertiary)]">{initials}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight line-clamp-1">
          {member.name}
        </p>
        {member.character && (
          <p className="text-xs text-[var(--text-tertiary)] leading-tight line-clamp-1 mt-0.5 italic">
            {member.character}
          </p>
        )}
      </div>
    </div>
  );

  if (!slug) return cardContent;

  return (
    <Link to={`/cast/${slug}`} className="block hover:opacity-80 transition-opacity">
      {cardContent}
    </Link>
  );
}

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

interface Props {
  cast: CastMember[];
  sectionTitle?: string;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ItemCastSection({ cast, sectionTitle = 'Reparto principal' }: Props) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? cast : cast.slice(0, LIMIT);

  if (cast.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{sectionTitle}</h2>
        <span className="text-xs text-[var(--text-secondary)] bg-[var(--surface-raised)] border border-[var(--border)] px-2.5 py-1 rounded-full font-medium">
          {cast.length}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {shown.map((member, i) => (
          <div
            key={`${member.name}-${i}`}
            className="w-[calc(33%-11px)] sm:w-[calc(25%-12px)] md:w-[calc(20%-13px)] shrink-0"
          >
            <CastCard member={member} />
          </div>
        ))}
      </div>

      {cast.length > LIMIT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-5 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface-raised)] border border-[var(--border)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
          {expanded ? 'Ver menos' : `Ver ${cast.length - LIMIT} más`}
        </button>
      )}
    </div>
  );
}
