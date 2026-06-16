/**
 * Función Edge: item-reports
 *
 * Endpoint encargado de gestionar la operación serverless asociada dentro del backend de Vaultly.
 *
 * Flujo:
 * 1. Identifica al solicitante.
 * 2. Valida permisos según operación.
 * 3. Crea, consulta o actualiza reportes.
 * 4. Aplica restricciones de visibilidad.
 * 5. Devuelve el resultado normalizado.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, clientIdentifier, publicError, safeText } from '../_shared/security.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
};

/**
 * Construye respuestas JSON para el módulo de reportes.
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
 * Identifica al usuario solicitante y si tiene permisos de administración.
 *
 * @param req Petición HTTP con token opcional.
 * @param db Cliente Supabase de servicio.
 * @returns Identificador de usuario y marca de administración.
 */
async function getRequester(req: Request, db: ReturnType<typeof createClient>) {
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

  return { userId, isAdmin: data?.role === 'admin' && data?.status === 'active', isActive: data?.status === 'active' };
}

/**
 * Valida si un identificador tiene formato UUID antes de usarlo como item_id.
 *
 * @param value Identificador recibido por API.
 * @returns Verdadero cuando el valor puede compararse como UUID.
 */
function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const url = new URL(req.url);

  try {
    const requester = await getRequester(req, supabase);
    const identifier = clientIdentifier(req, requester.userId);
    const rateLimit = requester.userId ? 10 : 3;
    const allowed = await checkRateLimit(supabase, 'item-reports', identifier, rateLimit, 600);
    if (!allowed) return jsonResponse({ error: 'Too many requests' }, 429);

    if (req.method === 'POST') {
      if (requester.userId && !requester.isActive) return jsonResponse({ error: 'Account is not active' }, 403);

      const body = await req.json().catch(() => ({}));
      const item_id = safeText(body.item_id, 180);
      const item_title = safeText(body.item_title, 200);
      const item_category = safeText(body.item_category, 30);
      const item_cover = safeText(body.item_cover, 500);
      const reason = safeText(body.reason, 80);
      const details = safeText(body.details, 1000);

      if (!item_id || !item_title || !reason) {
        return jsonResponse({ error: 'Missing required fields: item_id, item_title, reason' }, 400);
      }

      const { data, error } = await supabase
        .from('item_reports')
        .insert({
          item_id: typeof item_id === 'string' && isUuid(item_id) ? item_id : null,
          item_slug: item_id,
          item_title,
          item_category,
          item_cover,
          reason,
          details: details || null,
          user_id: requester.userId ?? null,
          status: 'pending',
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('item-reports insert error:', error);
        return jsonResponse(publicError(), 500);
      }
      return jsonResponse({ success: true, report: data }, 201);
    }

    if (req.method === 'GET') {
      const status = safeText(url.searchParams.get('status'), 20);
      const itemId = safeText(url.searchParams.get('item_id'), 180);

      let query = supabase
        .from('item_reports')
        .select('id, item_id, item_slug, item_title, item_category, item_cover, reason, details, status, created_at, resolved_at, resolved_note')
        .order('created_at', { ascending: false });

      if (itemId) {
        query = isUuid(itemId)
          ? query.or(`item_id.eq.${itemId},item_slug.eq.${itemId}`)
          : query.eq('item_slug', itemId);
      }

      if (!requester.isAdmin) {
        if (!itemId) return jsonResponse({ error: 'Admin access required' }, 403);
        query = query.in('status', ['resolved', 'dismissed']);
      }

      if (status && status !== 'all') {
        if (!['pending', 'resolved', 'dismissed'].includes(status)) return jsonResponse({ error: 'Invalid status' }, 400);
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        console.error('item-reports select error:', error);
        return jsonResponse(publicError(), 500);
      }

      const reports = (data ?? []).map((report) => ({
        ...report,
        reported_at: report.created_at,
      }));

      return jsonResponse({ reports });
    }

    if (req.method === 'PATCH') {
      if (!requester.isAdmin) return jsonResponse({ error: 'Admin access required' }, 403);

      const body = await req.json().catch(() => ({}));
      const id = safeText(body.id, 36);
      const status = safeText(body.status, 20);
      const resolved_note = safeText(body.resolved_note, 1000);

      if (!id || !status) return jsonResponse({ error: 'Missing required fields: id, status' }, 400);
      if (!['pending', 'resolved', 'dismissed'].includes(status)) {
        return jsonResponse({ error: 'Invalid status' }, 400);
      }

      const updatePayload: Record<string, unknown> = { status };
      if (status === 'resolved' || status === 'dismissed') {
        updatePayload.resolved_at = new Date().toISOString();
        updatePayload.resolved_note = resolved_note || null;
      }

      const { data, error } = await supabase
        .from('item_reports')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('item-reports update error:', error);
        return jsonResponse(publicError(), 500);
      }
      return jsonResponse({ success: true, report: data });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch (err) {
    console.error('item-reports error:', err);
    return jsonResponse(publicError(), 500);
  }
});
