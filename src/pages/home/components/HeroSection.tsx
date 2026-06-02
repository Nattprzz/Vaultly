import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function HeroSection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20dark%20cinematic%20background%20bokeh%20lights%20film%20grain%20moody%20atmosphere%20deep%20dark%20tones%20artistic%20photography%20ultra%20wide%20panoramic&width=1920&height=1080&seq=hero-bg-01&orientation=landscape"
          alt="Vaultly hero background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>
      </div>

      {/* Floating cards decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-8 md:left-16 w-28 h-40 rounded-xl overflow-hidden opacity-30 rotate-[-8deg] hidden lg:block">
          <img src="https://readdy.ai/api/search-image?query=epic%20video%20game%20controller%20neon%20glow%20dark%20background%20cinematic%20lighting%20purple%20tones%20ultra%20detailed%20artistic%20render&width=112&height=160&seq=deco-g1&orientation=portrait" alt="" className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute top-1/3 right-8 md:right-16 w-24 h-36 rounded-xl overflow-hidden opacity-25 rotate-[6deg] hidden lg:block">
          <img src="https://readdy.ai/api/search-image?query=cinematic%20movie%20reel%20film%20strip%20dramatic%20lighting%20dark%20moody%20atmosphere%20red%20tones%20artistic%20photography&width=96&height=144&seq=deco-m1&orientation=portrait" alt="" className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute bottom-1/3 left-24 w-20 h-32 rounded-xl overflow-hidden opacity-20 rotate-[4deg] hidden lg:block">
          <img src="https://readdy.ai/api/search-image?query=stack%20of%20books%20library%20warm%20lighting%20cozy%20atmosphere%20green%20tones%20bokeh%20background%20artistic%20photography&width=80&height=128&seq=deco-b1&orientation=portrait" alt="" className="w-full h-full object-cover object-top" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full text-center px-4 md:px-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Tu catálogo personal de cultura y entretenimiento
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Todo lo que<br />
          <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
            consumes,
          </span>
          <br />organizado.
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
          Videojuegos, películas, series, libros y conciertos. Lleva el control de todo lo que has visto, jugado, leído y vivido en un solo lugar.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-white text-zinc-900 font-semibold text-base hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Ir a mi Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              className="px-8 py-3.5 rounded-xl bg-white text-zinc-900 font-semibold text-base hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Empieza gratis
            </Link>
          )}
          <Link
            to="/catalog"
            className="px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            Explorar catálogo
          </Link>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
          {[
            { icon: 'ri-gamepad-line', label: 'Videojuegos', color: '#8b5cf6' },
            { icon: 'ri-film-line', label: 'Películas', color: '#f43f5e' },
            { icon: 'ri-tv-2-line', label: 'Series', color: '#f59e0b' },
            { icon: 'ri-book-open-line', label: 'Libros', color: '#10b981' },
            { icon: 'ri-music-2-line', label: 'Conciertos', color: '#0ea5e9' },
          ].map(cat => (
            <div
              key={cat.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-sm"
            >
              <i className={cat.icon} style={{ color: cat.color }}></i>
              {cat.label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <i className="ri-arrow-down-line text-xl"></i>
      </div>
    </section>
  );
}
