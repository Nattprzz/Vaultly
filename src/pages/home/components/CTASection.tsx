import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 px-4 md:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(37,99,235,0.10),transparent)]" />

      <div className="relative mx-auto max-w-xl text-center">
        <h2
          className="mb-4 text-4xl font-black leading-[1.08] tracking-tight text-white md:text-5xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Dentro de 10 años,<br />
          <span className="text-blue-400">querrás tener este historial.</span>
        </h2>
        <p className="mb-10 max-w-sm mx-auto text-[16px] leading-relaxed text-zinc-500">
          Cada título que terminas hoy es un recuerdo que puedes recuperar mañana.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <Link
              to="/tracker"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-blue-500"
            >
              Ir a mi Tracker <i className="ri-arrow-right-line" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-blue-500"
            >
              Empezar gratis <i className="ri-arrow-right-line" />
            </Link>
          )}
          <Link
            to="/catalog"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-[15px] font-semibold text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            Explorar catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
