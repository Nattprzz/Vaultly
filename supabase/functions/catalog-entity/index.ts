import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    const slug = url.searchParams.get('slug') ?? '';
    const id = url.searchParams.get('id') ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = 20;

    if (!slug && !id) {
      return new Response(JSON.stringify({ error: 'Provide slug or id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── 1. Fetch entity ────────────────────────────────────────────────
    const entityQuery = db.from('entities').select('*');

    const { data: entity, error: entityError } = await (
      slug ? entityQuery.eq('slug', slug) : entityQuery.eq('id', id)
    ).maybeSingle();

    if (entityError || !entity) {
      return new Response(JSON.stringify({ error: 'Entity not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 2. Fetch related items (JOIN) ─────────────────────────────────
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data: relations, error: relError } = await db
      .from('item_entities')
      .select(`
        role,
        catalog_items (
          id,
          slug,
          title,
          image_url,
          release_date,
          metadata,
          category,
          source,
          source_item_id
        )
      `)
      .eq('entity_id', entity.id)
      .order('release_date', { foreignTable: 'catalog_items', ascending: false })
      .range(from, to);

    if (relError) {
      console.error('Relations error:', relError);
    }

    // ── 3. Transform items ────────────────────────────────────────────
    const items = (relations ?? []).map((r: any) => ({
      role: r.role,
      ...r.catalog_items,
    }));

    // ── 4. Stats ──────────────────────────────────────────────────────

    // ratings
    const ratings = items
      .map(i => i.metadata?.rating)
      .filter((r: number) => typeof r === 'number');

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : null;

    const bestRating = ratings.length > 0 ? Math.max(...ratings) : null;
    const worstRating = ratings.length > 0 ? Math.min(...ratings) : null;

    // categorías
    const byCategory: Record<string, number> = {};

    for (const item of items) {
      const cat = item.category;
      if (!cat) continue;
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }

    // ── 5. Respuesta final ────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        entity,
        items,
        stats: {
          total_items: items.length,
          avg_rating: avgRating,
          best_rating: bestRating,
          worst_rating: worstRating,
          by_category: byCategory,
        },
        pagination: {
          page,
          limit,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (err) {
    console.error('catalog-entity error:', err);

    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});