import type { NormalizedCatalogItem } from './types.ts';
import { compact, requireEnv, stripHtml, toSourceSlug } from './utils.ts';

const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const IGDB_GAMES_URL = 'https://api.igdb.com/v4/games';

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getIgdbToken() {
  const clientId = requireEnv('IGDB_CLIENT_ID');
  const clientSecret = requireEnv('IGDB_CLIENT_SECRET');

  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return { clientId, token: tokenCache.token };
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  const res = await fetch(TWITCH_TOKEN_URL, { method: 'POST', body });
  if (!res.ok) throw new Error(`IGDB OAuth error: ${res.status}`);

  const json = await res.json();
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + Number(json.expires_in ?? 3600) * 1000,
  };

  return { clientId, token: tokenCache.token };
}

async function igdbRequest(body: string) {
  const { clientId, token } = await getIgdbToken();
  const res = await fetch(IGDB_GAMES_URL, {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (!res.ok) throw new Error(`IGDB error: ${res.status}`);
  return res.json();
}

function coverUrl(imageId?: string | null) {
  return imageId ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg` : null;
}

function releaseDate(timestamp?: number | null) {
  return timestamp ? new Date(timestamp * 1000).toISOString().slice(0, 10) : null;
}

function normalizeGame(game: any): NormalizedCatalogItem {
  return {
    source: 'igdb',
    source_item_id: String(game.id),
    title: game.name ?? 'Unknown',
    slug: toSourceSlug('games', game.id),
    description: stripHtml(game.summary),
    image_url: coverUrl(game.cover?.image_id),
    release_date: releaseDate(game.first_release_date),
    metadata: {
      rating: game.total_rating != null ? Math.round(Number(game.total_rating) / 10) : null,
      ratings_count: game.total_rating_count ?? null,
      genres: compact((game.genres ?? []).map((genre: any) => genre.name)),
      platforms: compact((game.platforms ?? []).map((platform: any) => platform.name)),
      developers: [],
      publishers: [],
      igdb_slug: game.slug ?? null,
    },
  };
}

export async function searchIgdbGames(query: string, page = 1, limit = 20): Promise<NormalizedCatalogItem[]> {
  if (!query.trim()) return [];
  const offset = Math.max(page - 1, 0) * limit;
  const body = `
    search "${query.replace(/"/g, '\\"')}";
    fields name,slug,summary,cover.image_id,genres.name,platforms.name,first_release_date,total_rating,total_rating_count;
    limit ${limit};
    offset ${offset};
  `;
  const games = await igdbRequest(body);
  return (games ?? []).map(normalizeGame);
}

export async function getIgdbGame(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const body = `
    fields name,slug,summary,cover.image_id,genres.name,platforms.name,first_release_date,total_rating,total_rating_count;
    where id = ${Number(sourceId)};
    limit 1;
  `;
  const games = await igdbRequest(body);
  return games?.[0] ? normalizeGame(games[0]) : null;
}
