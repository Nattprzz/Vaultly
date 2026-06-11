import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ForgotPasswordForm from './ForgotPasswordForm';

interface LoginFormProps {
  onSwitch: () => void;
  onViewChange?: (view: 'login' | 'forgot') => void;
}

function validateEmail(val: string): string {
  if (!val) return 'El correo electrónico es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Introduce un correo válido.';
  return '';
}

function validatePassword(val: string): string {
  if (!val) return 'La contraseña es obligatoria.';
  return '';
}

export default function LoginForm({ onSwitch, onViewChange }: LoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  const touch = (field: keyof typeof touched) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  const switchView = (v: 'login' | 'forgot') => {
    setView(v);
    onViewChange?.(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setServerError('Email o contraseña incorrectos.');
        } else if (authError.message.includes('Email not confirmed')) {
          setServerError('Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
        } else {
          setServerError(authError.message);
        }
        return;
      }

      navigate(from, { replace: true });
    } catch {
      setServerError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors';
  const inputNormal = 'border-zinc-200 dark:border-zinc-700 focus:border-brand dark:focus:border-brand-dark';
  const inputError = 'border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500 bg-red-50/40 dark:bg-red-950/10';
  const inputSuccess = 'border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10';

  const getEmailClass = () => {
    if (touched.email && emailError) return inputError;
    if (touched.email && !emailError && email) return inputSuccess;
    return inputNormal;
  };
  const getPasswordClass = () => {
    if (touched.password && passwordError) return inputError;
    if (touched.password && !passwordError && password) return inputSuccess;
    return inputNormal;
  };

  if (view === 'forgot') {
    return (
      <ForgotPasswordForm
        prefillEmail={email}
        onBack={() => switchView('login')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.email && emailError ? 'text-red-400' : 'text-zinc-400'}`}>
            <i className="ri-mail-line text-sm"></i>
          </div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              touch('email');
              setServerError('');
            }}
            onBlur={() => touch('email')}
            placeholder="tu@email.com"
            autoComplete="email"
            className={`${inputBase} pl-10 pr-9 ${getEmailClass()}`}
          />
          {touched.email && !emailError && email && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
              <i className="ri-check-line text-sm"></i>
            </div>
          )}
        </div>
        {touched.email && emailError && (
          <p className="flex items-center gap-1.5 text-xs text-red-500">
            <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
            {emailError}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <i className={showPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
          </button>
        </div>
        {touched.password && passwordError && (
          <p className="flex items-center gap-1.5 text-xs text-red-500">
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

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
        <span className="text-xs text-zinc-400">o continúa con</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          title="Próximamente disponible"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed whitespace-nowrap"
        >
          <i className="ri-google-fill text-base"></i>
          Google
        </button>
        <button
          type="button"
          disabled
          title="Próximamente disponible"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed whitespace-nowrap"
        >
          <i className="ri-discord-fill text-base"></i>
          Discord
        </button>
      </div>

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
