/**
 * Navbar.tsx — barra de navegación superior de Vaultly.
 *
 * Navegación fija con fondo transparente en la home que se vuelve sólido al
 * hacer scroll o en cualquier otra ruta. Incluye menús desplegables de Catálogo
 * y Tracker (por categoría), alternador de tema, campana de notificaciones y
 * menú de perfil con opción de admin condicional. En móvil se colapsa en un
 * panel vertical que se abre con el botón hamburguesa.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link, useLocation, useNavigate } from 'react-router-dom';

// ─── Componentes ─────────────────────────────────────────────────────────────

import NotificationBell from '@/components/feature/NotificationBell';
import Logo from '@/components/branding/Logo';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';
import { useCategories } from '@/hooks/useCategoryColors';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const { isLoggedIn, profile, logout } = useAuth();
  const { settings }                    = useSettings();
  const { theme, toggleTheme }          = useTheme();
  const CATEGORIES                      = useCategories();
  const location                        = useLocation();
  const navigate                        = useNavigate();

  // ─── Estado ───────────────────────────────────────────────────────────────

  const [scrolled,     setScrolled]     = useState(false);
  const [catalogOpen,  setCatalogOpen]  = useState(false);
  const [trackerOpen,  setTrackerOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const activeCategories = useMemo(
    () => CATEGORIES.filter(cat => settings.activeCategories.includes(cat.id)),
    [CATEGORIES, settings.activeCategories],
  );

  /** El fondo se vuelve sólido al hacer scroll o fuera de la home. */
  const solid = scrolled || location.pathname !== '/';

  // ─── Efectos ──────────────────────────────────────────────────────────────

  /** Detecta el scroll para activar el fondo sólido. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Cierra todos los menús desplegables al hacer clic fuera de ellos. */
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!catalogRef.current?.contains(target)) setCatalogOpen(false);
      if (!trackerRef.current?.contains(target)) setTrackerOpen(false);
      if (!profileRef.current?.contains(target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  /** Cierra todos los menús al navegar a una nueva ruta. */
  useEffect(() => {
    setCatalogOpen(false);
    setTrackerOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /** Cierra la sesión y redirige al inicio. */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ─── Sub-componentes ──────────────────────────────────────────────────────

  /** Props del menú desplegable de categorías. */
  interface CategoryMenuProps {
    /** `'catalog'` muestra todas las categorías; `'tracker'` solo las activas del usuario. */
    mode: 'catalog' | 'tracker';
  }

  /**
   * Menú desplegable con las categorías disponibles para Catálogo o Tracker.
   *
   * @param mode - Modo de navegación: catálogo o tracker.
   */
  const CategoryMenu = ({ mode }: CategoryMenuProps) => {
    const items    = mode === 'catalog' ? (isLoggedIn ? activeCategories : CATEGORIES) : activeCategories;
    const basePath = mode === 'catalog' ? '/catalog' : '/tracker';

    return (
      <div className="absolute top-full left-0 mt-2 w-64 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]">
        {items.map(cat => (
          <Link
            key={cat.id}
            to={`${basePath}/${cat.id}`}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${cat.accent}20` }}>
              <i className={`${cat.icon} text-sm`} style={{ color: cat.accent }}></i>
            </span>
            <span>
              <span className="block font-medium">{cat.label}</span>
              <span className="block text-xs text-[var(--text-tertiary)]">{mode === 'catalog' ? 'Explorar catálogo' : 'Abrir tracker'}</span>
            </span>
          </Link>
        ))}
      </div>
    );
  };

  // ─── Renderizado ──────────────────────────────────────────────────────────

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'border-b border-[var(--border)] bg-[var(--surface)]/95 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <Logo size={28} />
        </Link>

        {/* Navegación de escritorio */}
        <div className="hidden items-center gap-1 md:flex">
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]'}`}
            >
              Dashboard General
            </Link>
          )}

          {isLoggedIn && (
            <div ref={trackerRef} className="relative">
              <button
                onClick={() => { setTrackerOpen(v => !v); setCatalogOpen(false); setProfileOpen(false); }}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith('/tracker') ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]'}`}
              >
                Tu Tracker
                <i className={`ri-arrow-down-s-line transition-transform ${trackerOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {trackerOpen && <CategoryMenu mode="tracker" />}
            </div>
          )}

          <div ref={catalogRef} className="relative">
            <button
              onClick={() => { setCatalogOpen(v => !v); setTrackerOpen(false); setProfileOpen(false); }}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith('/catalog') ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]'}`}
            >
              Catálogo
              <i className={`ri-arrow-down-s-line transition-transform ${catalogOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {catalogOpen && <CategoryMenu mode="catalog" />}
          </div>
        </div>

        {/* Acciones de escritorio: tema, ajustes, notificaciones, perfil */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
            <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
            <AnimatedThemeToggler
              theme={theme === 'dark' ? 'dark' : 'light'}
              onThemeChange={(newTheme) => { if (newTheme !== theme) toggleTheme(); }}
              variant="circle"
              duration={500}
              className="flex size-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] [&_svg]:size-4"
            />
          </div>

          {isLoggedIn && (
            <Link
              to="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"
              aria-label="Configuración"
            >
              <i className="ri-settings-3-line"></i>
            </Link>
          )}

          {isLoggedIn && <NotificationBell />}

          {isLoggedIn ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setProfileOpen(v => !v); setCatalogOpen(false); setTrackerOpen(false); }}
                className="h-9 w-9 overflow-hidden rounded-full"
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand text-sm font-bold text-white dark:bg-brand-dark">
                    {profile?.initials ?? 'NP'}
                  </div>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]">
                  <div className="border-b border-[var(--border)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{profile?.display_name ?? 'Usuario'}</p>
                    <p className="truncate text-xs text-[var(--text-tertiary)]">{profile?.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
                    <i className="ri-user-line w-4 text-center"></i> Perfil / Cuenta
                  </Link>
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
                    <i className="ri-settings-3-line w-4 text-center"></i> Configuración
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link to="/admin/catalog" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
                      <i className="ri-shield-user-line w-4 text-center"></i> Admin
                    </Link>
                  )}
                  <div className="border-t border-[var(--border)]">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <i className="ri-logout-box-line w-4 text-center"></i> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover dark:bg-brand-dark dark:hover:bg-brand-dark-hover"
            >
              Iniciar sesión / Entrar
            </Link>
          )}
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] md:hidden"
          aria-label="Abrir menu"
        >
          <i className={mobileOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'}></i>
        </button>
      </div>

      {/* Panel de navegación móvil */}
      {mobileOpen && (
        <div className="flex flex-col gap-2 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:hidden">
          {isLoggedIn && (
            <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
              <i className="ri-dashboard-line"></i> Dashboard General
            </Link>
          )}
          {isLoggedIn && activeCategories.map(cat => (
            <Link key={cat.id} to={`/tracker/${cat.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
              <i className={cat.icon}></i> Tracker: {cat.label}
            </Link>
          ))}
          {(isLoggedIn ? activeCategories : CATEGORIES).map(cat => (
            <Link key={cat.id} to={`/catalog/${cat.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
              <i className={cat.icon}></i> Catálogo: {cat.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
              <i className="ri-settings-3-line"></i> Configuración
            </Link>
          )}
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-2">
            <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
              <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
              <AnimatedThemeToggler
                theme={theme === 'dark' ? 'dark' : 'light'}
                onThemeChange={(newTheme) => { if (newTheme !== theme) toggleTheme(); }}
                variant="circle"
                duration={500}
                className="flex size-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] [&_svg]:size-4"
              />
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 dark:border-red-900 dark:text-red-400"
              >
                Salir
              </button>
            ) : (
              <Link to="/auth" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white dark:bg-brand-dark">
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
