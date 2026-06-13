import type { NormalizedGameCompany } from './types.ts';
import { compact, stripHtml } from './utils.ts';
import { igdbImageUrl, igdbRequest } from './igdb.ts';

const POPULAR_GAMES_LIMIT = 20;

const COUNTRY_BY_ISO_NUMERIC: Record<number, string> = {
  32: 'Argentina',
  36: 'Australia',
  40: 'Austria',
  56: 'Belgium',
  76: 'Brazil',
  124: 'Canada',
  152: 'Chile',
  156: 'China',
  208: 'Denmark',
  246: 'Finland',
  250: 'France',
  276: 'Germany',
  372: 'Ireland',
  380: 'Italy',
  392: 'Japan',
  410: 'South Korea',
  484: 'Mexico',
  528: 'Netherlands',
  554: 'New Zealand',
  578: 'Norway',
  616: 'Poland',
  724: 'Spain',
  752: 'Sweden',
  756: 'Switzerland',
  826: 'United Kingdom',
  840: 'United States',
};

const COMPANY_STATUS: Record<number, string> = {
  0: 'active',
  1: 'defunct',
};

const COMPANY_SIZE: Record<number, string> = {
  1: '1-10 employees',
  2: '11-50 employees',
  3: '51-200 employees',
  4: '201-500 employees',
  5: '501-1000 employees',
  6: '1001-5000 employees',
  7: '5001-10000 employees',
  8: '10001+ employees',
};

type CountedName = { name: string; count: number };

function escapeIgdbString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function toCompanySlug(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function dateFromTimestamp(timestamp?: number | null) {
  return timestamp ? new Date(timestamp * 1000).toISOString().slice(0, 10) : null;
}

function yearFromTimestamp(timestamp?: number | null) {
  return timestamp ? new Date(timestamp * 1000).getUTCFullYear() : null;
}

function rating(value?: number | null) {
  return value == null ? null : Math.round((Number(value) / 10) * 10) / 10;
}

function countryName(country?: number | null) {
  return country == null ? null : COUNTRY_BY_ISO_NUMERIC[country] ?? String(country);
}

function statusName(status?: number | string | null) {
  if (status == null) return null;
  if (typeof status === 'string') return status;
  return COMPANY_STATUS[status] ?? String(status);
}

function companySizeName(size?: number | string | null) {
  if (size == null) return null;
  if (typeof size === 'string') return size;
  return COMPANY_SIZE[size] ?? String(size);
}

function countNames(items: string[]): CountedName[] {
  const counts = new Map<string, number>();
  items.forEach(item => counts.set(item, (counts.get(item) ?? 0) + 1));
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function rolesForCompany(game: any, companyId: number) {
  const roles = new Set<string>();
  (game.involved_companies ?? [])
    .filter((item: any) => item.company?.id === companyId)
    .forEach((item: any) => {
      if (item.developer) roles.add('developer');
      if (item.publisher) roles.add('publisher');
      if (item.porting) roles.add('porting');
      if (item.supporting) roles.add('supporting');
    });
  return roles;
}

function linksFromWebsites(websites: any[] = []) {
  const links = {
    website: null as string | null,
    twitter: null as string | null,
    discord: null as string | null,
    wikipedia: null as string | null,
    linkedin: null as string | null,
  };

  websites.forEach(site => {
    const url = typeof site?.url === 'string' ? site.url : null;
    if (!url) return;

    if (site.category === 1 && !links.website) links.website = url;
    if (site.category === 3 && !links.wikipedia) links.wikipedia = url;
    if (site.category === 5 && !links.twitter) links.twitter = url;
    if (site.category === 18 && !links.discord) links.discord = url;
    if (url.includes('linkedin.com') && !links.linkedin) links.linkedin = url;
  });

  return links;
}

function popularGames(games: any[]) {
  return [...games]
    .sort((a, b) => Number(b.total_rating_count ?? 0) - Number(a.total_rating_count ?? 0)
      || Number(b.total_rating ?? 0) - Number(a.total_rating ?? 0))
    .slice(0, POPULAR_GAMES_LIMIT)
    .map(game => ({
      igdb_id: game.id,
      slug: game.slug ?? toCompanySlug(game.name),
      title: game.name ?? 'Unknown',
      cover_url: igdbImageUrl(game.cover?.image_id),
      release_year: yearFromTimestamp(game.first_release_date),
      genres: compact((game.genres ?? []).map((genre: any) => genre.name)),
      platforms: compact((game.platforms ?? []).map((platform: any) => platform.name)),
      rating: rating(game.total_rating),
      rating_count: Number(game.total_rating_count ?? 0),
    }));
}

function relatedCompanies(games: any[], companyId: number) {
  const companies = new Map<number, {
    igdb_id: number;
    slug: string;
    name: string;
    roles: Set<string>;
    shared_games_count: number;
  }>();

  games.forEach(game => {
    const seenInGame = new Set<number>();
    (game.involved_companies ?? []).forEach((item: any) => {
      const company = item.company;
      if (!company?.id || company.id === companyId || !company.name) return;
      const existing = companies.get(company.id) ?? {
        igdb_id: company.id,
        slug: company.slug ?? toCompanySlug(company.name),
        name: company.name,
        roles: new Set<string>(),
        shared_games_count: 0,
      };
      if (item.developer) existing.roles.add('developer');
      if (item.publisher) existing.roles.add('publisher');
      if (item.porting) existing.roles.add('porting');
      if (item.supporting) existing.roles.add('supporting');
      if (!seenInGame.has(company.id)) {
        existing.shared_games_count += 1;
        seenInGame.add(company.id);
      }
      companies.set(company.id, existing);
    });
  });

  return [...companies.values()]
    .sort((a, b) => b.shared_games_count - a.shared_games_count || a.name.localeCompare(b.name))
    .slice(0, 12)
    .map(company => ({
      ...company,
      roles: [...company.roles].sort(),
    }));
}

function companyStats(games: any[], companyId: number) {
  let developed = 0;
  let published = 0;
  let ported = 0;
  let supported = 0;
  let dlcs = 0;
  let cancelled = 0;
  let weightedRating = 0;
  let ratingCount = 0;

  games.forEach(game => {
    const roles = rolesForCompany(game, companyId);
    if (roles.has('developer')) developed += 1;
    if (roles.has('publisher')) published += 1;
    if (roles.has('porting')) ported += 1;
    if (roles.has('supporting')) supported += 1;
    if ([1, 2].includes(Number(game.category))) dlcs += 1;
    if (Number(game.status) === 6) cancelled += 1;

    const count = Number(game.total_rating_count ?? 0);
    if (game.total_rating != null && count > 0) {
      weightedRating += Number(game.total_rating) * count;
      ratingCount += count;
    }
  });

  return {
    developed,
    published,
    ported,
    supported,
    dlcs,
    cancelled,
    average_rating: ratingCount ? rating(weightedRating / ratingCount) : null,
    rating_count: ratingCount,
  };
}

async function findCompanyBySlug(slug: string) {
  const bySlugBody = `
    fields id,name,slug,description,logo.image_id,country,start_date,changed_date,status,parent.id,parent.name,company_size,websites.category,websites.url;
    where slug = "${escapeIgdbString(slug)}";
    limit 1;
  `;
  const exact = await igdbRequest('companies', bySlugBody);
  if (exact?.[0]) return exact[0];

  const query = slug.replace(/-/g, ' ');
  const searchBody = `
    search "${escapeIgdbString(query)}";
    fields id,name,slug,description,logo.image_id,country,start_date,changed_date,status,parent.id,parent.name,company_size,websites.category,websites.url;
    limit 10;
  `;
  const results = await igdbRequest('companies', searchBody);
  return (results ?? []).find((company: any) => toCompanySlug(company.slug ?? company.name) === slug) ?? results?.[0] ?? null;
}

async function fetchCompanyGames(companyId: number) {
  const body = `
    fields id,name,slug,cover.image_id,first_release_date,genres.name,platforms.name,total_rating,total_rating_count,category,status,involved_companies.developer,involved_companies.publisher,involved_companies.porting,involved_companies.supporting,involved_companies.company.id,involved_companies.company.name,involved_companies.company.slug;
    where involved_companies.company = ${companyId};
    sort total_rating_count desc;
    limit 500;
  `;
  return await igdbRequest('games', body);
}

export async function getIgdbCompanyBySlug(slug: string): Promise<NormalizedGameCompany | null> {
  const safeSlug = toCompanySlug(slug);
  if (!safeSlug) return null;

  const company = await findCompanyBySlug(safeSlug);
  if (!company?.id) return null;

  const games = await fetchCompanyGames(company.id) ?? [];
  const genres = countNames(games.flatMap((game: any) => (game.genres ?? []).map((genre: any) => genre.name)).filter(Boolean));
  const platforms = countNames(games.flatMap((game: any) => (game.platforms ?? []).map((platform: any) => platform.name)).filter(Boolean));
  const links = linksFromWebsites(company.websites);
  const normalizedSlug = company.slug ?? toCompanySlug(company.name);

  return {
    igdb_id: company.id,
    slug: normalizedSlug,
    name: company.name,
    description: stripHtml(company.description),
    logo_url: igdbImageUrl(company.logo?.image_id, 't_logo_med'),
    country: countryName(company.country),
    status: statusName(company.status),
    started: dateFromTimestamp(company.start_date),
    changed_date: dateFromTimestamp(company.changed_date),
    parent_company: company.parent ? {
      id: company.parent.id ?? null,
      name: company.parent.name ?? null,
    } : null,
    company_size: companySizeName(company.company_size),
    stats: companyStats(games ?? [], company.id),
    popular_games: popularGames(games ?? []),
    related_companies: relatedCompanies(games ?? [], company.id),
    genres: genres.slice(0, 12),
    platforms: platforms.slice(0, 12),
    links,
    source: 'igdb',
    last_synced_at: null,
  };
}
