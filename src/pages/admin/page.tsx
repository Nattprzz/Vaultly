/**
 * admin/page.tsx — panel de administración de Vaultly.
 *
 * Renderiza la interfaz de administración con las ocho secciones disponibles:
 * resumen, usuarios, catálogo, entidades, reseñas, reportes, auditoría y
 * configuración. La sección activa se deriva de la ruta actual vía useLocation.
 * Reutiliza el Sidebar principal de Vaultly — no existe sidebar independiente.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { useLocation } from 'react-router-dom';

// ─── Componentes ──────────────────────────────────────────────────────────────

import SeoHead from '@/components/feature/SeoHead';
import Sidebar from '@/components/feature/Sidebar';
import AdminOverview from './components/AdminOverview';
import AdminUsers from './components/AdminUsers';
import AdminCatalog from './components/AdminCatalog';
import AdminReviews from './components/AdminReviews';
import AdminEntities from './components/AdminEntities';
import AdminAuditLogs from './components/AdminAuditLogs';
import AdminReports from './components/AdminReports';
import AdminSettings from './components/AdminSettings';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type AdminSection = 'overview' | 'users' | 'catalog' | 'reviews' | 'entities' | 'audit' | 'reports' | 'settings';

// ─── Utilidades ───────────────────────────────────────────────────────────────

function getSectionFromPath(path: string): AdminSection {
  if (path.includes('/users'))    return 'users';
  if (path.includes('/catalog'))  return 'catalog';
  if (path.includes('/entities')) return 'entities';
  if (path.includes('/reviews'))  return 'reviews';
  if (path.includes('/audit'))    return 'audit';
  if (path.includes('/settings')) return 'settings';
  if (path.includes('/overview')) return 'overview';
  return 'reports';
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { pathname } = useLocation();
  const section = getSectionFromPath(pathname);

  return (
    <>
      <SeoHead
        title="Admin — Vaultly"
        description="Panel de administración de Vaultly."
        canonical="/admin"
        noIndex
      />
      <Sidebar />
      <main className="min-h-screen bg-[var(--bg)] pt-14 md:pt-0 md:pl-64">
        <div className="px-4 md:px-8 py-8">
          {section === 'overview'  && <AdminOverview />}
          {section === 'users'     && <AdminUsers />}
          {section === 'catalog'   && <AdminCatalog />}
          {section === 'entities'  && <AdminEntities />}
          {section === 'reviews'   && <AdminReviews />}
          {section === 'reports'   && <AdminReports />}
          {section === 'audit'     && <AdminAuditLogs />}
          {section === 'settings'  && <AdminSettings />}
        </div>
      </main>
    </>
  );
}
