import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_CATEGORIES = ['videojuegos', 'peliculas', 'series', 'libros', 'conciertos'];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function requireAdmin(req: Request, db: ReturnType<typeof createClient>) {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;

  const { data: userData } = await db.auth.getUser(token);
  const userId = userData.user?.id;
  if (!userId) return false;

  const { data } = await db
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  return data?.role === 'admin';
}

function toSlug(title: string, category: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${category}-${base}-${Date.now()}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const url = new URL(req.url);
  const method = req.method;

  try {
    if (!(await requireAdmin(req, db))) {
      return jsonResponse({ error: 'Admin access required' }, 403);
    }

    // ── GET /admin-catalog — list items ──────────────────────────────
    if (method === 'GET') {
      const category = url.searchParams.get('category') ?? '';
      const search = url.searchParams.get('search') ?? '';
      const page = parseInt(url.searchParams.get('page') ?? '1', 10);
      const limit = 30;
      const from = (page - 1) * limit;
      const to = page * limit - 1;

      let query = db
        .from('catalog_items')
        .select('id, title, slug, category, source, source_item_id, image_url, release_date, metadata, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (category && VALID_CATEGORIES.includes(category)) {
        query = query.eq('category', category);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return jsonResponse({ data, count, page, limit });
    }

    // ── POST /admin-catalog — create item ─────────────────────────────
    if (method === 'POST') {
      const body = await req.json();
      const { title, category, description, image_url, release_date, metadata } = body;

      if (!title || !category) {
        return jsonResponse({ error: 'title and category are required' }, 400);
      }

      if (!VALID_CATEGORIES.includes(category)) {
        return jsonResponse({ error: `Invalid category. Valid: ${VALID_CATEGORIES.join(', ')}` }, 400);
      }

      const slug = toSlug(title, category);
      const source_item_id = `manual-${Date.now()}`;

      const { data, error } = await db
        .from('catalog_items')
        .insert({
          title: title.trim(),
          category,
          slug,
          source: 'manual',
          source_item_id,
          description: description?.trim() ?? null,
          image_url: image_url?.trim() ?? null,
          release_date: release_date ?? null,
          metadata: metadata ?? {},
        })
        .select('*')
        .maybeSingle();

      if (error) throw error;

      return jsonResponse({ data }, 201);
    }

    // ── PATCH /admin-catalog — update item ────────────────────────────
    if (method === 'PATCH') {
      const id = url.searchParams.get('id');
      if (!id) {
        return jsonResponse({ error: 'id is required' }, 400);
      }

      const body = await req.json();
      const { title, category, description, image_url, release_date, metadata } = body;

      if (category && !VALID_CATEGORIES.includes(category)) {
        return jsonResponse({ error: 'Invalid category' }, 400);
      }

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (title !== undefined) updates.title = title.trim();
      if (category !== undefined) updates.category = category;
      if (description !== undefined) updates.description = description?.trim() ?? null;
      if (image_url !== undefined) updates.image_url = image_url?.trim() ?? null;
      if (release_date !== undefined) updates.release_date = release_date ?? null;
      if (metadata !== undefined) updates.metadata = metadata ?? {};

      const { data, error } = await db
        .from('catalog_items')
        .update(updates)
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return jsonResponse({ error: 'Item not found' }, 404);
      }

      return jsonResponse({ data });
    }

    // ── DELETE /admin-catalog — delete item ───────────────────────────
    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        return jsonResponse({ error: 'id is required' }, 400);
      }

      const { error } = await db.from('catalog_items').delete().eq('id', id);
      if (error) throw error;

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);

  } catch (err) {
    console.error('admin-catalog error:', err);
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
