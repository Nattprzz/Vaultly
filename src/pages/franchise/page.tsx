/**
 * franchise/page.tsx — página de franquicia / saga.
 *
 * Muestra los juegos o ítems que pertenecen a una franquicia del catálogo.
 * El slug se extrae de la URL y se usa para filtrar ítems del catálogo
 * cuya metadata contiene ese nombre de franquicia.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { useNavigate, useParams } from 'react-router-dom';

// ─── Componentes ──────────────────────────────────────────────────────────────

import Sidebar from '@/components/feature/Sidebar';
import SeoHead from '@/components/feature/SeoHead';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function FranchisePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate      = useNavigate();
  const title         = slugToTitle(slug);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SeoHead
        title={`${title} — Franquicia | Vaultly`}
        description={`Explora todos los títulos de la franquicia ${title} en Vaultly.`}
        canonical={`/franchise/${slug}`}
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

          {/* Cabecera */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <i className="ri-stack-line text-2xl text-[var(--text-tertiary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Franquicia</p>
              <h1
                className="text-3xl font-black text-[var(--text-primary)] leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {title}
              </h1>
            </div>
          </div>

          {/* Contenido próximamente */}
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-raised)] flex items-center justify-center">
              <i className="ri-tools-line text-2xl text-[var(--text-tertiary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                Sección en desarrollo
              </p>
              <p className="text-xs text-[var(--text-tertiary)] max-w-xs">
                Próximamente podrás explorar todos los títulos de la franquicia <strong className="text-[var(--text-secondary)]">{title}</strong> desde aquí.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
