/**
 * home/page.tsx — landing page de Vaultly.
 *
 * Renderiza la página de inicio con seis secciones secuenciales y un footer.
 * Inyecta datos estructurados schema.org (WebSite + Organization) para SEO.
 * Es la única página pública sin Sidebar; usa Navbar en su lugar.
 */

// ─── Router ───────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// ─── Componentes ──────────────────────────────────────────────────────────────

import Navbar from '@/components/feature/Navbar';
import SeoHead from '@/components/feature/SeoHead';
import { LogoMark, VAULTLY_LOGO_SRC } from '@/components/branding/Logo';
import HeroSection from './components/HeroSection';
import ActivitySection from './components/ActivitySection';
import CollectionSection from './components/CollectionSection';
import ContinueSection from './components/ContinueSection';
import WhySection from './components/WhySection';
import CTASection from './components/CTASection';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { getSiteUrl } from '@/lib/site';

// ─── Datos estructurados ─────────────────────────────────────────────────────

/**
 * Genera el JSON-LD de la página de inicio.
 * Incluye WebSite con SearchAction apuntando al catálogo y Organization.
 */
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
      logo: `${siteUrl}${VAULTLY_LOGO_SRC}`,
      sameAs: [],
    },
  ];
}

// ─── Componente ──────────────────────────────────────────────────────────────

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

      {/* 1 · Hero — producto primero, no marketing */}
      <HeroSection />

      {/* 2 · Activity — "Tu historia se construye sola" */}
      <ActivitySection />

      {/* 3 · Collection — cuadrícula densa de pósters, fondo oscuro */}
      <CollectionSection />

      {/* 4 · Continue — ítems en progreso con barras de avance */}
      <ContinueSection />

      {/* 5 · Why — comparativa (después de ver el producto) */}
      <WhySection />

      {/* 6 · CTA — cierre minimalista */}
      <CTASection />

      <footer className="bg-zinc-900 dark:bg-black py-10 px-4 md:px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <LogoMark size={17} />
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
