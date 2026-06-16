/**
 * ProtectedRoute.tsx — guardia de rutas privadas y de administración.
 *
 * Envuelve cualquier ruta que requiera sesión activa y, opcionalmente,
 * rol de administrador. Mientras la sesión se restaura muestra un spinner
 * mínimo para evitar parpadeos de redirección en la carga inicial.
 * Preserva la ruta de destino en el estado del router para redirigir
 * de vuelta después de iniciar sesión.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import React from 'react';

// ─── Router ──────────────────────────────────────────────────────────────────

import { Navigate, useLocation } from 'react-router-dom';

// ─── Hooks ───────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';
import { LogoMark } from '@/components/branding/Logo';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Props {
  /** Contenido de la ruta protegida */
  children: React.ReactNode;
  /** Si true, solo los usuarios con role === 'admin' pueden acceder */
  requireAdmin?: boolean;
  /** Si true, los admins son redirigidos a /admin (ruta exclusiva de usuarios normales) */
  requireUser?: boolean;
}

// ─── Componente ──────────────────────────────────────────────────────────────

/**
 * Guardia de acceso para rutas privadas.
 *
 * - Sin sesión → redirige a /auth conservando la ruta actual en state.from.
 * - Con sesión pero sin rol admin (cuando requireAdmin=true) → redirige a /dashboard.
 * - Durante la carga de la sesión → muestra un spinner neutro.
 */
export default function ProtectedRoute({ children, requireAdmin = false, requireUser = false }: Props) {
  const { isLoggedIn, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] dark:bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand dark:bg-brand-dark flex items-center justify-center animate-pulse">
            <LogoMark size={24} />
          </div>
          <p className="text-sm text-zinc-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  if (requireUser && profile?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
