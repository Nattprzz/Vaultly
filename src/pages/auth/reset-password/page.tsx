import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import SeoHead from '@/components/feature/SeoHead';

function validatePassword(val: string): string {
  if (!val) return 'La contraseña es obligatoria.';
  if (val.length < 8) return 'Mínimo 8 caracteres.';
  return '';
}

function validateConfirm(pass: string, confirm: string): string {
  if (!confirm) return 'Confirma tu nueva contraseña.';
  if (pass !== confirm) return 'Las contraseñas no coinciden.';
  return '';
}

type PageState = 'loading' | 'ready' | 'success' | 'expired';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const touch = (field: keyof typeof touched) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const passwordError = validatePassword(password);
  const confirmError = validateConfirm(password, confirm);

  // Supabase sends the recovery token as a hash fragment — it auto-sets the session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPageState('ready');
      } else if (event === 'SIGNED_IN') {
        // Already has a valid session from the link
        setPageState(prev => prev === 'loading' ? 'ready' : prev);
      }
    });

    // Also check if there's already a session (user landed with valid token)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setPageState('ready');
      } else {
        // Give it 2s for the hash to be processed, then mark as expired
        const t = setTimeout(() => {
          setPageState(prev => prev === 'loading' ? 'expired' : prev);
        }, 2000);
        return () => clearTimeout(t);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setTouched({ password: true, confirm: true });
    if (passwordError || confirmError) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setServerError(error.message);
        return;
      }
      setPageState('success');
    } catch {
      setServerError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Débil', 'Media', 'Fuerte'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'];

  const inputBase = 'w-full py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors';
  const inputNormal = 'border-zinc-200 dark:border-zinc-700 focus:border-brand dark:focus:border-brand-dark';
  const inputErr = 'border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500 bg-red-50/40 dark:bg-red-950/10';

  return (
    <div className="min-h-screen flex bg-[var(--surface)] dark:bg-[var(--bg)]">
      <SeoHead
        title="Restablecer contraseña — Vaultly"
        description="Establece una nueva contraseña para tu cuenta de Vaultly."
        canonical="/auth/reset-password"
        noIndex
      />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(59,130,246,0.07),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_80%,rgba(139,92,246,0.06),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px)',
          }}
        />
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer w-fit">
            <div className="w-9 h-9 rounded-xl bg-brand dark:bg-brand-dark flex items-center justify-center">
              <i className="ri-archive-2-line text-white"></i>
            </div>
            <span className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Vaultly
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <i className="ri-shield-keyhole-line text-3xl text-blue-300"></i>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Nueva contraseña,<br />
                <span className="text-brand dark:text-brand-dark">
                  acceso seguro.
                </span>
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                Elige una contraseña fuerte para proteger tu vault. Te recomendamos usar al menos 10 caracteres con letras, números y símbolos.
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-xs">
              {[
                { icon: 'ri-lock-2-line', text: 'Mínimo 8 caracteres' },
                { icon: 'ri-eye-off-line', text: 'Nunca compartimos tu contraseña' },
                { icon: 'ri-shield-check-line', text: 'Cifrado de extremo a extremo' },
              ].map(tip => (
                <div key={tip.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <i className={`${tip.icon} text-blue-300 text-sm`}></i>
                  </div>
                  <span className="text-zinc-400 text-sm">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-zinc-600 text-xs">
            © 2026 Vaultly · <Link to="/privacy" rel="nofollow" className="hover:text-zinc-400 transition-colors">Privacidad</Link> · <Link to="/terms" rel="nofollow" className="hover:text-zinc-400 transition-colors">Términos</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col w-full lg:w-[480px] flex-shrink-0 relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 cursor-pointer lg:invisible">
            <div className="w-7 h-7 rounded-lg bg-brand dark:bg-brand-dark flex items-center justify-center">
              <i className="ri-archive-2-line text-white text-xs"></i>
            </div>
            <span className="font-bold text-zinc-900 dark:text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Vaultly</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="ml-auto w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-6">

          {/* Loading state */}
          {pageState === 'loading' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-blue-200 dark:border-blue-900 border-t-brand dark:border-t-brand-dark animate-spin"></div>
              <p className="text-sm text-zinc-500">Verificando enlace...</p>
            </div>
          )}

          {/* Expired / invalid link */}
          {pageState === 'expired' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                  <i className="ri-time-line text-3xl text-red-500"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Enlace expirado
                  </h1>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Este enlace de recuperación ya no es válido o ha caducado. Los enlaces tienen una validez de 1 hora.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to="/auth"
                  className="w-full py-3 rounded-xl bg-brand dark:bg-brand-dark text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <i className="ri-refresh-line"></i>
                  Solicitar nuevo enlace
                </Link>
                <Link
                  to="/"
                  className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}

          {/* Success state */}
          {pageState === 'success' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  <i className="ri-shield-check-line text-3xl text-emerald-500"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    ¡Contraseña actualizada!
                  </h1>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 rounded-xl bg-brand dark:bg-brand-dark text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-dashboard-line"></i>
                Ir a mi dashboard
              </button>
            </div>
          )}

          {/* Ready — show form */}
          {pageState === 'ready' && (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center">
                    <i className="ri-shield-keyhole-line text-brand dark:text-brand-dark text-xs"></i>
                  </div>
                  <span className="text-xs text-zinc-500">Restablecimiento de contraseña</span>
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Nueva contraseña
                </h1>
                <p className="text-sm text-zinc-500">
                  Elige una contraseña segura para tu cuenta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Nueva contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.password && passwordError ? 'text-red-400' : 'text-zinc-400'}`}>
                      <i className="ri-lock-line text-sm"></i>
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); touch('password'); setServerError(''); }}
                      onBlur={() => touch('password')}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      autoFocus
                      className={`${inputBase} pl-10 pr-11 ${touched.password && passwordError ? inputErr : inputNormal}`}
                    />
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
                  {password.length > 0 && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-zinc-200 dark:bg-zinc-700'}`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {strengthLabel[strength]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Confirmar contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.confirm && confirmError ? 'text-red-400' : 'text-zinc-400'}`}>
                      <i className="ri-lock-2-line text-sm"></i>
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); touch('confirm'); setServerError(''); }}
                      onBlur={() => touch('confirm')}
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      className={`${inputBase} pl-10 pr-11 ${touched.confirm && confirmError ? inputErr : inputNormal}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                    >
                      <i className={showConfirm ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
                    </button>
                  </div>
                  {touched.confirm && confirmError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500">
                      <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                      {confirmError}
                    </p>
                  )}
                  {touched.confirm && !confirmError && confirm && (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                      <i className="ri-checkbox-circle-line text-xs flex-shrink-0"></i>
                      Las contraseñas coinciden
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
                      Guardando contraseña...
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-check-line"></i>
                      Establecer nueva contraseña
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-zinc-500">
                  <Link
                    to="/auth"
                    className="text-brand dark:text-brand-dark font-semibold hover:text-brand-hover dark:hover:text-brand-dark-hover transition-colors cursor-pointer"
                  >
                    Volver al inicio de sesión
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
