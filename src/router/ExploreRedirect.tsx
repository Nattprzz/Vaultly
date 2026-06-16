/**
 * ExploreRedirect.tsx — redirección de las rutas legacy /explore al catálogo.
 *
 * Mapea las rutas antiguas /explore, /explore/:category y /explore/:category/:id
 * a sus equivalentes actuales bajo /catalog para mantener la compatibilidad
 * de enlaces externos y marcadores guardados antes del renombrado de rutas.
 */

// ─── Librerías externas ───────────────────────────────────────────────────────

import { Navigate, useParams } from 'react-router-dom';

// ─── Componente ──────────────────────────────────────────────────────────────

/** Redirige las rutas /explore/* a su equivalente bajo /catalog. */
export default function ExploreRedirect() {
  const { category, id } = useParams<{ category?: string; id?: string }>();
  if (category && id) return <Navigate to={`/catalog/${category}/${id}`} replace />;
  return <Navigate to={category ? `/catalog/${category}` : '/catalog'} replace />;
}
