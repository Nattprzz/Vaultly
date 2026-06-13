import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getIgdbCompanyBySlug, toCompanySlug } from '../_shared/api/igdbCompanies.ts';
import type { NormalizedGameCompany } from '../_shared/api/types.ts';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isFresh(lastSyncedAt?: string | null) {
  if (!lastSyncedAt) return false;
  return Date.now() - new Date(lastSyncedAt).getTime() < CACHE_TTL_MS;
}

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

async function fetchCachedCompany(db: any, slug: string) {
  const { data, error } = await db
    .from('game_companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(req.url);
  const slugParam = url.searchParams.get('slug');
  const forceSync = url.searchParams.get('force_sync') === '1';
  const slug = toCompanySlug(slugParam);

  if (!slug) {
    return json({ error: 'slug is required' }, 400);
  }

  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

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

    return json({ error: message }, 500);
  }
});
