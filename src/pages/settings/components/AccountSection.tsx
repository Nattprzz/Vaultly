/**
 * AccountSection.tsx — sección de configuración de cuenta de usuario.
 *
 * Componente orquestador: delega toda la lógica a useAccountSection y
 * distribuye los grupos de estado a cada subcomponente de presentación.
 */

import { useAccountSection } from '../hooks/useAccountSection';
import ProfileFormCard        from './ProfileFormCard';
import PasswordCard           from './PasswordCard';
import SessionCard            from './SessionCard';
import DangerZoneCard         from './DangerZoneCard';

export default function AccountSection() {
  const { profile, password, session, danger } = useAccountSection();

  return (
    <div className="flex flex-col gap-6">
      <ProfileFormCard profile={profile} />
      <PasswordCard    password={password} />
      <SessionCard     session={session} />
      <DangerZoneCard  danger={danger} />
    </div>
  );
}
