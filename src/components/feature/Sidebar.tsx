/**
 * Sidebar.tsx — barra de navegación vertical principal de Vaultly.
 *
 * Barra lateral compacta (estilo Linear/GitHub): logotipo en la parte superior,
 * destinos principales como una lista plana de icono + etiqueta con un único
 * estado activo en azul, categorías como un grupo anidado ligero y controles
 * de cuenta/tema fijados en la parte inferior.
 *
 * En pantallas pequeñas se transforma en una barra superior compacta con un
 * panel lateral deslizante, manteniendo el mismo contenido y evitando tener
 * que gestionar una navegación móvil independiente.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react';

// ─── Librerías externas ───────────────────────────────────────────────────────

import { Link, useLocation, useNavigate } from 'react-router-dom';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';
import { useCategories } from '@/hooks/useCategoryColors';
import { useAdminReports } from '@/hooks/useAdminReports';

// ─── Componentes ─────────────────────────────────────────────────────────────

import { LogoMark } from '@/components/branding/Logo';
import NotificationBell from '@/components/feature/NotificationBell';

function AdminPendingBadge() {
  const { pendingCount } = useAdminReports();
  if (pendingCount <= 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
      {pendingCount > 99 ? '99+' : pendingCount}
    </span>
  );
}

export default function Sidebar() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const { isLoggedIn, profile, logout } = useAuth();
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const CATEGORIES = useCategories();
  const location = useLocation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [catalogExpanded, setCatalogExpanded] = useState(false);
  const [trackerExpanded, setTrackerExpanded] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // ─── Datos derivados ──────────────────────────────────────────────────────────

  const isAdmin = profile?.role === 'admin';

  const activeCategories = useMemo(
    () => CATEGORIES.filter(cat => settings.activeCategories.includes(cat.id)),
    [CATEGORIES, settings.activeCategories],
  );

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ─── Utilidades de clases ─────────────────────────────────────────────────────

  const isActive = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const navLinkClass = (active: boolean) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]'
        : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
    }`;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 pb-2 pt-5">
        <div className="flex items-center">
          <LogoMark size={128} />
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {isAdmin ? (
          /* ── Nav de administración ── */
          <div className="flex flex-col gap-0.5">
            <p className="mb-1 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
              Administración
            </p>
            <Link
              to="/admin"
              className={navLinkClass(location.pathname === '/admin' || location.pathname.startsWith('/admin/reports'))}
            >
              <i className="ri-flag-2-line text-base"></i>
              Reportes
              <AdminPendingBadge />
            </Link>
            <Link to="/admin/catalog" className={navLinkClass(isActive('/admin/catalog'))}>
              <i className="ri-database-2-line text-base"></i>
              Catálogo
            </Link>
            <Link to="/admin/overview" className={navLinkClass(isActive('/admin/overview'))}>
              <i className="ri-dashboard-3-line text-base"></i>
              Resumen
            </Link>

            <div className="my-1.5 border-t border-[var(--border)]" />

            {/* Acceso al catálogo público para revisión */}
            <div>
              <div className={`flex items-center rounded-lg ${isActive('/catalog') && !isActive('/admin') ? 'bg-[var(--sidebar-active-bg)]' : ''}`}>
                <Link
                  to="/catalog"
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/catalog') && !isActive('/admin')
                      ? 'text-[var(--sidebar-active-text)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <i className="ri-grid-line text-base"></i>
                  Catálogo público
                </Link>
                <button
                  onClick={() => setCatalogExpanded(v => !v)}
                  aria-label={catalogExpanded ? 'Contraer categorías' : 'Expandir categorías'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--sidebar-hover)]"
                >
                  <i className={`ri-arrow-down-s-line text-sm transition-transform ${catalogExpanded ? 'rotate-180' : ''}`}></i>
                </button>
              </div>
              {catalogExpanded && (
                <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-[var(--border)] pl-3">
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/catalog/${cat.id}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]"
                    >
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: cat.accent }}></span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Nav de usuario normal ── */
          <div className="flex flex-col gap-0.5">
            {isLoggedIn && (
              <Link to="/dashboard" className={navLinkClass(isActive('/dashboard'))}>
                <i className="ri-dashboard-line text-base"></i>
                Dashboard
              </Link>
            )}

            {/* Catálogo — enlace plano + lista de categorías ampliable */}
            <div>
              <div className={`flex items-center rounded-lg ${isActive('/catalog') ? 'bg-[var(--sidebar-active-bg)]' : ''}`}>
                <Link
                  to="/catalog"
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/catalog')
                      ? 'text-[var(--sidebar-active-text)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <i className="ri-grid-line text-base"></i>
                  Catálogo
                </Link>
                <button
                  onClick={() => setCatalogExpanded(v => !v)}
                  aria-label={catalogExpanded ? 'Contraer categorías de catálogo' : 'Expandir categorías de catálogo'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--sidebar-hover)]"
                >
                  <i className={`ri-arrow-down-s-line text-sm transition-transform ${catalogExpanded ? 'rotate-180' : ''}`}></i>
                </button>
              </div>
              {catalogExpanded && (
                <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-[var(--border)] pl-3">
                  {(isLoggedIn ? activeCategories : CATEGORIES).map(cat => (
                    <Link
                      key={cat.id}
                      to={`/catalog/${cat.id}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]"
                    >
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: cat.accent }}></span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tracker — solo para usuarios registrados */}
            {isLoggedIn && (
              <div>
                <div className={`flex items-center rounded-lg ${isActive('/tracker') ? 'bg-[var(--sidebar-active-bg)]' : ''}`}>
                  <Link
                    to="/tracker"
                    className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive('/tracker')
                        ? 'text-[var(--sidebar-active-text)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <i className="ri-bookmark-line text-base"></i>
                    Tu Tracker
                  </Link>
                  <button
                    onClick={() => setTrackerExpanded(v => !v)}
                    aria-label={trackerExpanded ? 'Contraer categorías de tracker' : 'Expandir categorías de tracker'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--sidebar-hover)]"
                  >
                    <i className={`ri-arrow-down-s-line text-sm transition-transform ${trackerExpanded ? 'rotate-180' : ''}`}></i>
                  </button>
                </div>
                {trackerExpanded && (
                  <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-[var(--border)] pl-3">
                    {activeCategories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/tracker/${cat.id}`}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: cat.accent }}></span>
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isLoggedIn && (
              <Link to="/profile" className={navLinkClass(isActive('/profile'))}>
                <i className="ri-user-line text-base"></i>
                Perfil
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Bottom: tema, configuración, cuenta */}
      <div className="flex flex-col gap-0.5 border-t border-[var(--border)] px-3 py-3">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]"
        >
          <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          <i className={`${theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} text-base`} />
        </button>

        {isLoggedIn && <Link to="/settings" className={navLinkClass(isActive('/settings'))}>
          <i className="ri-settings-3-line text-base"></i>
          Configuración
        </Link>}

        {isLoggedIn ? (
          <div ref={accountRef} className="relative mt-1">
            <div className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--sidebar-hover)]">
              <button
                onClick={() => setAccountOpen(v => !v)}
                aria-expanded={accountOpen}
                aria-haspopup="true"
                aria-label="Menú de cuenta"
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover object-top" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-brand text-xs font-semibold text-white dark:bg-brand-dark">
                      {profile?.initials ?? 'NP'}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[var(--text-primary)]">{profile?.display_name ?? 'Usuario'}</span>
                  <span className="block truncate text-xs text-[var(--text-tertiary)]">{profile?.email}</span>
                </span>
              </button>
              {!isAdmin && <NotificationBell />}
            </div>

            {accountOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-lg">
                {!isAdmin && (
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
                    <i className="ri-user-line w-4 text-center"></i> Perfil / Cuenta
                  </Link>
                )}
                <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
                  <i className="ri-settings-3-line w-4 text-center"></i> Configuración
                </Link>
                <div className="border-t border-[var(--border)]">
                  <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--state-danger)] transition-colors hover:bg-[var(--surface-sunken)]">
                    <i className="ri-logout-box-line w-4 text-center"></i> Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover dark:bg-brand-dark dark:hover:bg-brand-dark-hover"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — cokumna izquierda fija */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] md:flex">
        {SidebarContent()}
      </aside>

      {/* Móvil top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center">
          <LogoMark size={40} />
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menú"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)]"
        >
          <i className="ri-menu-line text-lg"></i>
        </button>
      </header>

      {/* Móvil drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-[var(--surface-overlay)]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] shadow-lg">
            <div className="flex items-center justify-between px-4 pt-4">
              <LogoMark size={56} />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)]"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            {SidebarContent()}
          </aside>
        </div>
      )}
    </>
  );
}
