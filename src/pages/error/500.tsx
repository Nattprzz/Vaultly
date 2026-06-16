/**
 * 500.tsx — pantalla de error interno.
 *
 * Ruta navegable /500 para errores graves conocidos. Para errores de render
 * no controlados, el AppErrorBoundary muestra la misma UI sin navegar a /500.
 * El botón "Reintentar" recarga la página completa.
 */

// ─── Componentes ──────────────────────────────────────────────────────────────

import ErrorStatePage from '@/components/feature/ErrorStatePage';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Error500Page() {
  return (
    <ErrorStatePage
      code={500}
      title="Algo ha salido mal"
      description="Ha ocurrido un error inesperado al procesar la solicitud. Puedes intentarlo de nuevo o volver a una zona segura de Vaultly."
      icon="ri-error-warning-line"
      actions={[
        { label: 'Reintentar',    icon: 'ri-refresh-line', onClick: () => window.location.reload(), variant: 'primary'   },
        { label: 'Ir al inicio',  icon: 'ri-home-4-line',  to: '/',                                 variant: 'secondary' },
        { label: 'Ir al dashboard', icon: 'ri-layout-grid-line', to: '/dashboard',                  variant: 'secondary' },
      ]}
    />
  );
}
