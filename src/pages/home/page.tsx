import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import SeoHead from '@/components/feature/SeoHead';
import HeroSection from './components/HeroSection';
import ActivitySection from './components/ActivitySection';
import CollectionSection from './components/CollectionSection';
import ContinueSection from './components/ContinueSection';
import WhySection from './components/WhySection';
import CTASection from './components/CTASection';
import { getSiteUrl } from '@/lib/site';

function getHomeJsonLd() {
  const siteUrl = getSiteUrl();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Vaultly',
      url: siteUrl,
      description: 'Tu historial cultural completo en un único lugar.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/catalog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Vaultly',
      url: siteUrl,
      logo: `${siteUrl}/favicon.png`,
      sameAs: [],
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--surface)] dark:bg-[var(--bg)]">
      <SeoHead
        title="Vaultly — Todo lo que has visto, jugado, leído y escuchado"
        description="Tu historial cultural completo en un único lugar. Registra, puntúa y descubre videojuegos, películas, series, libros y conciertos."
        keywords="tracker cultural, películas, series, libros, videojuegos, conciertos, Vaultly"
        canonical="/"
        jsonLd={getHomeJsonLd()}
      />
      <Navbar />

      {/* 1 · Hero — product first, not marketing */}
      <HeroSection />

      {/* 2 · Activity — "Tu historia se construye sola" */}
      <ActivitySection />

      {/* 3 · Collection — dense poster grid, dark theater */}
      <CollectionSection />

      {/* 4 · Continue — in-progress items with progress bars */}
      <ContinueSection />

      {/* 5 · Why — comparison (after seeing the product) */}
      <WhySection />

      {/* 6 · CTA — minimal close */}
      <CTASection />

      <footer className="bg-zinc-900 dark:bg-black py-10 px-4 md:px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <i className="ri-archive-2-line text-white text-xs" />
            </div>
            <span
              className="font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Vaultly
            </span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 Vaultly. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-zinc-500 text-sm">
            <Link to="/privacy" rel="nofollow" className="hover:text-white transition-colors cursor-pointer">Privacidad</Link>
            <Link to="/terms" rel="nofollow" className="hover:text-white transition-colors cursor-pointer">Términos</Link>
            <Link to="/contact" rel="nofollow" className="hover:text-white transition-colors cursor-pointer">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
