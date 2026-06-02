import { useEffect } from 'react';
import { getSiteUrl } from '@/lib/site';

interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: object | object[];
  noIndex?: boolean;
}

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
  const resolvedImage = ogImage ?? `${siteUrl}/og-image.png`;

  useEffect(() => {
    // Title
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

    // Canonical
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = resolvedCanonical;

    // OG tags
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:url"]', 'content', resolvedCanonical);
    setMeta('meta[property="og:image"]', 'content', resolvedImage);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', resolvedImage);

    // JSON-LD
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
      // Restore default title on unmount
      document.title = 'Vaultly - Trackea películas, series, libros, videojuegos y anime';
    };
  }, [title, description, keywords, resolvedCanonical, ogType, resolvedImage, noIndex, jsonLd]);

  return null;
}
