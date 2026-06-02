import Navbar from '@/components/feature/Navbar';
import SeoHead from '@/components/feature/SeoHead';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedSection from './components/FeaturedSection';
import StatsSection from './components/StatsSection';
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
    description: 'Plataforma cultural todo-en-uno para trackear películas, series, libros, videojuegos y anime.',
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
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <SeoHead
        title="Vaultly - Trackea películas, series, libros, videojuegos y anime"
        description="Vaultly es tu plataforma cultural todo-en-uno. Trackea películas, series, libros, videojuegos, anime y más. Descubre, organiza y comparte tu consumo cultural con la comunidad."
        keywords="tracker cultural, películas, series, libros, videojuegos, anime, Vaultly"
        canonical="/"
        jsonLd={getHomeJsonLd()}
      />
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <StatsSection />
      <CTASection />
      <footer className="bg-zinc-900 dark:bg-black py-10 px-4 md:px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
              <i className="ri-archive-2-line text-white text-xs"></i>
            </div>
            <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Vaultly</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 Vaultly. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-zinc-500 text-sm">
            <a href="/privacy" rel="nofollow" className="hover:text-white transition-colors cursor-pointer">Privacidad</a>
            <a href="/terms" rel="nofollow" className="hover:text-white transition-colors cursor-pointer">Términos</a>
            <a href="/contact" rel="nofollow" className="hover:text-white transition-colors cursor-pointer">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
