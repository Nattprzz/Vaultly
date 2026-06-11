import { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/components/feature/SeoHead';
import AdminSidebar from './components/AdminSidebar';
import AdminOverview from './components/AdminOverview';
import AdminUsers from './components/AdminUsers';
import AdminCatalog from './components/AdminCatalog';
import AdminReviews from './components/AdminReviews';
import AdminEntities from './components/AdminEntities';
import AdminAuditLogs from './components/AdminAuditLogs';
import AdminReports from './components/AdminReports';
import AdminSettings from './components/AdminSettings';
import { useAdminReports } from '@/hooks/useAdminReports';

type AdminSection = 'overview' | 'users' | 'catalog' | 'reviews' | 'entities' | 'audit' | 'reports' | 'settings';

const SECTION_TITLES: Record<AdminSection, { title: string; subtitle: string; icon: string }> = {
  overview:  { title: 'Resumen general',       subtitle: 'KPIs, actividad y estado del sistema.',          icon: 'ri-dashboard-3-line' },
  users:     { title: 'Gestión de usuarios',   subtitle: 'Administra cuentas, roles y accesos.',           icon: 'ri-group-line' },
  catalog:   { title: 'Catálogo',              subtitle: 'Gestiona los ítems del catálogo de Vaultly.',    icon: 'ri-database-2-line' },
  entities:  { title: 'Entidades',             subtitle: 'Crea y edita desarrolladores, actores, autores y más.', icon: 'ri-user-star-line' },
  reviews:   { title: 'Moderación de reseñas', subtitle: 'Aprueba, rechaza o elimina reseñas.',            icon: 'ri-quill-pen-line' },
  reports:   { title: 'Reportes de usuarios',  subtitle: 'Revisa y gestiona los problemas reportados en el catálogo.', icon: 'ri-flag-2-line' },
  audit:     { title: 'Auditoría',             subtitle: 'Historial de acciones administrativas del sistema.', icon: 'ri-shield-check-line' },
  settings:  { title: 'Configuración',         subtitle: 'Estado de APIs, integraciones y ajustes del sistema.', icon: 'ri-settings-3-line' },
};

function getSectionFromPath(path: string): AdminSection {
  if (path.includes('/users'))    return 'users';
  if (path.includes('/catalog'))  return 'catalog';
  if (path.includes('/entities')) return 'entities';
  if (path.includes('/reviews'))  return 'reviews';
  if (path.includes('/reports'))  return 'reports';
  if (path.includes('/audit'))    return 'audit';
  if (path.includes('/settings')) return 'settings';
  return 'overview';
}

export default function AdminPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pendingCount, newCount, markAllSeen } = useAdminReports();

  const path = window.location.pathname;
  const section = getSectionFromPath(path);
  const { title, subtitle, icon } = SECTION_TITLES[section];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <SeoHead
        title="Admin — Vaultly"
        description="Panel de administración de Vaultly."
        canonical="/admin"
        noIndex
      />
      {/* Sidebar — desktop */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative z-10">
            <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <i className="ri-menu-line text-lg"></i>
            </button>
            <div className="flex items-center gap-2">
              <i className={`${icon} text-zinc-400 text-lg`}></i>
              <div>
                <h1 className="text-base font-bold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {title}
                </h1>
                <p className="text-xs text-zinc-500 hidden sm:block">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Reports alert badge */}
            {newCount > 0 && section !== 'reports' && (
              <Link
                to="/admin/reports"
                onClick={markAllSeen}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-flag-2-line"></i>
                {newCount} reporte{newCount > 1 ? 's' : ''} nuevo{newCount > 1 ? 's' : ''}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500"></span>
              </Link>
            )}
            {/* Reviews alert badge */}
            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand/15">
              <div className="w-5 h-5 rounded-full bg-brand dark:bg-brand-dark flex items-center justify-center text-white text-xs font-bold">
                N
              </div>
              <span className="text-xs font-semibold text-brand dark:text-brand-dark hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-8 overflow-auto">
          {section === 'overview'  && <AdminOverview />}
          {section === 'users'     && <AdminUsers />}
          {section === 'catalog'   && <AdminCatalog />}
          {section === 'entities'  && <AdminEntities />}
          {section === 'reviews'   && <AdminReviews />}
          {section === 'reports'   && <AdminReports />}
          {section === 'audit'     && <AdminAuditLogs />}
          {section === 'settings'  && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
