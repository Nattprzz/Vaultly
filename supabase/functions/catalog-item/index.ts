import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getGoogleBook } from '../_shared/api/googleBooks.ts';
import { getIgdbGame } from '../_shared/api/igdb.ts';
import { getTicketmasterEvent } from '../_shared/api/ticketmaster.ts';
import { getTmdbMovie, getTmdbSeries } from '../_shared/api/tmdb.ts';

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

function extractEntities(category: string, metadata: any): EntityInput[] {
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

async function upsertEntities(db: any, itemId: string, category: string, metadata: any) {
  const inputs = extractEntities(category, metadata);
  if (!inputs.length) return { linked: 0 };

  const seen = new Set<string>();
  const unique = inputs.filter(entity => {
    const key = `${entity.name}|${entity.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const { data: entities, error: entityError } = await db
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

  if (entityError) {
    console.error('Entity upsert error:', entityError);
    return { linked: 0 };
  }
  if (!entities?.length) return { linked: 0 };

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
    const { error: relationError } = await db
      .from('item_entities')
      .upsert(relations, { onConflict: 'item_id,entity_id,role' });
    if (relationError) console.error('item_entities upsert error:', relationError);
  }

  return { linked: relations.length };
}

async function fetchExternalItem(category: string, sourceId: string) {
  if (category === 'games') return getIgdbGame(sourceId);
  if (category === 'movies') return getTmdbMovie(sourceId);
  if (category === 'series') return getTmdbSeries(sourceId);
  if (category === 'books') return getGoogleBook(sourceId);
  if (category === 'concerts') return getTicketmasterEvent(sourceId);
  return null;
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const category = url.searchParams.get('category');
    const sourceId = url.searchParams.get('source_id');
    const forceSync = url.searchParams.get('force_sync') === '1';

    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    if (!forceSync) {
      let cacheQuery = db.from('catalog_items').select('*');
      if (slug) cacheQuery = cacheQuery.eq('slug', slug);
      else if (sourceId) cacheQuery = cacheQuery.eq('source_item_id', sourceId);
      else {
        return new Response(JSON.stringify({ error: 'Provide slug or source_id' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: cached } = await cacheQuery.maybeSingle();

      if (cached) {
        const { count } = await db
          .from('item_entities')
          .select('*', { count: 'exact', head: true })
          .eq('item_id', cached.id);

        if ((count ?? 0) === 0 && cached.source !== 'manual') {
          const cat = Object.entries(CATEGORY_ENUM).find(([, value]) => value === cached.category)?.[0];
          if (cat) upsertEntities(db, cached.id, cat, cached.metadata).catch(console.error);
        }

        return new Response(JSON.stringify({ data: cached, source: 'cache' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    let resolvedCategory = category;
    if (!resolvedCategory && slug) {
      const prefix = slug.split('-')[0];
      const catMap: Record<string, string> = {
        games: 'games',
        movies: 'movies',
        series: 'series',
        books: 'books',
        concerts: 'concerts',
      };
      resolvedCategory = catMap[prefix] ?? null;
    }

    if (!resolvedCategory) {
      return new Response(JSON.stringify({ error: 'category required for external fetch' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const effectiveSourceId = sourceId ?? slug?.replace(/^[a-z]+-/, '') ?? '';
    const item = await fetchExternalItem(resolvedCategory, effectiveSourceId);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Not found or unsupported category' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dbCategory = CATEGORY_ENUM[resolvedCategory];
    const { data: upserted, error: upsertError } = await db
      .from('catalog_items')
      .upsert({ ...item, category: dbCategory }, { onConflict: 'category,source,source_item_id' })
      .select('*')
      .maybeSingle();

    if (upsertError) throw upsertError;

    let entityStats = { linked: 0 };
    if (upserted?.id) {
      entityStats = await upsertEntities(db, upserted.id, resolvedCategory, item.metadata);
    }

    return new Response(JSON.stringify({ data: upserted, source: 'external_cached', entities_linked: entityStats.linked }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('catalog-item error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
