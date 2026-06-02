import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { isLoggedIn, loading, profile } = useAuth();
  const location = useLocation();

  // While session is being restored, show a minimal loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center animate-pulse">
            <i className="ri-archive-2-line text-white"></i>
          </div>
          <p className="text-sm text-zinc-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
