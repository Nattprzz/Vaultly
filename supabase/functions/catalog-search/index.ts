/**
 * Función Edge: catalog-search
 *
 * Endpoint encargado de gestionar la operación serverless asociada dentro del backend de Vaultly.
 *
 * Flujo:
 * 1. Valida categoría y texto de búsqueda.
 * 2. Busca coincidencias en caché local.
 * 3. Consulta el proveedor externo si la caché es insuficiente.
 * 4. Normaliza la categoría de respuesta.
 * 5. Devuelve origen y resultados.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Servicios ─────────────────────────────────────────────────────────
import { searchGoogleBooks } from '../_shared/api/googleBooks.ts';
import { searchIgdbGames } from '../_shared/api/igdb.ts';
import { searchTicketmasterEvents } from '../_shared/api/ticketmaster.ts';
import { searchTmdbMovies, searchTmdbSeries } from '../_shared/api/tmdb.ts';
import { checkRateLimit, clientIdentifier, parsePage, publicError, safeText } from '../_shared/security.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORY_ENUM: Record<string, string> = {
  games: 'videojuegos',
  movies: 'peliculas',
  series: 'series',
  books: 'libros',
  concerts: 'conciertos',
};

/**
 * Despacha la búsqueda al proveedor externo correspondiente a la categoría.
 *
 * @param category Categoría de API solicitada.
 * @param query Texto buscado por el usuario.
 * @param page Página de resultados externa.
 * @returns Lista normalizada de elementos o lista vacía.
 */
async function fetchExternalItems(category: string, query: string, page: number) {
  if (category === 'games') return searchIgdbGames(query, page);
  if (category === 'movies') return searchTmdbMovies(query, page);
  if (category === 'series') return searchTmdbSeries(query, page);
  if (category === 'books') return searchGoogleBooks(query, page);
  if (category === 'concerts') return searchTicketmasterEvents({ keyword: query, page });
  return [];
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const category = safeText(url.searchParams.get('category'), 20);
    const query = safeText(url.searchParams.get('query'), 120);
    const page = parsePage(url.searchParams.get('page'), 25);
    const limit = 20;

    if (!category || !query || !page) {
      return new Response(JSON.stringify({ error: 'category and query are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dbCategory = CATEGORY_ENUM[category];
    if (!dbCategory) {
      return new Response(JSON.stringify({ error: `Unknown category: ${category}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const allowed = await checkRateLimit(db, 'catalog-search', clientIdentifier(req), 30, 60);
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const normalizedQuery = query.replace(/[^a-zA-Z0-9\s._:-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalizedQuery) {
      return new Response(JSON.stringify({ error: 'query is invalid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const cachePattern = `%${normalizedQuery}%`;

    const { data: cached } = await db
      .from('catalog_items')
      .select('id, slug, title, image_url, release_date, metadata, source, source_item_id')
      .eq('category', dbCategory)
      .or(`title.ilike.${cachePattern},slug.ilike.${cachePattern},source_item_id.ilike.${cachePattern}`)
      .order('release_date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    const minimumCacheResults = page === 1 ? 5 : 1;
    if (cached && cached.length >= minimumCacheResults) {
      return new Response(JSON.stringify({ data: cached, source: 'cache' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const items = await fetchExternalItems(category, normalizedQuery, page);
    if (!items.length) {
      return new Response(JSON.stringify({ data: cached ?? [], source: cached?.length ? 'cache' : 'external' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      data: items.map(item => ({ ...item, category: dbCategory })),
      source: 'external',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('catalog-search error:', err);
    return new Response(JSON.stringify(publicError()), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
