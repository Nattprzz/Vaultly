import { Link, useLocation } from 'react-router-dom';
import { useAdminReports } from '@/hooks/useAdminReports';

type AdminSection = 'overview' | 'users' | 'catalog' | 'reviews' | 'entities' | 'audit' | 'reports' | 'settings';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: string;
  badge?: number;
  path: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface Props {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: Props) {
  const location = useLocation();
  const { pendingCount } = useAdminReports();

  const groups: NavGroup[] = [
    {
      label: 'Principal',
      items: [
        { id: 'overview', label: 'Resumen', icon: 'ri-dashboard-3-line', path: '/admin' },
        { id: 'catalog', label: 'Catálogo', icon: 'ri-database-2-line', path: '/admin/catalog' },
        { id: 'reports', label: 'Reportes', icon: 'ri-flag-2-line', path: '/admin/reports', badge: pendingCount },
      ],
    },
  ];

  const isActive = (item: NavItem) =>
    item.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path);

  return (
    <aside className="w-64 flex-shrink-0 bg-zinc-950 min-h-screen flex flex-col border-r border-zinc-800/60">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800/60">
        <div className="w-8 h-8 rounded-lg bg-brand dark:bg-brand-dark flex items-center justify-center flex-shrink-0">
          <i className="ri-archive-2-line text-white text-sm"></i>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Vaultly
          </p>
          <p className="text-zinc-500 text-xs">Panel de Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto">
        {groups.map(group => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(item => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className={`${item.icon} text-base`}></i>
                    </div>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="min-w-[20px] px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-zinc-800/60">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-arrow-left-line text-base"></i>
          </div>
          <span className="text-sm font-medium">Volver a Vaultly</span>
        </Link>
      </div>
    </aside>
  );
}

export type { AdminSection };
