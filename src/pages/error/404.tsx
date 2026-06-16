/**
 * 404.tsx — pantalla de página no encontrada.
 *
 * Se renderiza para cualquier ruta que no coincida con la tabla de rutas,
 * slugs que no existen en base de datos, y recursos eliminados.
 * También se usa como ruta explícita /404 para redirigir manualmente.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom';

// ─── Componentes ──────────────────────────────────────────────────────────────

import ErrorStatePage from '@/components/feature/ErrorStatePage';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Error404Page() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <ErrorStatePage
      code={404}
      title="Página no encontrada"
      description="La página que estás buscando no existe, se ha movido o la URL no es correcta."
      icon="ri-compass-discover-line"
      actions={[
        { label: 'Ir al inicio',    icon: 'ri-home-4-line',     to: '/',        variant: 'primary'   },
        { label: 'Ir al catálogo',  icon: 'ri-compass-3-line',  to: '/catalog', variant: 'secondary' },
        { label: 'Volver atrás',    icon: 'ri-arrow-left-line', onClick: handleBack, variant: 'secondary' },
      ]}
    />
  );
}
