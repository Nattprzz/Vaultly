import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/mocks/catalog';
import { SETTINGS_STORAGE_KEY } from '@/hooks/useSettings';

interface RegisterFormProps {
  onSwitch: () => void;
  onStepChange?: (step: 1 | 2) => void;
}

function getInitials(name: string): string {
  return name
    .split(/[\s_-]+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

function validateEmail(val: string): string {
  if (!val) return 'El correo electrónico es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Introduce un correo válido.';
  return '';
}

function validateUsername(val: string): string {
  if (!/^[a-z0-9_]*$/.test(val)) return 'Solo letras, nÃºmeros y guiones bajos.';
  if (!val) return 'El nombre de usuario es obligatorio.';
  if (val.length < 3) return 'Mínimo 3 caracteres.';
  return '';
}

function validatePassword(val: string): string {
  if (!val) return 'La contraseña es obligatoria.';
  if (val.length < 8) return 'Mínimo 8 caracteres.';
  return '';
}



const STEPS = [
  { num: 1, label: 'Tu cuenta', icon: 'ri-user-line' },
  { num: 2, label: 'Intereses', icon: 'ri-heart-line' },
];

const DEFAULT_SELECTED_CATEGORIES = ['videojuegos', 'peliculas', 'series', 'libros'];

function persistSelectedCategories(activeCategories: string[]) {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const previous = raw ? JSON.parse(raw) : {};
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...previous, activeCategories }));
  } catch {
    // Local persistence is a convenience; Supabase remains the source of truth.
  }
}

export default function RegisterForm({ onSwitch, onStepChange }: RegisterFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [stepAnimKey, setStepAnimKey] = useState(0);
  const [stepDirection, setStepDirection] = useState<'forward' | 'back'>('forward');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(DEFAULT_SELECTED_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);

  // touched state per field
  const [touched, setTouched] = useState({ username: false, email: false, password: false });

  const touch = (field: keyof typeof touched) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const usernameError = validateUsername(username);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);



  const toggleCat = (id: string) => {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setTouched({ username: true, email: true, password: true });
    setTermsTouched(true);
    if (usernameError || emailError || passwordError) return;
    if (!termsAccepted) return;
    goToStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (selectedCats.length === 0) {
      setServerError('Selecciona al menos una categoría.');
      return;
    }

    persistSelectedCategories(selectedCats);
    setLoading(true);
    try {
      const normalizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
      const displayName = normalizedUsername.replace(/[_-]/g, ' ');
      const initials = getInitials(normalizedUsername);

      const { data: usernameAvailable, error: usernameCheckError } = await supabase
        .rpc('username_available', { candidate: normalizedUsername });

      if (usernameCheckError) throw usernameCheckError;
      if (usernameAvailable === false) {
        setServerError('Este nombre de usuario ya estÃ¡ en uso.');
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: normalizedUsername,
            display_name: displayName,
            initials,
            selected_categories: selectedCats,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setServerError('Este email ya está registrado. Prueba a iniciar sesión.');
        } else if (signUpError.message.includes('Database error saving new user')) {
          setServerError('No se pudo crear el perfil. Revisa que el nombre de usuario no exista y vuelve a intentarlo.');
        } else {
          setServerError(signUpError.message);
        }
        return;
      }

      if (data.user) {
        const { error: settingsError } = await supabase
          .from('user_tracker_settings')
          .upsert(
            { user_id: data.user.id, selected_categories: selectedCats, updated_at: new Date().toISOString() },
            { onConflict: 'user_id' },
          );

        if (settingsError && data.session) throw settingsError;
      }

      if (!data.session) {
        setSuccess(true);
      } else {
        navigate('/dashboard');
      }
    } catch {
      setServerError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (next: 1 | 2) => {
    setStepDirection(next > step ? 'forward' : 'back');
    setStep(next);
    setStepAnimKey(k => k + 1);
    onStepChange?.(next);
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Débil', 'Media', 'Fuerte'];
  const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400'];

  const inputBase = 'w-full py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors';
  const inputNormal = 'border-zinc-200 dark:border-zinc-700 focus:border-violet-400 dark:focus:border-violet-500';
  const inputError = 'border-rose-400 dark:border-rose-500 focus:border-rose-400 dark:focus:border-rose-500 bg-rose-50/40 dark:bg-rose-950/10';
  const inputSuccess = 'border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 dark:focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10';

  const getUsernameClass = () => {
    if (usernameHasError) return inputError;
    if (touched.username && !usernameError && username) return inputSuccess;
    return inputNormal;
  };
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

  const usernameHasError = touched.username && !!usernameError;

  const slideClass = stepDirection === 'forward' ? 'reg-step-forward' : 'reg-step-back';

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
          <i className="ri-mail-check-line text-3xl text-emerald-500"></i>
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ¡Revisa tu email!
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Te hemos enviado un enlace de confirmación a{' '}
            <strong className="text-zinc-700 dark:text-zinc-300">{email}</strong>. Haz clic en él para activar tu cuenta.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitch}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <style>{`
        @keyframes regStepForward {
          from { opacity: 0; transform: translateX(22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes regStepBack {
          from { opacity: 0; transform: translateX(-22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .reg-step-forward { animation: regStepForward 0.28s cubic-bezier(0.22,1,0.36,1) both; }
        .reg-step-back    { animation: regStepBack    0.28s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── Progress indicator ── */}
      <div className="flex flex-col gap-3">
        {/* Step nodes + connector */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, idx) => {
            const done = step > s.num;
            const active = step === s.num;
            return (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                {/* Node */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    done
                      ? 'bg-gradient-to-br from-violet-500 to-rose-500'
                      : active
                      ? 'bg-gradient-to-br from-violet-500 to-rose-500 ring-4 ring-violet-100 dark:ring-violet-950/50'
                      : 'bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700'
                  }`}>
                    {done ? (
                      <i className="ri-check-line text-white text-sm"></i>
                    ) : (
                      <i className={`${s.icon} text-sm ${active ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`}></i>
                    )}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    active ? 'text-zinc-900 dark:text-white' : done ? 'text-violet-500' : 'text-zinc-400'
                  }`}>
                    {s.label}
                  </span>
                </div>

                {/* Connector line (not after last) */}
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 mx-3 mb-5 h-0.5 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-500 ease-out"
                      style={{ width: done || step > s.num ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Step label */}
        <p className="text-xs text-zinc-400 text-right">
          Paso <span className="font-semibold text-zinc-600 dark:text-zinc-300">{step}</span> de <span className="font-semibold text-zinc-600 dark:text-zinc-300">2</span>
        </p>
      </div>

      {/* ── Animated step content ── */}
      <div key={stepAnimKey} className={slideClass}>
        {step === 1 ? (
          <form onSubmit={handleStep1} className="flex flex-col gap-4" noValidate>
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Nombre de usuario <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${usernameHasError ? 'text-rose-400' : 'text-zinc-400'}`}>
                  <i className="ri-at-line text-sm"></i>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value.toLowerCase().replace(/\s/g, ''));
                    touch('username');
                  }}
                  onBlur={() => touch('username')}
                  placeholder="tu_usuario"
                  autoComplete="username"
                  className={`${inputBase} pl-10 pr-9 ${getUsernameClass()}`}
                />
                {touched.username && !usernameError && username && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-emerald-500">
                    <i className="ri-check-line text-sm"></i>
                  </div>
                )}
              </div>

              {touched.username && usernameError && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
                  <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                  {usernameError}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Correo electrónico <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.email && emailError ? 'text-rose-400' : 'text-zinc-400'}`}>
                  <i className="ri-mail-line text-sm"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    touch('email');
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
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
                  <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Contraseña <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${touched.password && passwordError ? 'text-rose-400' : 'text-zinc-400'}`}>
                  <i className="ri-lock-line text-sm"></i>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    touch('password');
                  }}
                  onBlur={() => touch('password')}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
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
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
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
                  <span className={`text-xs font-medium ${strength === 1 ? 'text-rose-400' : strength === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Terms & Privacy checkbox */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`flex items-start gap-3 cursor-pointer group rounded-xl px-3.5 py-3 border transition-colors ${
                  termsTouched && !termsAccepted
                    ? 'border-rose-300 dark:border-rose-700 bg-rose-50/40 dark:bg-rose-950/10'
                    : termsAccepted
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/10'
                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => {
                      setTermsAccepted(e.target.checked);
                      setTermsTouched(true);
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all ${
                    termsAccepted
                      ? 'bg-gradient-to-br from-violet-500 to-rose-500 border-transparent'
                      : termsTouched && !termsAccepted
                      ? 'border-rose-400 bg-white dark:bg-zinc-800'
                      : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-violet-400'
                  }`}>
                    {termsAccepted && (
                      <i className="ri-check-line text-white" style={{ fontSize: '10px' }}></i>
                    )}
                  </div>
                </div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed select-none">
                  He leído y acepto los{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-violet-500 font-semibold hover:text-violet-600 transition-colors underline underline-offset-2"
                  >
                    Términos de Uso
                  </Link>
                  {' '}y la{' '}
                  <Link
                    to="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-violet-500 font-semibold hover:text-violet-600 transition-colors underline underline-offset-2"
                  >
                    Política de Privacidad
                  </Link>
                  {' '}de Vaultly.
                </span>
              </label>
              {termsTouched && !termsAccepted && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
                  <i className="ri-error-warning-line text-xs flex-shrink-0"></i>
                  Debes aceptar los términos para continuar.
                </p>
              )}
            </div>

            {serverError && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                <i className="ri-error-warning-line text-rose-500 text-sm flex-shrink-0"></i>
                <p className="text-xs text-rose-600 dark:text-rose-400">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              Continuar
              <i className="ri-arrow-right-line"></i>
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
              <span className="text-xs text-zinc-400">o regístrate con</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-google-fill text-base text-rose-500"></i>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-discord-fill text-base text-indigo-400"></i>
                Discord
              </button>
            </div>

            <p className="text-center text-sm text-zinc-500">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="text-violet-500 font-semibold hover:text-violet-600 transition-colors cursor-pointer"
              >
                Inicia sesión
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Elige las categorías que quieres trackear. Puedes cambiarlas después en Configuración.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => {
                  const active = selectedCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        active
                          ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300'
                          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className={`${cat.icon} text-sm`}></i>
                      </div>
                      {cat.label}
                      {active && (
                        <div className="ml-auto w-4 h-4 flex items-center justify-center">
                          <i className="ri-check-line text-xs text-violet-500"></i>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                {selectedCats.length} categoría{selectedCats.length !== 1 ? 's' : ''} seleccionada{selectedCats.length !== 1 ? 's' : ''}
              </p>
            </div>

            {serverError && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                <i className="ri-error-warning-line text-rose-500 text-sm flex-shrink-0"></i>
                <p className="text-xs text-rose-600 dark:text-rose-400">{serverError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-arrow-left-line mr-1.5"></i>
                Atrás
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line"></i>
                    Crear mi cuenta
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
