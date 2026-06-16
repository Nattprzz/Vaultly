/**
 * Función Edge: auth-by-username
 *
 * Resuelve el login cuando el usuario introduce un nombre de usuario
 * en lugar de un email. El email asociado al username se busca con el
 * service role (que bypasea RLS) y nunca se devuelve al cliente.
 * La sesión se genera server-side con el cliente anon y se retorna al
 * cliente para que la hidrate con setSession.
 *
 * Seguridad:
 * - El email nunca aparece en la respuesta al cliente.
 * - Cualquier fallo devuelve el mismo mensaje genérico (anti-enumeración).
 * - Solo acepta POST.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const GENERIC_ERROR = 'Credenciales incorrectas.';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password || typeof identifier !== 'string' || typeof password !== 'string') {
      return jsonResponse({ error: GENERIC_ERROR }, 401);
    }

    // ─── Resolver username → email (service role, bypasea RLS) ────────────────

    const serviceDb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: profile } = await serviceDb
      .from('profiles')
      .select('email')
      .eq('username', identifier.trim().toLowerCase())
      .eq('status', 'active')
      .maybeSingle();

    if (!profile?.email) {
      return jsonResponse({ error: GENERIC_ERROR }, 401);
    }

    // ─── Autenticar con el email resuelto (cliente anon, genera sesión válida) ─

    const anonDb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await anonDb.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (error || !data.session) {
      return jsonResponse({ error: GENERIC_ERROR }, 401);
    }

    // ─── Devolver solo los tokens, nunca el email ──────────────────────────────

    return jsonResponse({
      session: {
        access_token:  data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in:    data.session.expires_in,
        token_type:    data.session.token_type,
      },
    });

  } catch {
    return jsonResponse({ error: GENERIC_ERROR }, 401);
  }
});
