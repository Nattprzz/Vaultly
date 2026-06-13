import type { GameCompanyRef, NormalizedCatalogItem } from './types.ts';
import { compact, requireEnv, stripHtml, toSourceSlug } from './utils.ts';

const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const IGDB_API_BASE = 'https://api.igdb.com/v4';

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

export async function igdbRequest(endpoint: string, body: string) {
  const { clientId, token } = await getIgdbToken();
  const res = await fetch(`${IGDB_API_BASE}/${endpoint.replace(/^\/+/, '')}`, {
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

export function igdbImageUrl(imageId?: string | null, size = 't_cover_big') {
  return imageId ? `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg` : null;
}

function releaseDate(timestamp?: number | null) {
  return timestamp ? new Date(timestamp * 1000).toISOString().slice(0, 10) : null;
}

function safeCompanySlug(name: string, slug?: string | null) {
  const value = slug || name;
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'unknown-company';
}

function companyNames(game: any, flag: 'developer' | 'publisher') {
  return compact((game.involved_companies ?? [])
    .filter((item: any) => item?.[flag])
    .map((item: any) => item.company?.name));
}

function companyRefs(game: any, flag: 'developer' | 'publisher'): GameCompanyRef[] {
  const seen = new Set<number | string>();
  return compact((game.involved_companies ?? [])
    .filter((item: any) => item?.[flag] && item.company?.name)
    .map((item: any) => {
      const company = item.company;
      const slug = safeCompanySlug(company.name, company.slug);
      const key = company.id ?? slug;
      if (seen.has(key)) return null;
      seen.add(key);
      return {
        igdb_id: company.id ?? null,
        name: company.name,
        slug,
        url: `/company/${slug}`,
      };
    }));
}

function regionalReleaseDates(game: any) {
  const out = {
    north_america: null as string | null,
    europe: null as string | null,
    japan: null as string | null,
  };

  (game.release_dates ?? []).forEach((item: any) => {
    const date = releaseDate(item.date);
    if (!date) return;
    if (item.region === 2 && !out.north_america) out.north_america = date;
    if (item.region === 1 && !out.europe) out.europe = date;
    if (item.region === 5 && !out.japan) out.japan = date;
  });

  return out;
}

function normalizeGame(game: any): NormalizedCatalogItem {
  const ratingCount = game.total_rating_count ?? null;

  return {
    source: 'igdb',
    source_item_id: String(game.id),
    title: game.name ?? 'Unknown',
    slug: toSourceSlug('games', game.id),
    description: stripHtml(game.summary),
    image_url: igdbImageUrl(game.cover?.image_id),
    release_date: releaseDate(game.first_release_date),
    metadata: {
      rating: game.total_rating != null ? Math.round(Number(game.total_rating) / 10) : null,
      rating_count: ratingCount,
      genres: compact((game.genres ?? []).map((genre: any) => genre.name)),
      platforms: compact((game.platforms ?? []).map((platform: any) => platform.name)),
      developers: companyNames(game, 'developer'),
      publishers: companyNames(game, 'publisher'),
      developer_companies: companyRefs(game, 'developer'),
      publisher_companies: companyRefs(game, 'publisher'),
      game_modes: compact((game.game_modes ?? []).map((mode: any) => mode.name)),
      release_dates: regionalReleaseDates(game),
      achievements_count: null,
      igdb_slug: game.slug ?? null,
      language: 'original',
    },
  };
}

export async function searchIgdbGames(query: string, page = 1, limit = 20): Promise<NormalizedCatalogItem[]> {
  if (!query.trim()) return [];
  const offset = Math.max(page - 1, 0) * limit;
  const body = `
    search "${query.replace(/"/g, '\\"')}";
    fields name,slug,summary,cover.image_id,genres.name,platforms.name,game_modes.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.id,involved_companies.company.name,involved_companies.company.slug,release_dates.region,release_dates.date,first_release_date,total_rating,total_rating_count;
    limit ${limit};
    offset ${offset};
  `;
  const games = await igdbRequest('games', body);
  return (games ?? []).map(normalizeGame);
}

export async function getIgdbGame(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const body = `
    fields name,slug,summary,cover.image_id,genres.name,platforms.name,game_modes.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.id,involved_companies.company.name,involved_companies.company.slug,release_dates.region,release_dates.date,first_release_date,total_rating,total_rating_count;
    where id = ${Number(sourceId)};
    limit 1;
  `;
  const games = await igdbRequest('games', body);
  return games?.[0] ? normalizeGame(games[0]) : null;
}
