import { supabase } from '@/lib/supabase';
import type { GameCompany, GameCompanyFacet, GameCompanyGame, RelatedGameCompany } from '@/types/gameCompany';

type RawCompanyRow = Record<string, unknown>;

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function nullableNumber(value: unknown): number | null {
  if (value == null || value === '') return null;
  const parsed = toNumber(value, NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function parseJsonMaybe(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

function arrayFrom(value: unknown): unknown[] {
  const parsed = parseJsonMaybe(value);
  if (Array.isArray(parsed)) return parsed;
  if (parsed == null || parsed === '') return [];
  if (typeof parsed === 'string') {
    return parsed
      .replace(/^\[|\]$/g, '')
      .split(/[|;,]/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [parsed];
}

function nameFrom(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (value && typeof value === 'object') {
    const item = value as Record<string, unknown>;
    return toStringOrNull(item.name) ?? toStringOrNull(item.title) ?? null;
  }
  return null;
}

function normalizeFacetArray(value: unknown): GameCompanyFacet[] {
  return arrayFrom(value)
    .map(item => {
      if (typeof item === 'string') return { name: item };
      if (item && typeof item === 'object') {
        const object = item as Record<string, unknown>;
        const name = toStringOrNull(object.name) ?? toStringOrNull(object.title);
        if (!name) return null;
        return { name, count: nullableNumber(object.count) };
      }
      return null;
    })
    .filter(Boolean) as GameCompanyFacet[];
}

function normalizeStringList(value: unknown): string[] {
  return arrayFrom(value).map(nameFrom).filter(Boolean) as string[];
}

function normalizePopularGames(value: unknown): GameCompanyGame[] {
  return arrayFrom(value)
    .map(item => {
      if (!item || typeof item !== 'object') return null;
      const object = item as Record<string, unknown>;
      const title = toStringOrNull(object.title) ?? toStringOrNull(object.name);
      if (!title) return null;
      return {
        igdb_id: nullableNumber(object.igdb_id ?? object.id),
        slug: toStringOrNull(object.slug),
        title,
        cover_url: toStringOrNull(object.cover_url ?? object.cover ?? object.image_url),
        release_year: nullableNumber(object.release_year ?? object.year),
        genres: normalizeStringList(object.genres),
        platforms: normalizeStringList(object.platforms),
        rating: nullableNumber(object.rating),
        rating_count: nullableNumber(object.rating_count ?? object.total_rating_count),
      };
    })
    .filter(Boolean) as GameCompanyGame[];
}

function normalizeRelatedCompanies(value: unknown): RelatedGameCompany[] {
  return arrayFrom(value)
    .map(item => {
      if (!item || typeof item !== 'object') {
        const name = nameFrom(item);
        return name ? { name, slug: null } : null;
      }
      const object = item as Record<string, unknown>;
      const name = toStringOrNull(object.name);
      if (!name) return null;
      const roles = normalizeStringList(object.roles);
      return {
        igdb_id: nullableNumber(object.igdb_id ?? object.id),
        slug: toStringOrNull(object.slug),
        name,
        relation: toStringOrNull(object.relation ?? object.role) ?? (roles.length ? roles.join(', ') : null),
        roles,
        shared_games_count: nullableNumber(object.shared_games_count),
      };
    })
    .filter(Boolean) as RelatedGameCompany[];
}

function normalizeCompany(row: RawCompanyRow): GameCompany {
  return {
    id: toStringOrNull(row.id) ?? undefined,
    igdb_id: toNumber(row.igdb_id),
    slug: toStringOrNull(row.slug) ?? '',
    name: toStringOrNull(row.name) ?? 'Compañía sin nombre',
    description: toStringOrNull(row.description),
    description_es: toStringOrNull(row.description_es),
    logo_url: toStringOrNull(row.logo_url),
    country: toStringOrNull(row.country),
    status: toStringOrNull(row.status),
    start_date: toStringOrNull(row.start_date),
    changed_date: toStringOrNull(row.changed_date),
    parent_company_id: nullableNumber(row.parent_company_id),
    parent_company_name: toStringOrNull(row.parent_company_name),
    developed_count: toNumber(row.developed_count),
    published_count: toNumber(row.published_count),
    ported_count: toNumber(row.ported_count),
    supported_count: toNumber(row.supported_count),
    dlc_count: toNumber(row.dlc_count),
    cancelled_count: toNumber(row.cancelled_count),
    average_rating: nullableNumber(row.average_rating),
    rating_count: toNumber(row.rating_count),
    popular_games: normalizePopularGames(row.popular_games),
    related_companies: normalizeRelatedCompanies(row.related_companies),
    genres: normalizeFacetArray(row.genres),
    platforms: normalizeFacetArray(row.platforms),
    links: {
      website: toStringOrNull(row.website_url),
      twitter: toStringOrNull(row.twitter_url),
      discord: toStringOrNull(row.discord_url),
      wikipedia: toStringOrNull(row.wikipedia_url),
      linkedin: toStringOrNull(row.linkedin_url),
    },
    metadata: (row.metadata && typeof row.metadata === 'object' ? row.metadata : {}) as Record<string, unknown>,
    last_synced_at: toStringOrNull(row.last_synced_at),
  };
}

export async function getGameCompanyBySlug(slug: string): Promise<GameCompany | null> {
  const { data, error } = await supabase
    .from('game_companies')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeCompany(data as RawCompanyRow) : null;
}
