import SettingsCard        from './SettingsCard';
import type { SessionGroup } from '../hooks/useAccountSection';

interface Props { session: SessionGroup }

export default function SessionCard({ session }: Props) {
  return (
    <SettingsCard title="Sesión activa">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <i className="ri-computer-line text-zinc-500"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Navegador web</p>
            <p className="text-xs text-zinc-500">Sesión actual · Activa ahora</p>
          </div>
        </div>
        {!session.showLogoutConfirm ? (
          <button
            onClick={() => session.setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-line"></i>
            Cerrar sesión
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => session.setShowLogoutConfirm(false)} className="px-3 py-2 text-sm text-zinc-500 cursor-pointer whitespace-nowrap">
              Cancelar
            </button>
            <button onClick={session.onLogout} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold cursor-pointer whitespace-nowrap">
              Confirmar
            </button>
          </div>
        )}
      </div>
    </SettingsCard>
  );
}
