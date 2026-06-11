import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ForgotPasswordFormProps {
  onBack: () => void;
  prefillEmail?: string;
}

function validateEmail(val: string): string {
  if (!val) return 'El correo electrónico es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Introduce un correo válido.';
  return '';
}

export default function ForgotPasswordForm({ onBack, prefillEmail = '' }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(prefillEmail);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const emailError = validateEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setServerError('');
    if (emailError) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      setSent(true);
    } catch {
      setServerError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors';
  const inputNormal = 'border-zinc-200 dark:border-zinc-700 focus:border-brand dark:focus:border-brand-dark';
  const inputErrorClass = 'border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500 bg-red-50/40 dark:bg-red-950/10';
  const inputSuccessClass = 'border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10';

  const getEmailClass = () => {
    if (touched && emailError) return inputErrorClass;
    if (touched && !emailError && email) return inputSuccessClass;
    return inputNormal;
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-6">
        {/* Success state */}
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
            <i className="ri-mail-send-line text-3xl text-emerald-500"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¡Email enviado!
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Si existe una cuenta con{' '}
              <strong className="text-zinc-700 dark:text-zinc-300">{email}</strong>,
              recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
          </div>
          <div className="w-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
              <i className="ri-information-line flex-shrink-0 mt-0.5"></i>
              Revisa también tu carpeta de spam si no ves el email en tu bandeja de entrada.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { setSent(false); setEmail(''); setTouched(false); }}
            className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            Enviar de nuevo
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-brand dark:bg-brand-dark text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-arrow-left-line"></i>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Description */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg bg-brand/10 dark:bg-brand-dark/15">
          <i className="ri-lock-password-line text-brand dark:text-brand-dark text-sm"></i>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-0.5">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched && emailError ? 'text-red-400' : 'text-zinc-400'}`}>
            <i className="ri-mail-line text-sm"></i>
          </div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setTouched(true);
              setServerError('');
            }}
            onBlur={() => setTouched(true)}
            placeholder="tu@email.com"
            autoComplete="email"
            autoFocus
            className={`${inputBase} pl-10 pr-9 ${getEmailClass()}`}
          />
          {touched && !emailError && email && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
              <i className="ri-check-line text-sm"></i>
            </div>
          )}
        </div>
        {touched && emailError && (
          <p className="flex items-center gap-1.5 text-xs text-red-500">
            <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
            {emailError}
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
            Enviando enlace...
          </>
        ) : (
          <>
            <i className="ri-send-plane-line"></i>
            Enviar enlace de recuperación
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
      >
        <i className="ri-arrow-left-line text-xs"></i>
        Volver al inicio de sesión
      </button>
    </form>
  );
}
