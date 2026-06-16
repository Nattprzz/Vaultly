/**
 * OAuthButtons.tsx — botones de autenticación OAuth (Google, Microsoft) para el flujo de auth.
 *
 * Google se activa si VITE_GOOGLE_OAUTH_ENABLED=true en el entorno.
 * Microsoft se activa si VITE_MICROSOFT_OAUTH_ENABLED=true en el entorno.
 * Ambos requieren configurar el proveedor en Supabase Dashboard
 * (Authentication → Providers) y añadir `window.location.origin + /dashboard`
 * a Settings → Auth → Redirect URLs.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Activa el botón de Google si el proveedor está configurado en Supabase. */
const GOOGLE_ENABLED = import.meta.env.VITE_GOOGLE_OAUTH_ENABLED === 'true';

/** Activa el botón de Microsoft si el proveedor Azure está configurado en Supabase. */
const MICROSOFT_ENABLED = import.meta.env.VITE_MICROSOFT_OAUTH_ENABLED === 'true';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Props del componente de botones OAuth. */
interface Props {
  /** Determina el texto del divisor ("o continúa con" / "o regístrate con"). */
  mode: 'login' | 'register';
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function OAuthButtons({ mode }: Props) {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const [loadingProvider, setLoadingProvider] = useState<'google' | 'microsoft' | null>(null);
  const [error, setError] = useState('');

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleGoogle = async () => {
    setError('');
    setLoadingProvider('google');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError('Error al conectar con Google. Inténtalo de nuevo.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleMicrosoft = async () => {
    setError('');
    setLoadingProvider('microsoft');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError('Error al conectar con Microsoft. Inténtalo de nuevo.');
    } finally {
      setLoadingProvider(null);
    }
  };

  // ─── Renderizado ─────────────────────────────────────────────────────────────

  const dividerText = mode === 'login' ? 'o continúa con' : 'o regístrate con';
  const isLoading   = loadingProvider !== null;

  return (
    <>
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
        <span className="text-xs text-zinc-400">{dividerText}</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOOGLE_ENABLED ? (
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-wait"
          >
            {loadingProvider === 'google'
              ? <i className="ri-loader-4-line animate-spin text-base"></i>
              : <i className="ri-google-fill text-base" style={{ color: '#4285F4' }}></i>
            }
            Google
          </button>
        ) : (
          <button
            type="button"
            disabled
            title="Próximamente disponible"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed whitespace-nowrap"
          >
            <i className="ri-google-fill text-base"></i>
            Google
          </button>
        )}

        {MICROSOFT_ENABLED ? (
          <button
            type="button"
            onClick={handleMicrosoft}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-wait"
          >
            {loadingProvider === 'microsoft'
              ? <i className="ri-loader-4-line animate-spin text-base"></i>
              : <i className="ri-microsoft-fill text-base" style={{ color: '#00A4EF' }}></i>
            }
            Microsoft
          </button>
        ) : (
          <button
            type="button"
            disabled
            title="Próximamente disponible"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed whitespace-nowrap"
          >
            <i className="ri-microsoft-fill text-base"></i>
            Microsoft
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <i className="ri-error-warning-line text-red-500 text-sm flex-shrink-0"></i>
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </>
  );
}
