/**
 * 503.tsx — pantalla de servicio no disponible.
 *
 * Uso esperado: cuando se detecta que una API externa, Edge Function o
 * Supabase no está disponible. El hook o componente que detecta el error
 * puede navegar a /503 con navigate('/503') desde el catch.
 * El botón "Reintentar" recarga la página en lugar de llamar de nuevo al
 * servicio para dar tiempo al backend a recuperarse.
 */

// ─── Componentes ──────────────────────────────────────────────────────────────

import ErrorStatePage from '@/components/feature/ErrorStatePage';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Error503Page() {
  return (
    <ErrorStatePage
      code={503}
      title="Servicio no disponible temporalmente"
      description="Vaultly no puede procesar la solicitud en este momento. Puede deberse a mantenimiento, sobrecarga o una interrupción temporal."
      icon="ri-pulse-line"
      actions={[
        { label: 'Reintentar',     icon: 'ri-refresh-line',    onClick: () => window.location.reload(), variant: 'primary'   },
        { label: 'Ir al inicio',   icon: 'ri-home-4-line',     to: '/',                                 variant: 'secondary' },
        { label: 'Ir al catálogo', icon: 'ri-compass-3-line',  to: '/catalog',                          variant: 'secondary' },
      ]}
    />
  );
}
