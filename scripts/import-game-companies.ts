import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

type CsvRow = Record<string, string>;

type ImportRow = {
  igdb_id: number;
  slug: string;
  name: string;
  description: string | null;
  description_es: string | null;
  logo_url: string | null;
  country: string | null;
  status: string | null;
  start_date: string | null;
  changed_date: string | null;
  parent_company_id: number | null;
  parent_company_name: string | null;
  website_url: string | null;
  twitter_url: string | null;
  discord_url: string | null;
  wikipedia_url: string | null;
  linkedin_url: string | null;
  developed_count: number;
  published_count: number;
  average_rating: number | null;
  rating_count: number;
  popular_games: unknown[];
  related_companies: unknown[];
  genres: unknown[];
  platforms: unknown[];
  metadata: Record<string, unknown>;
  last_synced_at: string;
};

const BATCH_SIZE = 250;

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

const STATUS_BY_ID: Record<number, string> = {
  0: 'active',
  1: 'defunct',
};

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  const text = readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function parseCsv(text: string): { headers: string[]; rows: CsvRow[] } {
  const normalized = text.replace(/^\uFEFF/, '');
  const records: string[][] = [];
  let record: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      record.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      record.push(field);
      if (record.some(value => value.length > 0)) records.push(record);
      record = [];
      field = '';
      continue;
    }

    field += char;
  }

  record.push(field);
  if (record.some(value => value.length > 0)) records.push(record);

  const headers = (records.shift() ?? []).map(header => header.trim());
  const rows = records.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ''])));
  return { headers, rows };
}

function get(row: CsvRow, aliases: string[]) {
  const normalized = new Map(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[\s.-]+/g, '_'), value]));
  for (const alias of aliases) {
    const value = normalized.get(alias.toLowerCase().replace(/[\s.-]+/g, '_'));
    if (value != null && value !== '') return value;
  }
  return '';
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.toLowerCase() === 'null') return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseJsonish(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    // IGDB exports sometimes serialize arrays as "1, 2, 3" or "[1,2,3]" strings with single quotes.
  }

  try {
    return JSON.parse(trimmed.replace(/'/g, '"'));
  } catch {
    return trimmed;
  }
}

function toArray(value: string): unknown[] {
  const parsed = parseJsonish(value);
  if (Array.isArray(parsed)) return parsed;
  if (parsed == null || parsed === '') return [];
  if (typeof parsed === 'string') {
    const trimmed = parsed.trim();
    if (!trimmed) return [];
    return trimmed
      .replace(/^\[|\]$/g, '')
      .split(/[|;,]/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [parsed];
}

function countArray(value: string) {
  return toArray(value).length;
}

function normalizeDate(value: string): string | null {
  const parsed = parseJsonish(value);
  const primitive = typeof parsed === 'object' && parsed && 'date' in parsed
    ? (parsed as { date?: unknown }).date
    : parsed;

  const numeric = typeof primitive === 'number' ? primitive : toNumber(String(primitive ?? ''));
  if (numeric != null) {
    const ms = numeric > 10_000_000_000 ? numeric : numeric * 1000;
    return new Date(ms).toISOString().slice(0, 10);
  }

  const raw = String(primitive ?? '').trim();
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function normalizeCountry(value: string): string | null {
  const numeric = toNumber(value);
  if (numeric != null) return COUNTRY_BY_ISO_NUMERIC[numeric] ?? String(numeric);
  return value.trim() || null;
}

function normalizeStatus(value: string): string | null {
  const numeric = toNumber(value);
  if (numeric != null) return STATUS_BY_ID[numeric] ?? String(numeric);
  return value.trim() || null;
}

function extractImageId(value: string): string | null {
  const parsed = parseJsonish(value);
  if (typeof parsed === 'string') return parsed.trim() || null;
  if (typeof parsed === 'number') return String(parsed);
  if (parsed && typeof parsed === 'object') {
    const object = parsed as Record<string, unknown>;
    return String(object.image_id ?? object.imageId ?? object.id ?? '').trim() || null;
  }
  return null;
}

function normalizeLogoUrl(row: CsvRow) {
  const existing = get(row, ['logo_url', 'logo.url']);
  if (existing) return existing;

  const imageId = extractImageId(get(row, ['logo.image_id', 'logo_image_id', 'logo']));
  return imageId ? `https://images.igdb.com/igdb/image/upload/t_logo_big/${imageId}.png` : null;
}

function normalizeWebsites(row: CsvRow) {
  const links = {
    website_url: get(row, ['website_url', 'website', 'url']) || null,
    twitter_url: get(row, ['twitter_url', 'twitter']) || null,
    discord_url: get(row, ['discord_url', 'discord']) || null,
    wikipedia_url: get(row, ['wikipedia_url', 'wikipedia']) || null,
    linkedin_url: get(row, ['linkedin_url', 'linkedin']) || null,
  };

  for (const item of toArray(get(row, ['websites']))) {
    const site = typeof item === 'object' && item ? item as Record<string, unknown> : { url: item };
    const url = String(site.url ?? '').trim();
    if (!url) continue;
    const category = toNumber(String(site.category ?? ''));

    if (category === 1 && !links.website_url) links.website_url = url;
    if (category === 3 && !links.wikipedia_url) links.wikipedia_url = url;
    if (category === 5 && !links.twitter_url) links.twitter_url = url;
    if (category === 18 && !links.discord_url) links.discord_url = url;
    if (url.includes('linkedin.com') && !links.linkedin_url) links.linkedin_url = url;
  }

  return links;
}

function normalizeJsonArray(row: CsvRow, aliases: string[]) {
  return toArray(get(row, aliases)).filter(item => item != null && item !== '');
}

function normalizeCompany(row: CsvRow): { data?: ImportRow; skipped?: string } {
  const igdbId = toNumber(get(row, ['igdb_id', 'id', 'company_id']));
  const name = get(row, ['name']);
  const slug = toSlug(get(row, ['slug']) || name);

  if (!igdbId || !slug || !name) return { skipped: 'missing_required_fields' };

  const description = get(row, ['description', 'desc', 'summary']) || null;
  const descriptionEs = get(row, ['description_es', 'description_spanish', 'descripcion']) || null;
  const logoUrl = normalizeLogoUrl(row);
  const developedCount = toNumber(get(row, ['developed_count'])) ?? countArray(get(row, ['developed', 'developed_games']));
  const publishedCount = toNumber(get(row, ['published_count'])) ?? countArray(get(row, ['published', 'published_games']));

  if (!description && !logoUrl && developedCount + publishedCount < 3) {
    return { skipped: 'low_value_company' };
  }

  const websites = normalizeWebsites(row);
  const parentCompanyId = toNumber(get(row, ['parent_company_id', 'parent.id', 'parent']));

  return {
    data: {
      igdb_id: igdbId,
      slug,
      name,
      description,
      description_es: descriptionEs,
      logo_url: logoUrl,
      country: normalizeCountry(get(row, ['country'])),
      status: normalizeStatus(get(row, ['status'])),
      start_date: normalizeDate(get(row, ['start_date', 'start_date.date', 'founded_at'])),
      changed_date: normalizeDate(get(row, ['changed_date', 'updated_at'])),
      parent_company_id: parentCompanyId,
      parent_company_name: get(row, ['parent_company_name', 'parent.name']) || null,
      ...websites,
      developed_count: developedCount,
      published_count: publishedCount,
      average_rating: toNumber(get(row, ['average_rating', 'rating', 'total_rating'])),
      rating_count: toNumber(get(row, ['rating_count', 'total_rating_count'])) ?? 0,
      popular_games: normalizeJsonArray(row, ['popular_games']),
      related_companies: normalizeJsonArray(row, ['related_companies']),
      genres: normalizeJsonArray(row, ['genres']),
      platforms: normalizeJsonArray(row, ['platforms']),
      metadata: {
        imported_from: 'igdb_csv',
        raw_developed: normalizeJsonArray(row, ['developed', 'developed_games']),
        raw_published: normalizeJsonArray(row, ['published', 'published_games']),
        translation_status: description && !descriptionEs ? 'pending' : descriptionEs ? 'provided' : 'none',
      },
      last_synced_at: new Date().toISOString(),
    },
  };
}

async function main() {
  loadEnv();

  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error('Usage: npm run import:companies -- ./data/game_companies.csv');
  }

  const absoluteCsvPath = resolve(process.cwd(), csvPath);
  if (!existsSync(absoluteCsvPath)) {
    throw new Error(`CSV file not found: ${absoluteCsvPath}`);
  }

  const text = readFileSync(absoluteCsvPath, 'utf8');
  const { headers, rows } = parseCsv(text);

  console.log(`CSV: ${absoluteCsvPath}`);
  console.log(`Columnas detectadas (${headers.length}): ${headers.length ? headers.join(', ') : '(ninguna)'}`);

  if (!headers.length || !rows.length) {
    console.log('Resumen: total leidas=0, importadas=0, actualizadas=0, omitidas=0, errores=0');
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const skipReasons = new Map<string, number>();

  const rowsToImport: ImportRow[] = [];

  for (const row of rows) {
    try {
      const normalized = normalizeCompany(row);
      if (!normalized.data) {
        skipped += 1;
        const reason = normalized.skipped ?? 'unknown';
        skipReasons.set(reason, (skipReasons.get(reason) ?? 0) + 1);
        continue;
      }
      rowsToImport.push(normalized.data);
    } catch (error) {
      errors += 1;
      console.error('Error normalizando fila:', error);
    }
  }

  for (let index = 0; index < rowsToImport.length; index += BATCH_SIZE) {
    const batch = rowsToImport.slice(index, index + BATCH_SIZE);
    const ids = batch.map(row => row.igdb_id);
    const { data: existing, error: existingError } = await supabase
      .from('game_companies')
      .select('igdb_id')
      .in('igdb_id', ids);

    if (existingError) throw existingError;
    const existingIds = new Set((existing ?? []).map(row => row.igdb_id));

    const { error } = await supabase
      .from('game_companies')
      .upsert(batch, { onConflict: 'igdb_id' });

    if (error) {
      errors += batch.length;
      console.error(`Error importando lote ${index / BATCH_SIZE + 1}:`, error.message);
      continue;
    }

    updated += batch.filter(row => existingIds.has(row.igdb_id)).length;
    imported += batch.filter(row => !existingIds.has(row.igdb_id)).length;
    console.log(`Lote ${index / BATCH_SIZE + 1}: ${batch.length} companias procesadas`);
  }

  console.log('Resumen final');
  console.log(`- total leidas: ${rows.length}`);
  console.log(`- importadas: ${imported}`);
  console.log(`- actualizadas: ${updated}`);
  console.log(`- omitidas: ${skipped}`);
  console.log(`- errores: ${errors}`);
  if (skipReasons.size) {
    console.log('- motivos de omision:');
    for (const [reason, count] of skipReasons.entries()) {
      console.log(`  - ${reason}: ${count}`);
    }
  }
}

main().catch(error => {
  console.error('Import failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
