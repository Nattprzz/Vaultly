/**
 * 403.tsx — pantalla de acceso prohibido.
 *
 * Se muestra cuando el usuario intenta acceder a una ruta protegida sin los
 * permisos necesarios: rutas de admin sin rol admin, contenido privado, etc.
 * Adapta las acciones según el estado de sesión: si no hay sesión activa
 * ofrece ir a iniciar sesión; si hay sesión, ir al dashboard.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';

// ─── Componentes ──────────────────────────────────────────────────────────────

import ErrorStatePage from '@/components/feature/ErrorStatePage';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Error403Page() {
  const navigate    = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(isLoggedIn ? '/dashboard' : '/');
    }
  };

  return (
    <ErrorStatePage
      code={403}
      title="Acceso prohibido"
      description="No tienes permisos para acceder a esta sección. Puede que necesites iniciar sesión con otra cuenta o volver a una zona permitida."
      icon="ri-shield-keyhole-line"
      actions={[
        isLoggedIn
          ? { label: 'Ir al dashboard',    icon: 'ri-home-4-line',    to: '/dashboard', variant: 'primary'   }
          : { label: 'Iniciar sesión',      icon: 'ri-login-box-line', to: '/auth',      variant: 'primary'   },
        { label: 'Volver atrás', icon: 'ri-arrow-left-line', onClick: handleBack, variant: 'secondary' },
      ]}
    />
  );
}
