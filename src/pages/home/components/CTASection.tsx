import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const { isLoggedIn } = useAuth();
  return (
    <section className="py-24 px-4 md:px-6 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Tu cultura, tu vault.
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10">
          Únete a miles de personas que ya llevan el control de todo lo que consumen. Gratis, siempre.
        </p>
        {isLoggedIn ? (
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-base hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
            Ir a mi Dashboard <i className="ri-arrow-right-line"></i>
          </Link>
        ) : (
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-base hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
            Crear cuenta gratis <i className="ri-arrow-right-line"></i>
          </Link>
        )}
      </div>
    </section>
  );
}
