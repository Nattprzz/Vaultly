/**
 * ProfileHero.tsx — sección hero del perfil privado del usuario.
 *
 * Muestra el banner de fondo con gradiente, avatar (foto o iniciales),
 * nombre de usuario, bio y fila de estadísticas rápidas. Incluye botones
 * para ver el perfil público, copiar el enlace y abrir el ShareModal.
 * Solo visible en la vista propia del usuario autenticado (isOwn=true).
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth }    from '@/hooks/useAuth';
import { useTracker } from '@/hooks/useTracker';

// ─── Componentes ──────────────────────────────────────────────────────────────

import ShareModal from './ShareModal';
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Formatea una fecha ISO en "mes año" en español.
 * @param isoDate - Cadena de fecha ISO.
 * @returns Cadena legible como "enero 2024", o cadena vacía si es inválida.
 */
function formatMemberSince(isoDate: string | undefined): string {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

// ─── Tipos de módulo ─────────────────────────────────────────────────────────

/** Props del hero de perfil. */
interface Props {
  /** true si la vista corresponde al usuario autenticado. */
  isOwn: boolean;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ProfileHero({ isOwn }: Props) {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const { profile, user } = useAuth();
  const { entries }       = useTracker();
  const [shareOpen,    setShareOpen]    = useState(false);
  const [avatarError,  setAvatarError]  = useState(false);
  const [bioExpanded,  setBioExpanded]  = useState(false);

  // ─── Efectos ──────────────────────────────────────────────────────────────

  useEffect(() => { setAvatarError(false); }, [profile?.avatar_url]);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const all       = Object.values(entries);
  const completed = all.filter(e => e.status === 'completed').length;
  const rated     = all.filter(e => e.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—';
  const reviews = all.filter(e => e.review && e.review.trim().length > 0).length;

  const profileUsername = profile?.username ?? profile?.email?.split('@')[0] ?? 'usuario';
  const profileUrl      = `${window.location.origin}/u/${profileUsername}`;
  const initials        = profile?.initials ?? (profile?.display_name?.slice(0, 2).toUpperCase() ?? '??');

  // ─── Handlers ─────────────────────────────────────────────────────────────

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <>
      {/* Banner: imagen de portada personalizada o gradiente por defecto */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl mb-0">
        {profile?.backdrop_url ? (
          <img
            src={profile.backdrop_url}
            alt="Portada de perfil"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_10%_50%,rgba(59,130,246,0.12),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_30%,rgba(139,92,246,0.09),transparent)]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent" />
        {isOwn && (
          <Link
            to="/settings"
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/60 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-edit-line"></i>
            Editar perfil
          </Link>
        )}
      </div>

      {/* Información del perfil superpuesta al banner */}
      <div className="px-4 md:px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            {/* Avatar: foto o iniciales */}
            {profile?.avatar_url && !avatarError ? (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-950 flex-shrink-0">
                <img
                  src={profile.avatar_url}
                  alt={profile?.display_name ?? profileUsername}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-brand dark:bg-brand-dark flex items-center justify-center text-white text-3xl font-black border-4 border-white dark:border-zinc-950 flex-shrink-0">
                {initials}
              </div>
            )}
            {/* Nombre, username y bio */}
            <div className="pb-1">
              <div className="flex items-center gap-2 mb-1">
                <h1
                  className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {profile?.display_name ?? profileUsername}
                </h1>
                {profile?.is_public && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <i className="ri-global-line text-xs"></i>
                    Público
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">@{profileUsername}</p>
              {profile?.bio && (() => {
                const words = profile.bio.split(/\s+/);
                const needsTruncation = words.length > 50;
                const displayText = needsTruncation && !bioExpanded
                  ? words.slice(0, 50).join(' ') + '…'
                  : profile.bio;
                return (
                  <div className="mt-2 max-w-md">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{displayText}</p>
                    {needsTruncation && (
                      <button
                        onClick={() => setBioExpanded(v => !v)}
                        className="text-xs font-medium text-brand dark:text-brand-dark hover:underline mt-0.5 cursor-pointer"
                      >
                        {bioExpanded ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Acciones del perfil */}
          <div className="flex items-center gap-2 pb-1">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-eye-line"></i>
              Ver perfil público
            </a>
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              <i className="ri-share-forward-line"></i>
              Compartir
            </button>
          </div>
        </div>

        {/* Fila de estadísticas rápidas */}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          {[
            { label: 'En tracker',       value: all.length, icon: 'ri-stack-line',            color: 'text-brand dark:text-brand-dark' },
            { label: 'Completados',      value: completed,  icon: 'ri-checkbox-circle-line',  color: 'text-emerald-500'               },
            { label: 'Puntuación media', value: avgRating,  icon: 'ri-star-line',              color: 'text-amber-500'                 },
            { label: 'Reseñas',          value: reviews,    icon: 'ri-quill-pen-line',         color: 'text-brand dark:text-brand-dark'},
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <i className={`${stat.icon} ${stat.color} text-lg`}></i>
              <div>
                <span className="text-lg font-black text-zinc-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5">{stat.label}</span>
              </div>
            </div>
          ))}
          {user?.created_at && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-zinc-400">Miembro desde</span>
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {formatMemberSince(user.created_at)}
              </span>
            </div>
          )}
        </div>
      </div>

      {shareOpen && (
        <ShareModal
          username={profileUsername}
          displayName={profile?.display_name ?? profileUsername}
          profileUrl={profileUrl}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
