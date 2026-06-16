/**
 * SeoHead.tsx — gestión imperativa de etiquetas SEO en el head del documento.
 *
 * Actualiza dinámicamente el título, las metas de descripción, Open Graph,
 * Twitter Card y los scripts JSON-LD al montar o cuando cambian las props.
 * Al desmontarse restaura el título genérico de la aplicación.
 * Se usa en cada página para asegurar que los crawlers y los previsualizadores
 * de redes sociales reciban el contexto correcto de cada ruta.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { useEffect } from 'react';

// ─── Utilidades ───────────────────────────────────────────────────────────────

import { getSiteUrl } from '@/lib/site';
import { VAULTLY_LOGO_SRC } from '@/components/branding/Logo';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface SeoHeadProps {
  /** Título de la página — se establece como document.title y og:title */
  title: string;
  /** Descripción meta — se usa para description, og:description y twitter:description */
  description: string;
  /** Palabras clave opcionales para la meta keywords */
  keywords?: string;
  /** Ruta canónica relativa (p.ej. '/catalog/peliculas'); se convierte en URL absoluta */
  canonical?: string;
  /** Tipo de objeto Open Graph (por defecto 'website') */
  ogType?: string;
  /** URL de imagen para og:image y twitter:image; si no se especifica usa el logo oficial */
  ogImage?: string;
  /** Objeto o array de objetos JSON-LD para schema.org */
  jsonLd?: object | object[];
  /** Si true, añade robots noindex, nofollow */
  noIndex?: boolean;
}

// ─── Componente ──────────────────────────────────────────────────────────────

/**
 * Componente sin renderizado que gestiona las etiquetas del head.
 *
 * Crea o actualiza etiquetas meta existentes en lugar de duplicarlas,
 * identificándolas por su selector de atributo name/property.
 * Los scripts JSON-LD se identifican con data-seo-jsonld para poder
 * reemplazarlos en navegaciones entre páginas.
 */
export default function SeoHead({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage,
  jsonLd,
  noIndex = false,
}: SeoHeadProps) {
  const siteUrl = getSiteUrl();
  const resolvedCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const resolvedImage = ogImage ?? `${siteUrl}${VAULTLY_LOGO_SRC}`;

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('="');
        el.setAttribute(attrName, attrVal.replace('"', ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    if (keywords) setMeta('meta[name="keywords"]', 'content', keywords);
    setMeta('meta[name="robots"]', 'content', noIndex ? 'noindex, nofollow' : 'index, follow');

    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = resolvedCanonical;

    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:url"]', 'content', resolvedCanonical);
    setMeta('meta[property="og:image"]', 'content', resolvedImage);

    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', resolvedImage);

    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]');
    existingScripts.forEach(s => s.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.title = 'Vaultly - Trackea películas, series, libros, videojuegos y conciertos';
    };
  }, [title, description, keywords, resolvedCanonical, ogType, resolvedImage, noIndex, jsonLd]);

  return null;
}
