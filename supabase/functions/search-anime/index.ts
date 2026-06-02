import { searchAniListMedia } from '../_shared/api/anilist.ts';
import type { AniListMediaType } from '../_shared/api/types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function normalizeType(value: string | null): AniListMediaType {
  return value?.toUpperCase() === 'MANGA' ? 'MANGA' : 'ANIME';
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const type = normalizeType(url.searchParams.get('type'));
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    if (!query) {
      return new Response(JSON.stringify({ error: 'query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await searchAniListMedia(query, type, page);

    return new Response(JSON.stringify({ data, source: 'anilist' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('search-anime error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
