import SettingsCard         from './SettingsCard';
import type { DangerGroup } from '../hooks/useAccountSection';

interface Props { danger: DangerGroup }

export default function DangerZoneCard({ danger }: Props) {
  return (
    <SettingsCard title="Zona de peligro">
      <div className="flex flex-col gap-3">

        {/* Restablecer configuración */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Restablecer configuración</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Vuelve a los ajustes predeterminados de la app.</p>
          </div>
          {!danger.showResetConfirm ? (
            <button
              onClick={() => danger.setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer whitespace-nowrap"
            >
              Restablecer
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => danger.setShowResetConfirm(false)} className="px-3 py-2 text-sm text-zinc-500 cursor-pointer whitespace-nowrap">Cancelar</button>
              <button onClick={danger.onReset} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold cursor-pointer whitespace-nowrap">Confirmar</button>
            </div>
          )}
        </div>

        {/* Eliminar cuenta */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900">
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Eliminar cuenta</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Esta acción es irreversible. Se borrarán todos tus datos.</p>
          </div>
          <button
            onClick={() => danger.setShowDeleteNotice(true)}
            className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer whitespace-nowrap"
          >
            Eliminar
          </button>
        </div>

        {/* Modal informativo — eliminación requiere contactar soporte */}
        {danger.showDeleteNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 w-full max-w-sm shadow-xl">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
                    <i className="ri-delete-bin-line text-red-500 text-sm"></i>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Eliminar cuenta</p>
                </div>
                <button
                  onClick={() => danger.setShowDeleteNotice(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-zinc-500 text-sm"></i>
                </button>
              </div>
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  La eliminación de cuenta todavía no está disponible. Si necesitas eliminar tus datos, contacta con soporte.
                </p>
                <button
                  onClick={() => danger.setShowDeleteNotice(false)}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsCard>
  );
}
