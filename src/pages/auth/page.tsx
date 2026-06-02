import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import SeoHead from '@/components/feature/SeoHead';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const SHOWCASE = [
  {
    quote: 'Finalmente un lugar donde tengo todo mi consumo cultural organizado. Películas, libros, series... todo en un solo sitio.',
    author: 'María G.',
    role: 'Cinéfila & lectora',
    avatar: 'MG',
  },
  {
    quote: 'El tracker de anime es increíble. Puedo ver exactamente cuántos episodios llevo y qué sigue en mi lista.',
    author: 'Kenji T.',
    role: 'Otaku & gamer',
    avatar: 'KT',
  },
  {
    quote: 'Me encanta poder compartir mi perfil con amigos y ver qué están leyendo o viendo. Es como Goodreads pero para todo.',
    author: 'Laura P.',
    role: 'Bookworm',
    avatar: 'LP',
  },
];

const STATS = [
  { value: '2.4M+', label: 'Ítems trackeados' },
  { value: '180K+', label: 'Usuarios activos' },
  { value: '10', label: 'Categorías' },
];

export default function AuthPage() {
  const { isLoggedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [loginView, setLoginView] = useState<'login' | 'forgot'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const prevModeRef = useRef(mode);

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const t = setInterval(() => setShowcaseIdx(i => (i + 1) % SHOWCASE.length), 4000);
    return () => clearInterval(t);
  }, []);

  const switchMode = (next: 'login' | 'register') => {
    if (next === mode) return;
    // register is "to the right", login is "to the left"
    setDirection(next === 'register' ? 'right' : 'left');
    prevModeRef.current = mode;
    setMode(next);
    setAnimKey(k => k + 1);
  };

  const switchLoginView = (v: 'login' | 'forgot') => {
    setDirection(v === 'forgot' ? 'right' : 'left');
    setLoginView(v);
    setAnimKey(k => k + 1);
  };

  const isRegister = mode === 'register';
  const isForgot = !isRegister && loginView === 'forgot';

  const headerTitle = isRegister
    ? registerStep === 1 ? 'Crea tu cuenta' : 'Tus intereses'
    : isForgot
    ? 'Recuperar contraseña'
    : 'Bienvenido de vuelta';

  const headerSubtitle = isRegister
    ? registerStep === 1
      ? 'Únete a la comunidad y empieza a trackear tu cultura.'
      : 'Elige qué tipos de contenido quieres seguir.'
    : isForgot
    ? 'Te enviaremos un enlace para restablecer tu contraseña.'
    : 'Inicia sesión para acceder a tu vault personal.';

  const slideInClass = direction === 'right' ? 'auth-slide-in-right' : 'auth-slide-in-left';

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950">
      <style>{`
        @keyframes authSlideInRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes authSlideInLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .auth-slide-in-right {
          animation: authSlideInRight 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .auth-slide-in-left {
          animation: authSlideInLeft 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-fade-up {
          animation: authFadeUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <SeoHead
        title="Iniciar sesión o registrarse — Vaultly"
        description="Accede a tu cuenta de Vaultly o crea una nueva para empezar a trackear tu consumo cultural."
        canonical="/auth"
        noIndex
      />

      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20dark%20cinematic%20collage%20of%20film%20reels%20books%20vinyl%20records%20game%20controllers%20and%20anime%20art%20arranged%20in%20a%20beautiful%20grid%20pattern%20with%20deep%20violet%20and%20rose%20gradient%20overlay%20on%20dark%20background%20moody%20atmospheric%20editorial%20photography%20style&width=800&height=1000&seq=auth-bg-01&orientation=portrait"
          alt="Vaultly background"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/80 via-violet-950/60 to-zinc-950/90"></div>
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
              <i className="ri-archive-2-line text-white"></i>
            </div>
            <span className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Vaultly
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center gap-10">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Tu universo cultural,<br />
                <span className="bg-gradient-to-r from-violet-400 to-rose-400 bg-clip-text text-transparent">
                  todo en un vault.
                </span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
                Trackea películas, series, libros, videojuegos, anime y mucho más. Comparte tu perfil y descubre qué están consumiendo tus amigos.
              </p>
            </div>

            <div className="flex gap-8">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 max-w-sm">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => (
                  <i key={i} className="ri-star-fill text-amber-400 text-xs"></i>
                ))}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic">
                &ldquo;{SHOWCASE[showcaseIdx].quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {SHOWCASE[showcaseIdx].avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{SHOWCASE[showcaseIdx].author}</p>
                  <p className="text-zinc-500 text-xs">{SHOWCASE[showcaseIdx].role}</p>
                </div>
              </div>
              <div className="flex gap-1.5 mt-4">
                {SHOWCASE.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setShowcaseIdx(i)}
                    className={`h-1 rounded-full transition-all cursor-pointer ${i === showcaseIdx ? 'w-5 bg-violet-400' : 'w-1.5 bg-zinc-600'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-zinc-600 text-xs">
            © 2026 Vaultly · <Link to="/privacy" rel="nofollow" className="hover:text-zinc-400 transition-colors">Privacidad</Link> · <Link to="/terms" rel="nofollow" className="hover:text-zinc-400 transition-colors">Términos</Link>
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col w-full lg:w-[480px] flex-shrink-0 relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 cursor-pointer lg:invisible">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
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

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-6">

          {/* Animated header */}
          <div key={`header-${animKey}-${registerStep}`} className={`mb-6 auth-fade-up`}>
            {isForgot && (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
                  <i className="ri-lock-password-line text-violet-500 text-xs"></i>
                </div>
                <span className="text-xs text-zinc-500">Recuperación de contraseña</span>
              </div>
            )}

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {headerTitle}
            </h1>
            <p className="text-sm text-zinc-500">{headerSubtitle}</p>
            {(!isRegister || registerStep === 1) && !isForgot && (
              <p className="text-xs text-zinc-400 mt-2">
                Los campos marcados con <span className="text-rose-500 font-semibold">*</span> son obligatorios.
              </p>
            )}
          </div>

          {/* Toggle tabs — hidden when in forgot view or register step 2 */}
          {!isForgot && !(isRegister && registerStep === 2) && (
            <div className="flex bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-1 mb-6">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  !isRegister
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isRegister
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Animated form container */}
          <div key={`form-${animKey}`} className={slideInClass}>
            {isRegister
              ? <RegisterForm
                  onSwitch={() => switchMode('login')}
                  onStepChange={s => setRegisterStep(s)}
                />
              : <LoginForm onSwitch={() => switchMode('register')} onViewChange={switchLoginView} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
