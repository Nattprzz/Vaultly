import { Link, useLocation } from 'react-router-dom';
import { ADMIN_STATS, ADMIN_REPORTS } from '@/mocks/admin';

const ADMIN_REPORTS_PENDING = ADMIN_REPORTS.filter(r => r.status === 'pending').length;

type AdminSection = 'overview' | 'users' | 'catalog' | 'reviews' | 'entities' | 'audit' | 'reports';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: string;
  badge?: number;
  path: string;
}

const NAV: NavItem[] = [
  { id: 'overview',  label: 'Resumen',    icon: 'ri-dashboard-3-line',  path: '/admin' },
  { id: 'users',     label: 'Usuarios',   icon: 'ri-group-line',         path: '/admin/users' },
  { id: 'catalog',   label: 'Catálogo',   icon: 'ri-database-2-line',    path: '/admin/catalog' },
  { id: 'entities',  label: 'Entidades',  icon: 'ri-user-star-line',     path: '/admin/entities' },
  { id: 'reviews',   label: 'Reseñas',    icon: 'ri-quill-pen-line',     badge: ADMIN_STATS.pending_reviews, path: '/admin/reviews' },
  { id: 'reports',   label: 'Reportes',   icon: 'ri-flag-2-line',        badge: ADMIN_REPORTS_PENDING, path: '/admin/reports' },
  { id: 'audit',     label: 'Auditoría',  icon: 'ri-shield-check-line',  path: '/admin/audit' },
];

interface Props {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: Props) {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 bg-zinc-950 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center flex-shrink-0">
          <i className="ri-archive-2-line text-white text-sm"></i>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Vaultly</p>
          <p className="text-zinc-500 text-xs">Panel de Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-base`}></i>
              </div>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to app */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-base"></i>
          </div>
          <span className="text-sm font-medium">Volver a la app</span>
        </Link>
      </div>
    </aside>
  );
}

export type { AdminSection };


