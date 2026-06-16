/**
 * Función Edge: catalog-entity
 *
 * Endpoint encargado de gestionar la operación serverless asociada dentro del backend de Vaultly.
 *
 * Flujo:
 * 1. Lee el slug de entidad solicitado.
 * 2. Consulta la entidad en base de datos.
 * 3. Recupera obras relacionadas mediante joins.
 * 4. Calcula métricas agregadas.
 * 5. Devuelve el detalle normalizado.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, clientIdentifier, parsePage, publicError, safeText } from '../_shared/security.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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

    const slug = safeText(url.searchParams.get('slug'), 120);
    const id = safeText(url.searchParams.get('id'), 36);
    const page = parsePage(url.searchParams.get('page'), 50);
    const limit = 20;

    if ((!slug && !id) || !page) {
      return new Response(JSON.stringify({ error: 'Provide slug or id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const allowed = await checkRateLimit(db, 'catalog-entity', clientIdentifier(req), 60, 60);
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Operaciones principales: obtener entidad ──────────────────────────────
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

    // ─── Operaciones principales: obtener obras relacionadas ───────────────────
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

    // ─── Helpers: transformar obras relacionadas ───────────────────────────────
    const items = (relations ?? []).map((r: any) => ({
      role: r.role,
      ...r.catalog_items,
    }));

    // ─── Helpers: calcular estadísticas de entidad ─────────────────────────────

    // Métricas de valoración usadas para resumir recepción de las obras.
    const ratings = items
      .map(i => i.metadata?.rating)
      .filter((r: number) => typeof r === 'number');

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : null;

    const bestRating = ratings.length > 0 ? Math.max(...ratings) : null;
    const worstRating = ratings.length > 0 ? Math.min(...ratings) : null;

    // Distribución de categorías para mostrar el alcance de la entidad.
    const byCategory: Record<string, number> = {};

    for (const item of items) {
      const cat = item.category;
      if (!cat) continue;
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }

    // ─── Exportaciones: respuesta final ───────────────────────────────────────
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
      JSON.stringify(publicError()),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
