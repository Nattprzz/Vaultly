/**
 * Función Edge: search-anime
 *
 * Endpoint encargado de gestionar la operación serverless asociada dentro del backend de Vaultly.
 *
 * Flujo:
 * 1. Normaliza el tipo solicitado.
 * 2. Lee término y paginación.
 * 3. Consulta AniList.
 * 4. Normaliza medios al contrato común.
 * 5. Devuelve resultados JSON.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { searchAniListMedia } from '../_shared/api/anilist.ts';
import { checkRateLimit, clientIdentifier, publicError, safeText } from '../_shared/security.ts';

// ─── Tipos ─────────────────────────────────────────────────────────────
import type { AniListMediaType } from '../_shared/api/types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Normaliza el tipo de medio aceptado por AniList.
 *
 * @param value Valor recibido desde query string.
 * @returns Tipo AniList soportado por la integración.
 */
function normalizeType(value: string | null): AniListMediaType {
  return value?.toUpperCase() === 'MANGA' ? 'MANGA' : 'ANIME';
}

function parseStrictPage(value: string | null) {
  const raw = value ?? '1';
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  return Number.isInteger(page) && page >= 1 && page <= 25 ? page : null;
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
    const rawQuery = url.searchParams.get('query') ?? '';
    if (rawQuery.length > 120) {
      return new Response(JSON.stringify({ error: 'query is too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const query = safeText(rawQuery, 120);
    const type = normalizeType(url.searchParams.get('type'));
    const page = parseStrictPage(url.searchParams.get('page'));

    if (!query || !page) {
      return new Response(JSON.stringify({ error: 'query and valid page are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const allowed = await checkRateLimit(db, 'search-anime', clientIdentifier(req), 30, 60);
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await searchAniListMedia(query, type, page);

    return new Response(JSON.stringify({ data, source: 'anilist' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('search-anime error:', err);
    return new Response(JSON.stringify(publicError()), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
