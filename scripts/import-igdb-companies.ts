/**
 * import-igdb-companies.ts — importación directa de compañías desde IGDB.
 *
 * Consulta IGDB por lotes, adapta columnas disponibles y actualiza game_companies.
 *
 * Utilizado en sincronizaciones administrativas de catálogo de compañías.
 */

// ─── Configuración ────────────────────────────────────────────────────
import 'dotenv/config';

// ─── Librerías externas ────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

// ─── Constantes ───────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID!;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET!;

const LIMIT = 500;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
  throw new Error('Faltan variables en .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Tipos ─────────────────────────────────────────────────────────────
type IgdbCompany = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  country?: number;
  start_date?: number;
  change_date?: number;
  logo?: number;
  websites?: number[];
  parent?: number;
  developed?: number[];
  published?: number[];
  status?: number;
};

type NormalizedCompany = ReturnType<typeof normalizeCompany>;
type ImportRow = Record<string, unknown> & { igdb_id: number };

// ─── Helpers ──────────────────────────────────────────────────────────
/**
 * Solicita un token OAuth de Twitch para autenticar llamadas IGDB.
 *
 * @returns Token de acceso válido para la API de IGDB.
 */
async function getIgdbToken() {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );

  if (!res.ok) {
    throw new Error(`Error obteniendo token IGDB: ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/**
 * Recupera un lote paginado de compañías desde IGDB.
 *
 * @param token Token OAuth de IGDB.
 * @param offset Desplazamiento de paginación.
 * @returns Compañías crudas devueltas por IGDB.
 */
async function fetchCompanies(token: string, offset: number): Promise<IgdbCompany[]> {
  const query = `
fields
id,
name,
slug,
description,
country,
start_date,
change_date,
logo,
websites,
parent,
developed,
published,
status;

where developed != null | published != null;

limit ${LIMIT};
offset ${offset};
`;

  const res = await fetch('https://api.igdb.com/v4/companies', {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: query,
  });

  if (!res.ok) {
    throw new Error(`Error IGDB offset ${offset}: ${await res.text()}`);
  }

  return res.json();
}

/**
 * Intenta obtener columnas reales de game_companies desde el esquema REST.
 *
 * @returns Conjunto de columnas disponibles; vacío si no se puede leer.
 */
async function fetchTableColumnsFromRestSchema() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Accept: 'application/openapi+json',
    },
  });

  if (!res.ok) {
    console.warn(`No se pudo leer el esquema REST de Supabase: ${res.status} ${await res.text()}`);
    return new Set<string>();
  }

  const schema = await res.json();
  const tableSchema =
    schema?.definitions?.game_companies ??
    schema?.components?.schemas?.game_companies;
  const properties = tableSchema?.properties;

  if (!properties || typeof properties !== 'object') {
    return new Set<string>();
  }

  return new Set(Object.keys(properties));
}

/**
 * Obtiene columnas disponibles usando una fila de muestra.
 *
 * @returns Conjunto de columnas detectadas desde Supabase.
 */
async function fetchTableColumnsFromSampleRow() {
  const { data, error } = await supabase
    .from('game_companies')
    .select('*')
    .limit(1);

  if (error) {
    throw new Error(`No se pudo consultar game_companies para detectar columnas: ${error.message}`);
  }

  const firstRow = data?.[0];
  return new Set(firstRow ? Object.keys(firstRow) : []);
}

/**
 * Resuelve las columnas válidas de game_companies antes del upsert.
 *
 * @returns Conjunto de columnas aceptadas por la tabla actual.
 */
async function getGameCompanyColumns() {
  const schemaColumns = await fetchTableColumnsFromRestSchema();
  if (schemaColumns.size > 0) return schemaColumns;

  const sampleColumns = await fetchTableColumnsFromSampleRow();
  if (sampleColumns.size > 0) return sampleColumns;

  throw new Error(
    'No se pudieron detectar las columnas de game_companies. La tabla parece estar vacia y el esquema REST no devolvio metadatos.'
  );
}

/**
 * Convierte timestamps Unix de IGDB a fecha ISO de día.
 *
 * @param value Timestamp en segundos.
 * @returns Fecha YYYY-MM-DD o null.
 */
function unixToDate(value?: number | null) {
  if (!value || typeof value !== 'number' || !Number.isFinite(value)) return null;

  const date = new Date(value * 1000);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    console.warn('Fecha IGDB ignorada:', value, 'invalid date');
    return null;
  }

  const year = date.getUTCFullYear();

  if (year < 1900 || year > 2100) {
    console.warn('Fecha IGDB ignorada:', value, date.toISOString());
    return null;
  }

  return date.toISOString().slice(0, 10);
}

/**
 * Construye la URL de logo cuando IGDB expone un identificador suficiente.
 *
 * @param logo Identificador numérico del logo.
 * @returns URL de imagen o null.
 */
function logoUrl(logo?: number) {
  if (!logo) return null;

  // Si luego se obtiene logo.image_id, esta conversión debe actualizarse.
  // Con solo el ID del logo no se puede construir la URL final correctamente.
  return null;
}

/**
 * Normaliza una compañía cruda de IGDB al formato de importación.
 *
 * @param company Compañía devuelta por IGDB.
 * @returns Fila normalizada para game_companies.
 */
function normalizeCompany(company: IgdbCompany) {
  const developedCount = company.developed?.length ?? 0;
  const publishedCount = company.published?.length ?? 0;

  return {
    igdb_id: company.id,
    slug: company.slug ?? String(company.id),
    name: company.name,
    description: company.description ?? null,
    description_es: null,
    logo_url: logoUrl(company.logo),
    country: company.country ? String(company.country) : null,
    status: company.status != null ? String(company.status) : null,
    start_date: unixToDate(company.start_date),
    changed_date: unixToDate(company.change_date),
    parent_company_id: company.parent ?? null,
    parent_company_name: null,
    company_size: null,
    website_url: null,
    twitter_url: null,
    discord_url: null,
    wikipedia_url: null,
    linkedin_url: null,
    developed_count: developedCount,
    published_count: publishedCount,
    ported_count: 0,
    supported_count: 0,
    dlc_count: 0,
    cancelled_count: 0,
    average_rating: null,
    rating_count: 0,
    popular_games: [],
    related_companies: [],
    genres: [],
    platforms: [],
    metadata: {
      raw: company,
      developed_ids: company.developed ?? [],
      published_ids: company.published ?? [],
      website_ids: company.websites ?? [],
    },
    last_synced_at: new Date().toISOString(),
  };
}

/**
 * Elimina del payload las columnas que no existen en la tabla actual.
 *
 * @param row Fila normalizada completa.
 * @param validColumns Columnas disponibles en game_companies.
 * @returns Fila filtrada para upsert seguro.
 */
function filterExistingColumns(row: NormalizedCompany, validColumns: Set<string>) {
  return Object.fromEntries(
    Object.entries(row).filter(([key]) => validColumns.has(key))
  ) as ImportRow;
}

/**
 * Aplica el filtrado de columnas a un lote completo.
 *
 * @param rows Filas normalizadas.
 * @param validColumns Columnas disponibles en game_companies.
 * @returns Filas compatibles con la tabla actual.
 */
function filterRowsForUpsert(rows: NormalizedCompany[], validColumns: Set<string>) {
  if (rows.length === 0) return;

  const ignoredColumns = new Set<string>();
  const filteredRows = rows.map((row) => {
    for (const column of Object.keys(row)) {
      if (!validColumns.has(column)) ignoredColumns.add(column);
    }

    return filterExistingColumns(row, validColumns);
  });

  if (!validColumns.has('igdb_id')) {
    throw new Error('La tabla game_companies no tiene columna igdb_id; no se puede hacer upsert por igdb_id.');
  }

  if (filteredRows.length > 0) {
    console.log('Columnas enviadas:', Object.keys(filteredRows[0]));
  }

  console.log('Columnas ignoradas:', Array.from(ignoredColumns).sort());

  return filteredRows;
}

// ─── Validaciones ─────────────────────────────────────────────────────
/**
 * Decide si una compañía aporta suficiente valor para ser importada.
 *
 * @param company Compañía cruda de IGDB.
 * @returns Verdadero cuando debe sincronizarse.
 */
function shouldImport(company: IgdbCompany) {
  if (!company.id || !company.name || !company.slug) return false;

  const totalGames = (company.developed?.length ?? 0) + (company.published?.length ?? 0);

  return Boolean(company.description || company.logo || totalGames >= 3);
}

// ─── Operaciones principales ──────────────────────────────────────────
/**
 * Ejecuta la sincronización completa por lotes desde IGDB hacia Supabase.
 */
async function main() {
  console.log('Obteniendo token IGDB...');
  const token = await getIgdbToken();

  let offset = 0;
  let totalRead = 0;
  let totalImported = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  const validColumns = await getGameCompanyColumns();
  console.log('Columnas detectadas en game_companies:', Array.from(validColumns).sort());

  while (true) {
    console.log(`Descargando compañías offset ${offset}...`);

    const companies = await fetchCompanies(token, offset);

    if (companies.length === 0) {
      console.log('No quedan más compañías.');
      break;
    }

    totalRead += companies.length;

    const rows = companies.filter(shouldImport).map(normalizeCompany);
    totalSkipped += companies.length - rows.length;

    if (rows.length > 0) {
      const upsertRows = filterRowsForUpsert(rows, validColumns);
      if (!upsertRows || upsertRows.length === 0) {
        totalSkipped += rows.length;
        offset += LIMIT;
        continue;
      }

      const ids = upsertRows.map((row) => row.igdb_id);
      const { data: existingRows, error: existingError } = await supabase
        .from('game_companies')
        .select('igdb_id')
        .in('igdb_id', ids);

      if (existingError) {
        totalErrors += rows.length;
        console.error('Error consultando existentes:', existingError);
        throw existingError;
      }

      const existingIds = new Set((existingRows ?? []).map((row) => row.igdb_id));

      const { error } = await supabase
        .from('game_companies')
        .upsert(upsertRows, {
          onConflict: 'igdb_id',
        });

      if (error) {
        totalErrors += rows.length;
        console.error('Error Supabase:', error);
        throw error;
      }

      const updatedInBatch = upsertRows.filter((row) => existingIds.has(row.igdb_id)).length;
      const importedInBatch = upsertRows.filter((row) => !existingIds.has(row.igdb_id)).length;

      totalUpdated += updatedInBatch;
      totalImported += importedInBatch;

      console.log(`Upsert OK | Nuevas: ${importedInBatch} | Actualizadas: ${updatedInBatch}`);
    }

    console.log(`Leídas: ${companies.length} | Importadas: ${rows.length} | Omitidas: ${companies.length - rows.length}`);

    offset += LIMIT;

    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  console.log('Importación terminada');
  console.log(`total leidas: ${totalRead}`);
  console.log(`importadas: ${totalImported}`);
  console.log(`actualizadas: ${totalUpdated}`);
  console.log(`omitidas: ${totalSkipped}`);
  console.log(`errores: ${totalErrors}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
