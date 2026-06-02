import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { searchGoogleBooks } from '../_shared/api/googleBooks.ts';
import { searchIgdbGames } from '../_shared/api/igdb.ts';
import { searchTicketmasterEvents } from '../_shared/api/ticketmaster.ts';
import { searchTmdbMovies, searchTmdbSeries } from '../_shared/api/tmdb.ts';

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

interface EntityInput {
  name: string;
  type: string;
  role: string;
}

function toEntitySlug(name: string, type: string): string {
  return `${name}-${type}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function upsertEntities(db: any, itemId: string, inputs: EntityInput[]) {
  if (!inputs.length) return;

  const seen = new Set<string>();
  const unique = inputs.filter(entity => {
    const key = `${entity.name}|${entity.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const { data: entities } = await db
    .from('entities')
    .upsert(
      unique.map(entity => ({
        name: entity.name,
        type: entity.type,
        slug: toEntitySlug(entity.name, entity.type),
      })),
      { onConflict: 'slug' },
    )
    .select('id, name, type');

  if (!entities?.length) return;

  const idMap = new Map<string, string>();
  entities.forEach((entity: any) => idMap.set(`${entity.name}|${entity.type}`, entity.id));

  const relSeen = new Set<string>();
  const relations = inputs
    .map(entity => {
      const entityId = idMap.get(`${entity.name}|${entity.type}`);
      if (!entityId) return null;
      const key = `${itemId}|${entityId}|${entity.role}`;
      if (relSeen.has(key)) return null;
      relSeen.add(key);
      return { item_id: itemId, entity_id: entityId, role: entity.role };
    })
    .filter(Boolean);

  if (relations.length) {
    await db.from('item_entities').upsert(relations, { onConflict: 'item_id,entity_id,role' });
  }
}

function buildEntityInputs(category: string, metadata: any): EntityInput[] {
  const out: EntityInput[] = [];
  if (category === 'games') {
    (metadata.developers ?? []).forEach((name: string) => name && out.push({ name, type: 'developer', role: 'developer' }));
    (metadata.publishers ?? []).forEach((name: string) => name && out.push({ name, type: 'publisher', role: 'publisher' }));
  }
  if (category === 'movies') {
    if (metadata.director) out.push({ name: metadata.director, type: 'director', role: 'director' });
    (metadata.cast ?? []).forEach((name: string) => name && out.push({ name, type: 'actor', role: 'actor' }));
  }
  if (category === 'series') {
    (metadata.creators ?? []).forEach((name: string) => name && out.push({ name, type: 'creator', role: 'creator' }));
    (metadata.cast ?? []).forEach((name: string) => name && out.push({ name, type: 'actor', role: 'actor' }));
  }
  if (category === 'books') {
    (metadata.authors ?? []).forEach((name: string) => name && out.push({ name, type: 'author', role: 'author' }));
  }
  if (category === 'concerts') {
    (metadata.artists ?? []).forEach((name: string) => name && out.push({ name, type: 'artist', role: 'artist' }));
  }
  return out;
}

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
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const query = url.searchParams.get('query');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = 20;

    if (!category || !query) {
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

    const { data: cached } = await db
      .from('catalog_items')
      .select('id, slug, title, image_url, release_date, metadata, source, source_item_id')
      .eq('category', dbCategory)
      .ilike('title', `%${query}%`)
      .order('release_date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (cached && cached.length > 0) {
      return new Response(JSON.stringify({ data: cached, source: 'cache' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const items = await fetchExternalItems(category, query, page);
    if (!items.length) {
      return new Response(JSON.stringify({ data: [], source: 'external' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rows = items.map(item => ({ ...item, category: dbCategory }));
    const { data: upserted, error: upsertError } = await db
      .from('catalog_items')
      .upsert(rows, { onConflict: 'category,source,source_item_id' })
      .select('id, slug, title, image_url, release_date, metadata, source, source_item_id');

    if (upsertError) throw upsertError;

    if (upserted?.length) {
      const entityWork = upserted.map((item: any) => {
        const original = items.find(sourceItem => sourceItem.source_item_id === item.source_item_id);
        if (!original) return Promise.resolve();
        const inputs = buildEntityInputs(category, original.metadata);
        if (!inputs.length) return Promise.resolve();
        return upsertEntities(db, item.id, inputs).catch(console.error);
      });
      Promise.all(entityWork).catch(console.error);
    }

    return new Response(JSON.stringify({ data: upserted ?? items, source: 'external_cached' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('catalog-search error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
