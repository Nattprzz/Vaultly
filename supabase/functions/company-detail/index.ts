/**
 * Función Edge: company-detail
 *
 * Endpoint encargado de devolver información completa de compañías de videojuegos.
 *
 * Flujo:
 * 1. Busca en caché.
 * 2. Valida expiración.
 * 3. Consulta IGDB si es necesario.
 * 4. Normaliza la respuesta.
 * 5. Actualiza caché.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Servicios ─────────────────────────────────────────────────────────
import { getIgdbCompanyBySlug, toCompanySlug } from '../_shared/api/igdbCompanies.ts';
import { checkRateLimit, clientIdentifier, publicError, safeText } from '../_shared/security.ts';

// ─── Tipos ─────────────────────────────────────────────────────────────
import type { NormalizedGameCompany } from '../_shared/api/types.ts';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Construye respuestas JSON con cabeceras CORS homogéneas.
 *
 * @param body Cuerpo serializable de la respuesta.
 * @param status Código HTTP que debe devolverse.
 * @returns Respuesta HTTP lista para la Edge Function.
 */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Comprueba si una fila de caché sigue dentro de la ventana de sincronización.
 *
 * @param lastSyncedAt Fecha ISO de la última sincronización.
 * @returns Verdadero cuando el registro puede reutilizarse sin consultar IGDB.
 */
function isFresh(lastSyncedAt?: string | null) {
  if (!lastSyncedAt) return false;
  return Date.now() - new Date(lastSyncedAt).getTime() < CACHE_TTL_MS;
}

/**
 * Convierte una fila de game_companies al contrato público normalizado.
 *
 * @param row Registro devuelto por Supabase.
 * @returns Compañía preparada para la respuesta de la API.
 */
function rowToCompany(row: any): NormalizedGameCompany {
  return {
    id: row.id,
    igdb_id: row.igdb_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    logo_url: row.logo_url,
    country: row.country,
    status: row.status,
    started: row.start_date,
    parent_company: row.parent_company_id || row.parent_company_name ? {
      id: row.parent_company_id,
      name: row.parent_company_name,
    } : null,
    company_size: row.company_size,
    stats: {
      developed: row.developed_count ?? 0,
      published: row.published_count ?? 0,
      ported: row.ported_count ?? 0,
      supported: row.supported_count ?? 0,
      dlcs: row.dlc_count ?? 0,
      cancelled: row.cancelled_count ?? 0,
      average_rating: row.average_rating == null ? null : Number(row.average_rating),
      rating_count: row.rating_count ?? 0,
    },
    popular_games: row.popular_games ?? [],
    related_companies: row.related_companies ?? [],
    genres: row.genres ?? [],
    platforms: row.platforms ?? [],
    links: {
      website: row.website_url,
      twitter: row.twitter_url,
      discord: row.discord_url,
      wikipedia: row.wikipedia_url,
      linkedin: row.linkedin_url,
    },
    source: 'igdb',
    last_synced_at: row.last_synced_at,
  };
}

/**
 * Convierte una compañía normalizada al formato persistido en game_companies.
 *
 * @param company Compañía obtenida desde IGDB.
 * @returns Objeto compatible con upsert en Supabase.
 */
function companyToRow(company: NormalizedGameCompany) {
  return {
    igdb_id: company.igdb_id,
    slug: company.slug,
    name: company.name,
    description: company.description,
    logo_url: company.logo_url,
    country: company.country,
    status: company.status,
    start_date: company.started,
    changed_date: company.changed_date ?? null,
    parent_company_id: company.parent_company?.id ?? null,
    parent_company_name: company.parent_company?.name ?? null,
    company_size: company.company_size,
    website_url: company.links.website,
    twitter_url: company.links.twitter,
    discord_url: company.links.discord,
    wikipedia_url: company.links.wikipedia,
    linkedin_url: company.links.linkedin,
    developed_count: company.stats.developed,
    published_count: company.stats.published,
    ported_count: company.stats.ported,
    supported_count: company.stats.supported,
    dlc_count: company.stats.dlcs,
    cancelled_count: company.stats.cancelled,
    average_rating: company.stats.average_rating,
    rating_count: company.stats.rating_count,
    popular_games: company.popular_games,
    related_companies: company.related_companies,
    genres: company.genres,
    platforms: company.platforms,
    metadata: { source: 'igdb' },
    last_synced_at: new Date().toISOString(),
  };
}

/**
 * Busca una compañía por slug en la caché local.
 *
 * @param db Cliente Supabase con permisos de servicio.
 * @param slug Slug público de la compañía.
 * @returns Fila encontrada o null.
 */
async function fetchCachedCompany(db: any, slug: string) {
  const { data, error } = await db
    .from('game_companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getRequester(req: Request, db: any) {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return { userId: null, isAdmin: false };

  const { data: userData } = await db.auth.getUser(token);
  const userId = userData.user?.id ?? null;
  if (!userId) return { userId: null, isAdmin: false };

  const { data } = await db
    .from('profiles')
    .select('role, status')
    .eq('id', userId)
    .maybeSingle();

  return { userId, isAdmin: data?.role === 'admin' && data?.status === 'active' };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(req.url);
  const slugParam = safeText(url.searchParams.get('slug'), 120);
  const forceSyncRequested = url.searchParams.get('force_sync') === '1';
  const slug = toCompanySlug(slugParam);

  if (!slug) {
    return json({ error: 'slug is required' }, 400);
  }

  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const requester = await getRequester(req, db);
  const allowed = await checkRateLimit(db, 'company-detail', clientIdentifier(req, requester.userId), 20, 60);
  if (!allowed) return json({ error: 'Too many requests' }, 429);

  if (forceSyncRequested && !requester.isAdmin) {
    return json({ error: 'Admin access required' }, 403);
  }
  const forceSync = forceSyncRequested && requester.isAdmin;

  let cached: any = null;

  try {
    cached = await fetchCachedCompany(db, slug);

    if (cached && !forceSync && isFresh(cached.last_synced_at)) {
      return json(rowToCompany(cached));
    }

    console.info(`company-detail sync start slug=${slug}`);
    const external = await getIgdbCompanyBySlug(slug);

    if (!external) {
      return json({ error: 'Company not found' }, 404);
    }

    const { data: upserted, error: upsertError } = await db
      .from('game_companies')
      .upsert(companyToRow(external), { onConflict: 'igdb_id' })
      .select('*')
      .maybeSingle();

    if (upsertError) throw upsertError;

    console.info(`company-detail sync ok slug=${upserted?.slug ?? external.slug}`);
    return json(rowToCompany(upserted));
  } catch (err) {
    console.error('company-detail error:', (err as Error).message);

    if (cached) {
      return json(rowToCompany(cached));
    }

    const message = (err as Error).message;
    if (message.includes('IGDB error: 429')) {
      return json({ error: 'IGDB rate limit exceeded' }, 429);
    }

    return json(publicError(), 500);
  }
});
