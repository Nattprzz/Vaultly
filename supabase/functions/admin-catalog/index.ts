/**
 * Función Edge: admin-catalog
 *
 * Endpoint encargado de gestionar la operación serverless asociada dentro del backend de Vaultly.
 *
 * Flujo:
 * 1. Valida permisos de administrador.
 * 2. Determina el método HTTP solicitado.
 * 3. Ejecuta la operación de catálogo correspondiente.
 * 4. Devuelve una respuesta JSON normalizada.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

const VALID_CATEGORIES = ['videojuegos', 'peliculas', 'series', 'libros', 'conciertos'];

/**
 * Construye respuestas JSON para operaciones administrativas.
 *
 * @param body Cuerpo serializable de la respuesta.
 * @param status Código HTTP de salida.
 * @returns Respuesta HTTP con cabeceras CORS.
 */
function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Comprueba que la petición pertenece a un usuario con rol administrador.
 *
 * @param req Petición HTTP con token Bearer.
 * @param db Cliente Supabase de servicio.
 * @returns Verdadero cuando el perfil tiene rol admin.
 */
async function requireAdmin(req: Request, db: ReturnType<typeof createClient>) {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;

  const { data: userData } = await db.auth.getUser(token);
  const userId = userData.user?.id;
  if (!userId) return false;

  const { data } = await db
    .from('profiles')
    .select('role, status')
    .eq('id', userId)
    .maybeSingle();

  return data?.role === 'admin' && data?.status === 'active';
}

/**
 * Genera un slug único para elementos creados manualmente desde administración.
 *
 * @param title Título visible del elemento.
 * @param category Categoría persistida en catálogo.
 * @returns Slug con categoría y marca temporal.
 */
function toSlug(title: string, category: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${category}-${base}-${Date.now()}`;
}

/**
 * Valida URLs externas editadas desde administracion.
 *
 * @param value Valor candidato.
 * @returns URL http/https normalizada o undefined.
 */
function externalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Convierte un valor desconocido en lista unica de URLs validas.
 *
 * @param value Valor recibido en metadata.
 * @returns URLs limpias para persistencia.
 */
function urlArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(externalUrl).filter(Boolean) as string[])];
}

/**
 * Normaliza trailers para que el admin pueda editar JSON sin romper consumidores.
 *
 * @param value Lista candidata de trailers.
 * @returns Trailers validos.
 */
function normalizeTrailers(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const trailer = item as Record<string, unknown>;
      const url = externalUrl(trailer.url);
      if (!url) return null;
      const source = ['youtube', 'vimeo', 'igdb', 'other'].includes(String(trailer.source))
        ? String(trailer.source)
        : 'other';
      return {
        ...(typeof trailer.title === 'string' && trailer.title.trim() ? { title: trailer.title.trim() } : {}),
        url,
        ...(externalUrl(trailer.thumbnail_url) ? { thumbnail_url: externalUrl(trailer.thumbnail_url) } : {}),
        source,
      };
    })
    .filter(Boolean);
}

/**
 * Ajusta metadata de videojuegos manteniendo compatibilidad con JSON antiguo.
 *
 * @param metadata Metadata enviada por el panel admin.
 * @param category Categoria persistida.
 * @returns Metadata preparada para catalog_items.
 */
function normalizeMetadata(metadata: unknown, category: string) {
  const raw = metadata && typeof metadata === 'object' ? metadata as Record<string, unknown> : {};
  if (category !== 'videojuegos') return raw;

  const interactiveMapUrl = externalUrl(raw.interactive_map_url);
  return {
    ...raw,
    screenshots: urlArray(raw.screenshots),
    artworks: urlArray(raw.artworks),
    trailers: normalizeTrailers(raw.trailers),
    ...(interactiveMapUrl ? { interactive_map_url: interactiveMapUrl } : {}),
    ...(typeof raw.interactive_map_source === 'string' && raw.interactive_map_source.trim()
      ? { interactive_map_source: raw.interactive_map_source.trim() }
      : {}),
  };
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

    // ─── Operaciones principales: listar catálogo administrativo ───────────────
    if (method === 'GET') {
      const category = url.searchParams.get('category') ?? '';
      const search = url.searchParams.get('search') ?? '';
      const page = parseInt(url.searchParams.get('page') ?? '1', 10);
      const limit = 30;
      const from = (page - 1) * limit;
      const to = page * limit - 1;

      let query = db
        .from('catalog_items')
        .select('id, title, slug, category, source, source_item_id, description, image_url, release_date, metadata, created_at', { count: 'exact' })
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

    // ─── Operaciones principales: crear elemento administrativo ────────────────
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
          metadata: normalizeMetadata(metadata, category),
        })
        .select('*')
        .maybeSingle();

      if (error) throw error;

      return jsonResponse({ data }, 201);
    }

    // ─── Operaciones principales: actualizar elemento administrativo ───────────
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

      let metadataCategory = category;
      if (metadata !== undefined && !metadataCategory) {
        const { data: existing } = await db
          .from('catalog_items')
          .select('category')
          .eq('id', id)
          .maybeSingle();
        metadataCategory = existing?.category;
      }

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (title !== undefined) updates.title = title.trim();
      if (category !== undefined) updates.category = category;
      if (description !== undefined) updates.description = description?.trim() ?? null;
      if (image_url !== undefined) updates.image_url = image_url?.trim() ?? null;
      if (release_date !== undefined) updates.release_date = release_date ?? null;
      if (metadata !== undefined) updates.metadata = normalizeMetadata(metadata, metadataCategory ?? '');

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

    // ─── Operaciones principales: eliminar elemento administrativo ─────────────
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
