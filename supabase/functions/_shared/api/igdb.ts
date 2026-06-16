/**
 * igdb.ts — cliente compartido de IGDB.
 *
 * Gestiona autenticación, consultas y normalización de videojuegos de IGDB.
 *
 * Utilizado por búsquedas, detalle de catálogo y funciones de compañías.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import type { GameCompanyRef, NormalizedCatalogItem } from './types.ts';

// ─── Servicios ─────────────────────────────────────────────────────────
import { compact, requireEnv, stripHtml, timedFetch, toSourceSlug } from './utils.ts';

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

  const res = await timedFetch(TWITCH_TOKEN_URL, { method: 'POST', body });
  if (!res.ok) throw new Error(`IGDB OAuth error: ${res.status}`);

  const json = await res.json();
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + Number(json.expires_in ?? 3600) * 1000,
  };

  return { clientId, token: tokenCache.token };
}

/**
 * Ejecuta una petición autenticada contra un endpoint de IGDB.
 *
 * @param endpoint Recurso de IGDB.
 * @param body Consulta APICalypse enviada a IGDB.
 * @returns Respuesta JSON cruda de IGDB.
 */
export async function igdbRequest(endpoint: string, body: string) {
  const { clientId, token } = await getIgdbToken();
  const res = await timedFetch(`${IGDB_API_BASE}/${endpoint.replace(/^\/+/, '')}`, {
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

/**
 * Construye una URL pública de imagen de IGDB.
 *
 * @param imageId Identificador de imagen.
 * @param size Tamaño solicitado por IGDB.
 * @returns URL de imagen o null.
 */
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

/**
 * Devuelve cadenas unicas y no vacias para evitar duplicados en arrays de metadata.
 *
 * @param values Valores candidatos procedentes de IGDB.
 * @returns Lista limpia preservando el orden original.
 */
function uniqueStrings(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  return values.filter((value): value is string => {
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Normaliza videos de IGDB al contrato de trailers usado por Vaultly.
 *
 * @param videos Lista cruda de videos de IGDB.
 * @returns Trailers con URL publica y miniatura cuando IGDB informa YouTube.
 */
function normalizeTrailers(videos: any[] = []) {
  const seen = new Set<string>();
  return compact(videos.map((video: any) => {
    const videoId = video?.video_id;
    if (!videoId || seen.has(videoId)) return null;
    seen.add(videoId);
    return {
      title: video.name ?? 'Trailer',
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      source: 'youtube' as const,
    };
  }));
}

/**
 * Normaliza enlaces externos sin intentar scrapear contenido.
 *
 * @param websites Enlaces devueltos por IGDB.
 * @returns Enlaces relevantes para ficha tecnica y administracion.
 */
function normalizeWebsites(websites: any[] = []) {
  return compact(websites.map((site: any) => {
    if (!site?.url) return null;
    return {
      category: site.category != null ? String(site.category) : undefined,
      url: String(site.url),
    };
  }));
}

/**
 * Devuelve el primer enlace que puede actuar como web principal del juego.
 *
 * @param websites Enlaces ya normalizados.
 * @returns URL principal o null.
 */
function primaryWebsite(websites: Array<{ category?: string; url: string }>) {
  return websites[0]?.url ?? null;
}

/**
 * Calcula una puntuacion simple para candidatos relacionados de IGDB.
 *
 * @param game Juego actual.
 * @param candidate Candidato relacionado devuelto por IGDB.
 * @returns Puntuacion y motivos de relacion.
 */
function scoreIgdbRelatedGame(game: any, candidate: any) {
  const reasons: string[] = [];
  let score = 0;

  const currentFranchise = game.franchise?.name ?? game.collection?.name ?? game.franchises?.[0]?.name ?? null;
  const candidateFranchise = candidate.franchise?.name ?? candidate.collection?.name ?? candidate.franchises?.[0]?.name ?? null;
  if (currentFranchise && candidateFranchise && currentFranchise === candidateFranchise) {
    score += 100;
    reasons.push('sameFranchise');
  }

  const currentTitle = String(game.name ?? '').toLowerCase();
  const candidateTitle = String(candidate.name ?? '').toLowerCase();
  const titleToken = currentTitle.split(/[\s:,-]+/).find((part) => part.length >= 4);
  if (titleToken && candidateTitle.includes(titleToken)) {
    score += 80;
    reasons.push('similarTitle');
  }

  const currentDevelopers = new Set(companyNames(game, 'developer'));
  const currentPublishers = new Set(companyNames(game, 'publisher'));
  if (companyNames(candidate, 'developer').some((name) => currentDevelopers.has(name))) {
    score += 70;
    reasons.push('sameDeveloper');
  }
  if (companyNames(candidate, 'publisher').some((name) => currentPublishers.has(name))) {
    score += 50;
    reasons.push('samePublisher');
  }

  const currentGenres = new Set((game.genres ?? []).map((genre: any) => genre.name).filter(Boolean));
  const sharedGenres = (candidate.genres ?? []).filter((genre: any) => currentGenres.has(genre.name)).length;
  if (sharedGenres > 0) {
    score += sharedGenres * 10;
    reasons.push('sharedGenres');
  }

  const currentThemes = new Set((game.themes ?? []).map((theme: any) => theme.name).filter(Boolean));
  const sharedThemes = (candidate.themes ?? []).filter((theme: any) => currentThemes.has(theme.name)).length;
  if (sharedThemes > 0) {
    score += sharedThemes * 8;
    reasons.push('sharedThemes');
  }

  const currentPlatforms = new Set((game.platforms ?? []).map((platform: any) => platform.name).filter(Boolean));
  const sharedPlatforms = (candidate.platforms ?? []).filter((platform: any) => currentPlatforms.has(platform.name)).length;
  if (sharedPlatforms > 0) {
    score += Math.min(sharedPlatforms, 5) * 3;
    reasons.push('sharedPlatforms');
  }

  const currentYear = game.first_release_date ? new Date(game.first_release_date * 1000).getUTCFullYear() : null;
  const candidateYear = candidate.first_release_date ? new Date(candidate.first_release_date * 1000).getUTCFullYear() : null;
  if (currentYear && candidateYear && Math.abs(currentYear - candidateYear) <= 5) {
    score += 5;
    reasons.push('sameReleaseEra');
  }

  return { score, reasons };
}

/**
 * Normaliza candidatos relacionados de IGDB y descarta relaciones debiles.
 *
 * @param game Juego actual con candidatos embebidos.
 * @returns Juegos relacionados ordenados por relevancia.
 */
function normalizeRelatedGames(game: any) {
  const candidates = [
    ...(game.similar_games ?? []),
    ...(game.franchise?.games ?? []),
    ...(game.collection?.games ?? []),
  ];
  const seen = new Set<number>();

  return compact(candidates.map((candidate: any) => {
    if (!candidate?.id || candidate.id === game.id || seen.has(candidate.id)) return null;
    seen.add(candidate.id);
    const scored = scoreIgdbRelatedGame(game, candidate);
    if (scored.score < 40) return null;
    return {
      source_item_id: String(candidate.id),
      slug: toSourceSlug('games', candidate.id),
      title: candidate.name ?? 'Unknown',
      image_url: igdbImageUrl(candidate.cover?.image_id),
      release_date: releaseDate(candidate.first_release_date),
      score: scored.score + (candidate.cover?.image_id ? 2 : 0),
      reasons: scored.reasons,
    };
  }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 12);
}

function normalizeGame(game: any): NormalizedCatalogItem {
  const ratingCount = game.total_rating_count ?? null;
  const screenshots = uniqueStrings((game.screenshots ?? []).map((item: any) => igdbImageUrl(item.image_id, 't_screenshot_big')));
  const artworks = uniqueStrings((game.artworks ?? []).map((item: any) => igdbImageUrl(item.image_id, 't_1080p')));
  const trailers = normalizeTrailers(game.videos ?? []);
  const websites = normalizeWebsites(game.websites ?? []);

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
      screenshots,
      artworks,
      trailers,
      websites,
      website: primaryWebsite(websites),
      themes: compact((game.themes ?? []).map((theme: any) => theme.name)),
      franchise_name: game.franchise?.name ?? game.collection?.name ?? game.franchises?.[0]?.name ?? null,
      related_games: normalizeRelatedGames(game),
      game_modes: compact((game.game_modes ?? []).map((mode: any) => mode.name)),
      release_dates: regionalReleaseDates(game),
      achievements_count: null,
      igdb_slug: game.slug ?? null,
      language: 'original',
    },
  };
}

/**
 * Busca videojuegos en IGDB y los normaliza para catálogo.
 *
 * @param query Texto de búsqueda.
 * @param page Página solicitada.
 * @param limit Tamaño máximo de página.
 * @returns Videojuegos normalizados.
 */
export async function searchIgdbGames(query: string, page = 1, limit = 20): Promise<NormalizedCatalogItem[]> {
  if (!query.trim()) return [];
  const offset = Math.max(page - 1, 0) * limit;
  const body = `
    search "${query.replace(/"/g, '\\"')}";
    fields name,slug,summary,cover.image_id,genres.name,themes.name,platforms.name,game_modes.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.id,involved_companies.company.name,involved_companies.company.slug,release_dates.region,release_dates.date,first_release_date,total_rating,total_rating_count,screenshots.image_id,artworks.image_id,videos.name,videos.video_id,websites.category,websites.url,franchise.name,franchises.name,collection.name,similar_games.id,similar_games.name,similar_games.slug,similar_games.cover.image_id,similar_games.first_release_date,similar_games.total_rating,similar_games.genres.name,similar_games.themes.name,similar_games.platforms.name,similar_games.involved_companies.developer,similar_games.involved_companies.publisher,similar_games.involved_companies.company.name,franchise.games.id,franchise.games.name,franchise.games.slug,franchise.games.cover.image_id,franchise.games.first_release_date,franchise.games.genres.name,franchise.games.themes.name,franchise.games.platforms.name,collection.games.id,collection.games.name,collection.games.slug,collection.games.cover.image_id,collection.games.first_release_date,collection.games.genres.name,collection.games.themes.name,collection.games.platforms.name;
    limit ${limit};
    offset ${offset};
  `;
  const games = await igdbRequest('games', body);
  return (games ?? []).map(normalizeGame);
}

/**
 * Obtiene un videojuego de IGDB por identificador externo.
 *
 * @param sourceId Identificador de IGDB.
 * @returns Videojuego normalizado o null.
 */
export async function getIgdbGame(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const body = `
    fields name,slug,summary,cover.image_id,genres.name,themes.name,platforms.name,game_modes.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.id,involved_companies.company.name,involved_companies.company.slug,release_dates.region,release_dates.date,first_release_date,total_rating,total_rating_count,screenshots.image_id,artworks.image_id,videos.name,videos.video_id,websites.category,websites.url,franchise.name,franchises.name,collection.name,similar_games.id,similar_games.name,similar_games.slug,similar_games.cover.image_id,similar_games.first_release_date,similar_games.total_rating,similar_games.genres.name,similar_games.themes.name,similar_games.platforms.name,similar_games.involved_companies.developer,similar_games.involved_companies.publisher,similar_games.involved_companies.company.name,franchise.games.id,franchise.games.name,franchise.games.slug,franchise.games.cover.image_id,franchise.games.first_release_date,franchise.games.genres.name,franchise.games.themes.name,franchise.games.platforms.name,collection.games.id,collection.games.name,collection.games.slug,collection.games.cover.image_id,collection.games.first_release_date,collection.games.genres.name,collection.games.themes.name,collection.games.platforms.name;
    where id = ${Number(sourceId)};
    limit 1;
  `;
  const games = await igdbRequest('games', body);
  return games?.[0] ? normalizeGame(games[0]) : null;
}
