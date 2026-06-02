import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getRequester(req: Request, db: ReturnType<typeof createClient>) {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return { userId: null, isAdmin: false };

  const { data: userData } = await db.auth.getUser(token);
  const userId = userData.user?.id ?? null;
  if (!userId) return { userId: null, isAdmin: false };

  const { data } = await db
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  return { userId, isAdmin: data?.role === 'admin' };
}

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

    if (req.method === 'POST') {
      const body = await req.json();
      const { item_id, item_title, item_category, item_cover, reason, details, reported_by } = body;

      if (!item_id || !item_title || !reason) {
        return jsonResponse({ error: 'Missing required fields: item_id, item_title, reason' }, 400);
      }

      const { data, error } = await supabase
        .from('item_reports')
        .insert({
          item_id: typeof item_id === 'string' && isUuid(item_id) ? item_id : null,
          item_slug: String(item_id),
          item_title,
          item_category: item_category ?? '',
          item_cover: item_cover ?? '',
          reason,
          details: details ?? null,
          user_id: requester.userId ?? reported_by ?? null,
          status: 'pending',
        })
        .select()
        .maybeSingle();

      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ success: true, report: data }, 201);
    }

    if (req.method === 'GET') {
      const status = url.searchParams.get('status');
      const itemId = url.searchParams.get('item_id');

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

      if (status && status !== 'all') query = query.eq('status', status);

      const { data, error } = await query;
      if (error) return jsonResponse({ error: error.message }, 500);

      const reports = (data ?? []).map((report) => ({
        ...report,
        reported_at: report.created_at,
      }));

      return jsonResponse({ reports });
    }

    if (req.method === 'PATCH') {
      if (!requester.isAdmin) return jsonResponse({ error: 'Admin access required' }, 403);

      const body = await req.json();
      const { id, status, resolved_note } = body;

      if (!id || !status) return jsonResponse({ error: 'Missing required fields: id, status' }, 400);
      if (!['pending', 'resolved', 'dismissed'].includes(status)) {
        return jsonResponse({ error: 'Invalid status' }, 400);
      }

      const updatePayload: Record<string, unknown> = { status };
      if (status === 'resolved' || status === 'dismissed') {
        updatePayload.resolved_at = new Date().toISOString();
        updatePayload.resolved_note = resolved_note ?? null;
      }

      const { data, error } = await supabase
        .from('item_reports')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ success: true, report: data });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
