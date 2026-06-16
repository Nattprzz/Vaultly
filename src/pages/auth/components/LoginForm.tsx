/**
 * LoginForm.tsx — formulario de inicio de sesión de Vaultly.
 *
 * Acepta email o nombre de usuario como identificador.
 * - Si el identificador contiene '@' → login directo con email vía Supabase Auth.
 * - Si no contiene '@' → llamada al Edge Function auth-by-username, que resuelve
 *   el username a email server-side (sin exponer el email al cliente) y devuelve
 *   los tokens de sesión.
 *
 * En cualquier fallo de credenciales se muestra siempre el mismo mensaje
 * genérico para evitar enumeración de usuarios o emails.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { useNavigate, useLocation } from 'react-router-dom';

// ─── Servicios ────────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import { edgeFunctionUrl } from '@/lib/edgeFunctions';

// ─── Componentes ──────────────────────────────────────────────────────────────

import ForgotPasswordForm from './ForgotPasswordForm';
import OAuthButtons from './OAuthButtons';

// ─── Constantes ───────────────────────────────────────────────────────────────

const USERNAME_LOGIN_URL = edgeFunctionUrl('auth-by-username');

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSwitch: () => void;
  onViewChange?: (view: 'login' | 'forgot') => void;
}

// ─── Validación ───────────────────────────────────────────────────────────────

function validateIdentifier(val: string): string {
  if (!val.trim()) return 'Introduce tu email o nombre de usuario.';
  if (val.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
    return 'El formato del email no es válido.';
  }
  return '';
}

function validatePassword(val: string): string {
  if (!val) return 'La contraseña es obligatoria.';
  return '';
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function LoginForm({ onSwitch, onViewChange }: LoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView]             = useState<'login' | 'forgot'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState('');
  const [touched, setTouched]       = useState({ identifier: false, password: false });

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  // ─── Validación ───────────────────────────────────────────────────────────────

  const touch = (field: keyof typeof touched) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const identifierError = validateIdentifier(identifier);
  const passwordError   = validatePassword(password);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const switchView = (v: 'login' | 'forgot') => {
    setView(v);
    onViewChange?.(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setTouched({ identifier: true, password: true });
    if (identifierError || passwordError) return;

    setLoading(true);
    try {
      const id = identifier.trim();
      const isEmail = id.includes('@');

      if (isEmail) {
        // ── Login con email (flujo estándar client-side) ──────────────────────
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: id.toLowerCase(),
          password,
        });

        if (authError) {
          if (authError.message.includes('Email not confirmed')) {
            setServerError('Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
          } else {
            setServerError('Credenciales incorrectas.');
          }
          return;
        }
      } else {
        // ── Login con username (Edge Function resuelve username → sesión) ──────
        const res = await fetch(USERNAME_LOGIN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: id.toLowerCase(), password }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          setServerError(json.error ?? 'Credenciales incorrectas.');
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token:  json.session.access_token,
          refresh_token: json.session.refresh_token,
        });

        if (sessionError) {
          setServerError('Credenciales incorrectas.');
          return;
        }
      }

      navigate(from, { replace: true });
    } catch {
      setServerError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Estilos de inputs ────────────────────────────────────────────────────────

  const inputBase    = 'w-full py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors';
  const inputNormal  = 'border-zinc-200 dark:border-zinc-700 focus:border-brand dark:focus:border-brand-dark';
  const inputErrorCls = 'border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500 bg-red-50/40 dark:bg-red-950/10';
  const inputSuccess = 'border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10';

  const getIdentifierClass = () => {
    if (touched.identifier && identifierError) return inputErrorCls;
    if (touched.identifier && !identifierError && identifier) return inputSuccess;
    return inputNormal;
  };
  const getPasswordClass = () => {
    if (touched.password && passwordError) return inputErrorCls;
    if (touched.password && !passwordError && password) return inputSuccess;
    return inputNormal;
  };

  // ─── Renderizado ─────────────────────────────────────────────────────────────

  if (view === 'forgot') {
    return (
      <ForgotPasswordForm
        prefillEmail={identifier.includes('@') ? identifier : ''}
        onBack={() => switchView('login')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Email o nombre de usuario */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-identifier" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Email o nombre de usuario <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.identifier && identifierError ? 'text-red-400' : 'text-zinc-400'}`}>
            <i className={`text-sm ${identifier.includes('@') ? 'ri-mail-line' : identifier ? 'ri-user-line' : 'ri-user-line'}`}></i>
          </div>
          <input
            id="login-identifier"
            type="text"
            name="identifier"
            value={identifier}
            onChange={e => {
              setIdentifier(e.target.value);
              touch('identifier');
              setServerError('');
            }}
            onBlur={() => touch('identifier')}
            placeholder="tu@email.com o nombre_usuario"
            autoComplete="username"
            aria-invalid={touched.identifier && !!identifierError}
            aria-describedby={touched.identifier && identifierError ? 'login-identifier-error' : undefined}
            className={`${inputBase} pl-10 pr-9 ${getIdentifierClass()}`}
          />
          {touched.identifier && !identifierError && identifier && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
              <i className="ri-check-line text-sm"></i>
            </div>
          )}
        </div>
        {touched.identifier && identifierError && (
          <p id="login-identifier-error" className="flex items-center gap-1.5 text-xs text-red-500">
            <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
            {identifierError}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => switchView('forgot')}
            className="text-xs text-brand hover:text-brand-hover dark:text-brand-dark dark:hover:text-brand-dark-hover transition-colors cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="relative">
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.password && passwordError ? 'text-red-400' : 'text-zinc-400'}`}>
            <i className="ri-lock-line text-sm"></i>
          </div>
          <input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              touch('password');
              setServerError('');
            }}
            onBlur={() => touch('password')}
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={touched.password && !!passwordError}
            aria-describedby={touched.password && passwordError ? 'login-password-error' : undefined}
            className={`${inputBase} pl-10 pr-14 ${getPasswordClass()}`}
          />
          {touched.password && !passwordError && password && (
            <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
              <i className="ri-check-line text-sm"></i>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowPass(p => !p)}
            aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <i className={showPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
          </button>
        </div>
        {touched.password && passwordError && (
          <p id="login-password-error" className="flex items-center gap-1.5 text-xs text-red-500">
            <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
            {passwordError}
          </p>
        )}
      </div>

      {serverError && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <i className="ri-error-warning-line text-red-500 text-sm flex-shrink-0"></i>
          <p className="text-xs text-red-600 dark:text-red-400">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-brand dark:bg-brand-dark text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <i className="ri-loader-4-line animate-spin"></i>
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </button>

      <OAuthButtons mode="login" />

      <p className="text-center text-sm text-zinc-500">
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-brand dark:text-brand-dark font-semibold hover:text-brand-hover dark:hover:text-brand-dark-hover transition-colors cursor-pointer"
        >
          Regístrate
        </button>
      </p>
    </form>
  );
}
