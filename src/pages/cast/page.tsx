/**
 * cast/page.tsx — ficha de una persona (actor, director, autor, artista…).
 *
 * Carga los datos de la entidad por su slug usando useEntity(), que consulta
 * la Edge Function catalog-entity. Muestra foto, nombre, tipo, biografía y
 * los ítems del catálogo vinculados a esta persona.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link, useNavigate, useParams } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useEntity, TYPE_LABELS, TYPE_ICONS } from '@/hooks/useEntity';

// ─── Componentes ──────────────────────────────────────────────────────────────

import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function CastSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 pt-24 md:pt-10">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="w-40 h-52 rounded-2xl bg-[var(--surface-raised)] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-3 pt-2">
            <div className="h-3 w-24 bg-[var(--surface-raised)] rounded" />
            <div className="h-9 w-64 bg-[var(--surface-raised)] rounded-xl" />
            <div className="h-4 w-full max-w-prose bg-[var(--surface-raised)] rounded" />
            <div className="h-4 w-3/4 max-w-prose bg-[var(--surface-raised)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CastPage() {
  const { slug = '' }            = useParams<{ slug: string }>();
  const navigate                 = useNavigate();
  const { entity, items, loading, error } = useEntity(slug);
  const [bioExpanded, setBioExpanded] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <div className="pt-14 md:pt-0 md:pl-64">
          <CastSkeleton />
        </div>
      </div>
    );
  }

  if (!entity && !loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-14 md:pt-0 md:pl-64">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[var(--surface-raised)]">
            <i className="ri-user-unfollow-line text-3xl text-[var(--text-tertiary)]" />
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">Persona no encontrada</p>
          {error && <p className="text-sm text-[var(--state-danger)] max-w-xs text-center">{error}</p>}
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/catalog'))}
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] underline cursor-pointer"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  if (!entity) return null;

  const typeLabel = TYPE_LABELS[entity.type] ?? entity.type;
  const typeIcon  = TYPE_ICONS[entity.type] ?? 'ri-user-line';
  const bio       = entity.bio ?? '';
  const bioShort  = bio.length > 400 && !bioExpanded;

  const initials = entity.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SeoHead
        title={`${entity.name} — ${typeLabel} | Vaultly`}
        description={bio ? bio.slice(0, 155) : `Ficha de ${entity.name} en Vaultly.`}
        canonical={`/cast/${slug}`}
        ogImage={entity.image_url ?? undefined}
      />
      <Sidebar />

      <div className="pt-14 md:pt-0 md:pl-64">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">

          {/* Navegación */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-6">
            <button
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/catalog'))}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xs" />
              Volver
            </button>
          </div>

          {/* Hero */}
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-10">

            {/* Foto */}
            <div className="flex-shrink-0">
              <div className="w-36 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)]"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
              >
                {entity.image_url ? (
                  <img
                    src={entity.image_url}
                    alt={entity.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--surface-raised)]">
                    <span className="text-3xl font-black text-[var(--text-tertiary)]">{initials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] mb-3">
                <i className={typeIcon} />
                {typeLabel}
              </div>

              <h1
                className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-4 leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {entity.name}
              </h1>

              {bio && (
                <div className="max-w-prose">
                  <p className={`text-sm text-[var(--text-secondary)] leading-relaxed ${bioShort ? 'line-clamp-4' : ''}`}>
                    {bio}
                  </p>
                  {bio.length > 400 && (
                    <button
                      onClick={() => setBioExpanded(v => !v)}
                      className="mt-2 text-xs font-semibold text-[var(--brand-accent)] hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {bioExpanded ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-5 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    {items.length} {items.length === 1 ? 'obra' : 'obras'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Obras relacionadas */}
          {items.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5">
                Obras relacionadas
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {items.map(catalogItem => (
                  <Link
                    key={catalogItem.id}
                    to={`/catalog/${catalogItem.category}/${catalogItem.slug}`}
                    className="group flex flex-col gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)]">
                      {catalogItem.image_url ? (
                        <img
                          src={catalogItem.image_url}
                          alt={catalogItem.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="ri-image-line text-2xl text-[var(--text-tertiary)]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight">
                        {catalogItem.title}
                      </p>
                      {catalogItem.role && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5 italic line-clamp-1">
                          {catalogItem.role}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
