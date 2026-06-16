/**
 * ItemMyTracking.tsx — sección "Mi seguimiento" en la ficha de detalle.
 *
 * Muestra los datos de seguimiento personal del usuario para el ítem actual:
 * estado, puntuación, reseña, fechas y campos específicos por categoría.
 * Abre AddToTrackerModal para editar o crear la entrada.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth }    from '@/hooks/useAuth';
import { useTracker } from '@/hooks/useTracker';

// ─── Constantes ──────────────────────────────────────────────────────────────

import { getStatusInfo } from '@/constants/tracker-statuses';

// ─── Tipos ───────────────────────────────────────────────────────────────────

import type { ItemDetail }              from '@/types/itemDetail';
import type { TrackerStatus, GameData } from '@/hooks/useTracker';
import type { CategoryStatus }          from '@/constants/tracker-statuses';

// ─── Componentes ──────────────────────────────────────────────────────────────

import AddToTrackerModal from './AddToTrackerModal';

// ─── Helpers ─────────────────────────────────────────────────────────────────

import { fmtDate } from '@/lib/formatting';

// ─── Sub-componente ──────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
      <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider flex items-center gap-1.5">
        <i className={icon} />
        {label}
      </p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ItemMyTracking({ item }: { item: ItemDetail }) {
  const { isLoggedIn }                    = useAuth();
  const { getEntry, addOrUpdate, remove } = useTracker();
  const [modalOpen, setModalOpen]         = useState(false);

  const handleSave = async (
    status: TrackerStatus,
    rating: number | null,
    review: string,
    gameData?: GameData,
  ): Promise<boolean> => addOrUpdate(item.id, item.category, status, rating, review, gameData);

  const handleRemove = async (): Promise<boolean> => remove(item.id);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--surface-raised)] flex items-center justify-center">
          <i className="ri-user-line text-2xl text-[var(--text-tertiary)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
            Inicia sesión para llevar tu seguimiento
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            Registra lo que has jugado, visto o leído
          </p>
        </div>
        <Link
          to="/auth"
          className="px-5 py-2.5 rounded-xl bg-[var(--brand-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const entry     = getEntry(item.id);
  const isGame    = item.category === 'videojuegos';
  const isSeries  = item.category === 'series';
  const isBook    = item.category === 'libros';

  if (!entry) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--surface-raised)] flex items-center justify-center">
          <i className="ri-add-circle-line text-2xl text-[var(--text-tertiary)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Sin seguimiento</p>
          <p className="text-xs text-[var(--text-tertiary)]">Añade este ítem para registrar tu progreso</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--brand-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <i className="ri-add-line" />
          Añadir al tracker
        </button>

        {modalOpen && (
          <AddToTrackerModal
            itemId={item.id}
            category={item.category}
            title={item.title}
            cover={item.cover}
            existing={null}
            onSave={handleSave}
            onRemove={handleRemove}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    );
  }

  const statusInfo = getStatusInfo(entry.status as CategoryStatus, item.category);

  const achievementsTotal    = item.achievements_count ?? 0;
  const achievementsUnlocked = entry.achievementsUnlocked ?? 0;
  const achievementsPct      = achievementsTotal > 0
    ? Math.round((achievementsUnlocked / achievementsTotal) * 100)
    : 0;

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Mi seguimiento</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors cursor-pointer"
        >
          <i className="ri-edit-line text-sm" />
          Editar seguimiento
        </button>
      </div>

      {/* Estado */}
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-2xl mb-5"
        style={{ background: statusInfo.bg }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${statusInfo.color}25` }}
        >
          <i className={`${statusInfo.icon} text-xl`} style={{ color: statusInfo.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: statusInfo.color }}>{statusInfo.label}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Añadido el {fmtDate(entry.addedAt)}
          </p>
        </div>
        {entry.rating != null && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <i className="ri-star-fill text-amber-400 text-sm" />
            <span className="text-sm font-bold text-[var(--text-primary)]">{entry.rating}</span>
            <span className="text-xs text-[var(--text-tertiary)]">/10</span>
          </div>
        )}
      </div>

      {/* Puntuación detallada */}
      {entry.rating != null && (
        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] mb-3">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Mi puntuación</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-amber-400">{entry.rating}</span>
            <span className="text-[var(--text-tertiary)] text-sm">/10</span>
            <div className="flex items-center gap-0.5 ml-2">
              {Array.from({ length: 10 }, (_, i) => (
                <i
                  key={i}
                  className={`text-xs ${i < entry.rating! ? 'ri-star-fill text-amber-400' : 'ri-star-line text-[var(--border-strong)]'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {isGame && entry.playingPlatform && (
          <StatCard icon="ri-gamepad-line" label="Plataforma" value={entry.playingPlatform} />
        )}
        {isGame && entry.hoursPlayed != null && (
          <StatCard icon="ri-timer-line" label="Horas jugadas" value={`${entry.hoursPlayed}h`} />
        )}
        {isGame && entry.startedAt && (
          <StatCard icon="ri-play-circle-line" label="Inicio" value={fmtDate(entry.startedAt)} />
        )}
        {isGame && entry.finishedAt && (
          <StatCard icon="ri-flag-line" label="Finalización" value={fmtDate(entry.finishedAt)} />
        )}
        {isSeries && entry.metadata?.current_season != null && (
          <StatCard icon="ri-archive-line" label="Temporada" value={`T${entry.metadata.current_season}`} />
        )}
        {isSeries && entry.metadata?.current_episode != null && (
          <StatCard icon="ri-film-line" label="Episodio" value={`E${entry.metadata.current_episode}`} />
        )}
        {isBook && entry.metadata?.current_page != null && (
          <StatCard
            icon="ri-book-open-line"
            label="Página actual"
            value={item.pages ? `${entry.metadata.current_page} / ${item.pages}` : String(entry.metadata.current_page)}
          />
        )}
      </div>

      {/* Barra de logros (solo videojuegos con achievements_count) */}
      {isGame && achievementsTotal > 0 && (
        <div className="mb-3 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider flex items-center gap-1.5">
              <i className="ri-trophy-line" />
              Logros
            </p>
            <span className="text-xs font-bold text-[var(--text-secondary)]">
              {achievementsUnlocked} / {achievementsTotal}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--surface)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${achievementsPct}%`, background: 'var(--brand-accent)' }}
            />
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">{achievementsPct}% completado</p>
        </div>
      )}

      {/* Reseña */}
      {entry.review && (
        <div className="mb-3 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i className="ri-edit-2-line" />
            Mi reseña
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
            "{entry.review}"
          </p>
        </div>
      )}

      {modalOpen && (
        <AddToTrackerModal
          itemId={item.id}
          category={item.category}
          title={item.title}
          cover={item.cover}
          existing={entry}
          onSave={handleSave}
          onRemove={handleRemove}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
