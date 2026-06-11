import { useSettings } from '@/hooks/useSettings';
import SettingsCard from './SettingsCard';
import { ToggleRow } from './SettingsCard';

export default function NotificationsSection() {
  const { settings, updateNested } = useSettings();
  const n = settings.notifications;

  return (
    <div className="flex flex-col gap-6">
      <SettingsCard
        title="Notificaciones"
        description="Controla qué tipo de alertas quieres recibir de Vaultly."
      >
        <ToggleRow
          label="Nuevos lanzamientos"
          description="Aviso cuando salga contenido nuevo en tus categorías activas."
          checked={n.newReleases}
          onChange={v => updateNested('notifications', 'newReleases', v)}
        />
        <ToggleRow
          label="Actividad pública"
          description="Avisos sobre actividad pública relacionada con tu contenido."
          checked={n.communityActivity}
          onChange={v => updateNested('notifications', 'communityActivity', v)}
        />
        <ToggleRow
          label="Resumen semanal"
          description="Un email cada semana con un resumen de tu actividad."
          checked={n.weeklyDigest}
          onChange={v => updateNested('notifications', 'weeklyDigest', v)}
        />
        <ToggleRow
          label="Recordatorios del tracker"
          description="Te recordamos los ítems que llevan tiempo en progreso."
          checked={n.trackerReminders}
          onChange={v => updateNested('notifications', 'trackerReminders', v)}
        />
      </SettingsCard>

      <SettingsCard title="Estado de las notificaciones">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex-shrink-0">
            <i className="ri-notification-3-line text-emerald-500"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {Object.values(n).filter(Boolean).length} notificaciones activas
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Las notificaciones se enviarán al email de tu cuenta.
            </p>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
