/**
 * auth/page.tsx — página de autenticación (login, registro y recuperación).
 *
 * Gestiona tres flujos en un mismo componente: inicio de sesión, registro
 * (con dos pasos) y recuperación de contraseña. Las transiciones entre
 * flujos usan animaciones CSS directas (slide-in derecha/izquierda) para
 * evitar dependencias externas. El panel izquierdo muestra contenido
 * contextual que cambia según el modo activo.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link, useSearchParams, useNavigate } from 'react-router-dom';

// ─── Componentes ──────────────────────────────────────────────────────────────

import SeoHead from '@/components/feature/SeoHead';
import { LogoMark } from '@/components/branding/Logo';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { isPasswordRecoveryPending, PASSWORD_RECOVERY_ROUTE } from '@/lib/passwordRecovery';

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Ítems de ejemplo que se muestran en el panel izquierdo en modo login. */
const LEFT_LOGIN = [
  { text: 'Cyberpunk 2077 · Completado',  color: '#22c55e' },
  { text: 'Breaking Bad · En progreso',    color: '#f97316' },
  { text: 'Dune · Pendiente',             color: '#64748b' },
];

/** Ítems de ejemplo que se muestran en el panel izquierdo en modo registro. */
const LEFT_REGISTER = [
  { text: 'Añade tu primer título',  color: '#0553EB' },
  { text: 'Marca tu progreso',       color: '#0553EB' },
  { text: 'Guarda tus favoritos',    color: '#0553EB' },
];

// ─── Componente ──────────────────────────────────────────────────────────────

export default function AuthPage() {
  // ─── Estado ─────────────────────────────────────────────────────────────────

  const { isLoggedIn, profile, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [loginView, setLoginView] = useState<'login' | 'forgot'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const resetSuccess = searchParams.get('reset') === 'success';

  // ─── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoggedIn || loading) return;

    if (isPasswordRecoveryPending()) {
      navigate(PASSWORD_RECOVERY_ROUTE, { replace: true });
      return;
    }

    navigate(profile?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  }, [isLoggedIn, loading, profile, navigate]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const switchMode = (next: 'login' | 'register') => {
    if (next === mode) return;
    setDirection(next === 'register' ? 'right' : 'left');
    setMode(next);
    setAnimKey(k => k + 1);
  };

  const switchLoginView = (v: 'login' | 'forgot') => {
    setDirection(v === 'forgot' ? 'right' : 'left');
    setLoginView(v);
    setAnimKey(k => k + 1);
  };

  // ─── Datos derivados ─────────────────────────────────────────────────────────

  const isRegister = mode === 'register';
  const isForgot = !isRegister && loginView === 'forgot';

  const headerTitle = isRegister
    ? 'Crea tu cuenta'
    : isForgot
    ? 'Recuperar contraseña'
    : 'Inicia sesión';

  const headerSubtitle = isForgot
    ? 'Introduce tu email y te enviamos un enlace de recuperación.'
    : '';

  const slideInClass = direction === 'right' ? 'auth-slide-in-right' : 'auth-slide-in-left';

  // ─── Renderizado ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex bg-[var(--surface)] dark:bg-[var(--bg)]">
      <style>{`
        @keyframes authSlideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes authSlideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .auth-slide-in-right { animation: authSlideInRight 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .auth-slide-in-left  { animation: authSlideInLeft  0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-fade-up { animation: authFadeUp 0.24s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes leftFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .left-fade { animation: leftFade 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <SeoHead
        title="Acceder — Vaultly"
        description="Inicia sesión o crea una cuenta en Vaultly."
        canonical="/auth"
        noIndex
      />

      {/* ── Panel izquierdo — ambiente, no protagonista ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        {/* Fondo oscuro sin dependencias externas */}
        <div className="absolute inset-0 bg-[#0A0F1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(5,83,235,0.10),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_80%,rgba(1,23,65,0.80),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-10 py-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer w-fit">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0553EB' }}>
              <LogoMark size={20} />
            </div>
            <span
              className="font-bold text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Vaultly
            </span>
          </Link>

          {/* Contenido contextual — cambia con el modo */}
          <div key={mode} className="left-fade flex-1 flex flex-col justify-center">
            <h2
              className="text-2xl font-bold text-white leading-snug tracking-tight mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {!isRegister
                ? 'Tu colección, siempre contigo.'
                : 'Empieza tu historial cultural.'}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-[280px]">
              {!isRegister
                ? 'Vuelve a tus películas, juegos, libros y series justo donde las dejaste.'
                : 'Guarda lo que ves, juegas, lees y escuchas desde el primer día.'}
            </p>

            {/* Lista minimalista — 3 ítems sin tarjetas */}
            <div className="flex flex-col gap-2.5">
              {(!isRegister ? LEFT_LOGIN : LEFT_REGISTER).map(item => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-[13px] text-zinc-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie de página */}
          <p className="text-zinc-700 text-xs">
            © 2026 Vaultly ·{' '}
            <Link to="/privacy" rel="nofollow" className="hover:text-zinc-500 transition-colors">
              Privacidad
            </Link>
            {' '}·{' '}
            <Link to="/terms" rel="nofollow" className="hover:text-zinc-500 transition-colors">
              Términos
            </Link>
          </p>
        </div>
      </div>

      {/* ── Panel derecho — el formulario es el protagonista ── */}
      <div className="flex flex-col w-full lg:w-[460px] flex-shrink-0">
        {/* Barra superior */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-transparent lg:border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2 cursor-pointer lg:invisible">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <LogoMark size={17} />
            </div>
            <span
              className="font-bold text-zinc-900 dark:text-white text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Vaultly
            </span>
          </Link>
          <button
            onClick={toggleTheme}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <i className={theme === 'dark' ? 'ri-sun-line text-sm' : 'ri-moon-line text-sm'} />
          </button>
        </div>

        {/* Área del formulario — centrada verticalmente */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-8">

          {/* Cabecera animada — re-monta con animKey para disparar la animación */}
          <div key={`header-${animKey}-${registerStep}`} className="mb-5 auth-fade-up">
            <h1
              className="text-[1.375rem] font-bold text-zinc-900 dark:text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {headerTitle}
            </h1>
            {headerSubtitle && (
              <p className="text-sm text-zinc-500 mt-1">{headerSubtitle}</p>
            )}
          </div>

          {/* Pestañas de modo — ocultas en recuperación y paso 2 del registro */}
          {resetSuccess && !isForgot && !isRegister && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              <i className="ri-shield-check-line mt-0.5 flex-shrink-0"></i>
              <p>Contraseña actualizada. Inicia sesión de nuevo.</p>
            </div>
          )}

          {!isForgot && !(isRegister && registerStep === 2) && (
            <div className="flex bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-1 mb-5">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  !isRegister
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isRegister
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Formulario con animación de slide */}
          <div key={`form-${animKey}`} className={slideInClass}>
            {isRegister
              ? <RegisterForm
                  onSwitch={() => switchMode('login')}
                  onStepChange={s => setRegisterStep(s)}
                />
              : isForgot
              ? <ForgotPasswordForm
                  onBack={() => switchLoginView('login')}
                />
              : <LoginForm
                  onSwitch={() => switchMode('register')}
                  onViewChange={switchLoginView}
                />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
