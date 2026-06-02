import { useState } from 'react';
import { useAdminUsers, type AdminUserRow, type AdminUserRole, type AdminUserStatus } from '@/hooks/useAdminUsers';

type StatusFilter = 'all' | AdminUserStatus;
type RoleFilter = 'all' | AdminUserRole;

const STATUS_BADGE: Record<AdminUserStatus, string> = {
  active: 'bg-emerald-500/20 text-emerald-400',
  suspended: 'bg-rose-500/20 text-rose-400',
  pending: 'bg-amber-500/20 text-amber-400',
};

const STATUS_LABEL: Record<AdminUserStatus, string> = {
  active: 'Activo',
  suspended: 'Suspendido',
  pending: 'Pendiente',
};

export default function AdminUsers() {
  const { users, stats, loading, savingId, error, refresh, updateUser } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [actionUser, setActionUser] = useState<AdminUserRow | null>(null);

  const filtered = users.filter(user => {
    const query = search.toLowerCase();
    const matchSearch =
      user.display_name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const toggleSuspend = (user: AdminUserRow) => {
    void updateUser(user.id, { status: user.status === 'suspended' ? 'active' : 'suspended' });
    setActionUser(null);
  };

  const toggleRole = (user: AdminUserRow) => {
    void updateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' });
    setActionUser(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <p className="text-sm text-rose-300">{error}</p>
          <button onClick={() => void refresh()} className="text-xs font-semibold text-rose-200 hover:text-white">
            Reintentar
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, usuario o email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="suspended">Suspendidos</option>
            <option value="pending">Pendientes</option>
          </select>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as RoleFilter)}
            className="px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="user">Usuario</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
        <span>{filtered.length} usuarios encontrados</span>
        <span>·</span>
        <span className="text-emerald-400">{stats.active} activos</span>
        <span>·</span>
        <span className="text-rose-400">{stats.suspended} suspendidos</span>
        <span>·</span>
        <span className="text-amber-400">{stats.pending} pendientes</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <div className="col-span-4">Usuario</div>
          <div className="col-span-2 hidden md:block">Rol</div>
          <div className="col-span-2 hidden lg:block">Estado</div>
          <div className="col-span-2 hidden lg:block">Tracker</div>
          <div className="col-span-2 hidden md:block">Última actividad</div>
          <div className="col-span-2 text-right md:col-span-2 lg:col-span-2">Acciones</div>
        </div>

        <div className="divide-y divide-zinc-800">
          {loading && (
            <div className="flex items-center justify-center py-16 text-zinc-500">
              <i className="ri-loader-4-line mr-2 animate-spin"></i>
              Cargando usuarios...
            </div>
          )}

          {!loading && filtered.map(user => (
            <div key={user.id} className="grid grid-cols-12 items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5">
              <div className="col-span-6 flex min-w-0 items-center gap-3 md:col-span-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: user.accent }}>
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user.display_name}</p>
                  <p className="truncate text-xs text-zinc-500">@{user.username}</p>
                </div>
              </div>

              <div className="col-span-2 hidden md:block">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-700 text-zinc-400'}`}>
                  {user.role === 'admin' ? 'Admin' : 'Usuario'}
                </span>
              </div>

              <div className="col-span-2 hidden lg:block">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[user.status]}`}>
                  {STATUS_LABEL[user.status]}
                </span>
              </div>

              <div className="col-span-2 hidden lg:block">
                <p className="text-sm text-zinc-300">{user.tracked_items} ítems</p>
                <p className="text-xs text-zinc-600">{user.reviews} reseñas</p>
              </div>

              <div className="col-span-2 hidden md:block">
                <p className="text-xs text-zinc-500">{user.last_active}</p>
              </div>

              <div className="relative col-span-6 flex items-center justify-end gap-1 md:col-span-2">
                <button
                  onClick={() => setActionUser(actionUser?.id === user.id ? null : user)}
                  disabled={savingId === user.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                >
                  <i className={savingId === user.id ? 'ri-loader-4-line animate-spin text-sm' : 'ri-more-2-fill text-sm'}></i>
                </button>

                {actionUser?.id === user.id && (
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl">
                    <button
                      onClick={() => toggleRole(user)}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
                    >
                      <i className="ri-shield-user-line text-violet-400"></i>
                      {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                    <button
                      onClick={() => toggleSuspend(user)}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-700 ${user.status === 'suspended' ? 'text-emerald-400' : 'text-rose-400'}`}
                    >
                      <i className={user.status === 'suspended' ? 'ri-user-follow-line' : 'ri-user-forbid-line'}></i>
                      {user.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-600">
            <i className="ri-user-search-line mb-2 block text-3xl"></i>
            <p className="text-sm">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
}
