import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';
import { useCategories } from '@/hooks/useCategoryColors';
import NotificationBell from '@/components/feature/NotificationBell';
import Logo from '@/components/brand/Logo';

export default function Navbar() {
  const { isLoggedIn, profile, logout } = useAuth();
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const CATEGORIES = useCategories();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const activeCategories = useMemo(
    () => CATEGORIES.filter(cat => settings.activeCategories.includes(cat.id)),
    [settings.activeCategories],
  );

  const solid = scrolled || location.pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  useEffect(() => {
    setCatalogOpen(false);
    setTrackerOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const CategoryMenu = ({ mode }: { mode: 'catalog' | 'tracker' }) => {
    const items = mode === 'catalog' ? (isLoggedIn ? activeCategories : CATEGORIES) : activeCategories;
    const basePath = mode === 'catalog' ? '/catalog' : '/tracker';

    return (
      <div className="absolute top-full left-0 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        {items.map(cat => (
          <Link
            key={cat.id}
            to={`${basePath}/${cat.id}`}
            className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${cat.accent}20` }}>
              <i className={`${cat.icon} text-sm`} style={{ color: cat.accent }}></i>
            </span>
            <span>
              <span className="block font-medium">{cat.label}</span>
              <span className="block text-xs text-zinc-400">{mode === 'catalog' ? 'Explorar catálogo' : 'Abrir tracker'}</span>
            </span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'border-b border-zinc-100 bg-white/95 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <Logo size={28} />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {isLoggedIn && (
            <Link to="/dashboard" className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'}`}>
              Dashboard General
            </Link>
          )}

          {isLoggedIn && (
            <div ref={trackerRef} className="relative">
              <button
                onClick={() => { setTrackerOpen(v => !v); setCatalogOpen(false); setProfileOpen(false); }}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith('/tracker') ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'}`}
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
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith('/catalog') ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'}`}
            >
              Catálogo
              <i className={`ri-arrow-down-s-line transition-transform ${catalogOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {catalogOpen && <CategoryMenu mode="catalog" />}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" aria-label="Cambiar tema">
            <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
          </button>

          {isLoggedIn && (
            <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" aria-label="Configuración">
              <i className="ri-settings-3-line"></i>
            </Link>
          )}

          {isLoggedIn && <NotificationBell />}

          {isLoggedIn ? (
            <div ref={profileRef} className="relative">
              <button onClick={() => { setProfileOpen(v => !v); setCatalogOpen(false); setTrackerOpen(false); }} className="h-9 w-9 overflow-hidden rounded-full">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand text-sm font-bold text-white dark:bg-brand-dark">
                    {profile?.initials ?? 'NP'}
                  </div>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{profile?.display_name ?? 'Usuario'}</p>
                    <p className="truncate text-xs text-zinc-500">{profile?.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <i className="ri-user-line w-4 text-center"></i> Perfil / Cuenta
                  </Link>
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <i className="ri-settings-3-line w-4 text-center"></i> Configuración
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link to="/admin/catalog" className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                      <i className="ri-shield-user-line w-4 text-center"></i> Admin
                    </Link>
                  )}
                  <div className="border-t border-zinc-100 dark:border-zinc-800">
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                      <i className="ri-logout-box-line w-4 text-center"></i> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover dark:bg-brand-dark dark:hover:bg-brand-dark-hover">
              Iniciar sesión / Entrar
            </Link>
          )}
        </div>

        <button onClick={() => setMobileOpen(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden" aria-label="Abrir menu">
          <i className={mobileOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'}></i>
        </button>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-2 border-t border-zinc-100 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
          {isLoggedIn && (
            <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <i className="ri-dashboard-line"></i> Dashboard General
            </Link>
          )}
          {isLoggedIn && activeCategories.map(cat => (
            <Link key={cat.id} to={`/tracker/${cat.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <i className={cat.icon}></i> Tracker: {cat.label}
            </Link>
          ))}
          {(isLoggedIn ? activeCategories : CATEGORIES).map(cat => (
            <Link key={cat.id} to={`/catalog/${cat.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <i className={cat.icon}></i> Catálogo: {cat.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <i className="ri-settings-3-line"></i> Configuración
            </Link>
          )}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
            <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
              <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
              {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            </button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 dark:border-red-900 dark:text-red-400">
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
