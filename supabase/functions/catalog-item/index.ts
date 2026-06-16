/**
 * Función Edge: catalog-item
 *
 * Endpoint encargado de gestionar la operación serverless asociada dentro del backend de Vaultly.
 *
 * Flujo:
 * 1. Busca el elemento en caché local.
 * 2. Valida si la caché contiene datos suficientes.
 * 3. Consulta el proveedor externo si es necesario.
 * 4. Enriquece videojuegos con HowLongToBeat cuando se persisten.
 * 5. Actualiza catálogo y entidades relacionadas.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Servicios ─────────────────────────────────────────────────────────
import { getGoogleBook } from '../_shared/api/googleBooks.ts';
import { getHowLongToBeatMetadata } from '../_shared/api/howLongToBeat.ts';
import { getIgdbGame } from '../_shared/api/igdb.ts';
import { getTicketmasterEvent } from '../_shared/api/ticketmaster.ts';
import { getTmdbMovie, getTmdbSeries } from '../_shared/api/tmdb.ts';
import { checkRateLimit, clientIdentifier, publicError, safeText } from '../_shared/security.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORY_ENUM: Record<string, string> = {
  games: 'videojuegos',
  movies: 'peliculas',
  series: 'series',
  books: 'libros',
  concerts: 'conciertos',
};

const APP_CATEGORY_TO_API: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_ENUM).map(([apiCategory, dbCategory]) => [dbCategory, apiCategory]),
);

/**
 * Traduce categorías internas o públicas al identificador usado por proveedores externos.
 *
 * @param category Categoría recibida en ruta, query o payload.
 * @returns Categoría de API o null si no es válida.
 */
function toApiCategory(category: string | null): string | null {
  if (!category) return null;
  if (CATEGORY_ENUM[category]) return category;
  return APP_CATEGORY_TO_API[category] ?? null;
}

/**
 * Traduce una categoría de API al identificador persistido en base de datos.
 *
 * @param category Categoría recibida por la función.
 * @returns Categoría de base de datos o null si no es válida.
 */
function toDbCategory(category: string | null): string | null {
  const apiCategory = toApiCategory(category);
  return apiCategory ? CATEGORY_ENUM[apiCategory] : null;
}

/**
 * Entidad detectada dentro de los metadatos de un elemento de catálogo.
 *
 */
interface EntityInput {
  name: string;
  type: string;
  role: string;
}

/**
 * Genera el slug estable que identifica una entidad por nombre y tipo.
 *
 * @param name Nombre visible de la entidad.
 * @param type Tipo funcional de entidad.
 * @returns Slug normalizado para persistencia y relaciones.
 */
function toEntitySlug(name: string, type: string): string {
  return `${name}-${type}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Extrae personas, compañías o artistas relevantes desde metadatos normalizados.
 *
 * @param category Categoría de API del elemento.
 * @param metadata Metadatos devueltos por el proveedor externo.
 * @returns Entidades candidatas para enlazar con el catálogo.
 */
function extractEntities(category: string, metadata: any): EntityInput[] {
  const out: EntityInput[] = [];

  if (category === 'games') {
    (metadata.developers ?? []).forEach((name: string) => name && out.push({ name, type: 'developer', role: 'developer' }));
    (metadata.publishers ?? []).forEach((name: string) => name && out.push({ name, type: 'publisher', role: 'publisher' }));
  }
  if (category === 'movies') {
    if (metadata.director) out.push({ name: metadata.director, type: 'director', role: 'director' });
    (metadata.cast ?? []).forEach((name: string) => name && out.push({ name, type: 'actor', role: 'actor' }));
  }
  if (category === 'series') {
    (metadata.creators ?? []).forEach((name: string) => name && out.push({ name, type: 'creator', role: 'creator' }));
    (metadata.cast ?? []).forEach((name: string) => name && out.push({ name, type: 'actor', role: 'actor' }));
  }
  if (category === 'books') {
    (metadata.authors ?? []).forEach((name: string) => name && out.push({ name, type: 'author', role: 'author' }));
  }
  if (category === 'concerts') {
    (metadata.artists ?? []).forEach((name: string) => name && out.push({ name, type: 'artist', role: 'artist' }));
  }

  return out;
}

/**
 * Determina si una fila cacheada contiene información suficiente para evitar una consulta externa.
 *
 * @param item Elemento de catálogo cacheado.
 * @returns Verdadero cuando la caché es útil para el detalle.
 */
function hasImportantCatalogData(item: any) {
  const metadata = item?.metadata ?? {};
  const hasExtendedGameMetadata = item?.category !== 'videojuegos'
    || (
      Array.isArray(metadata.screenshots)
      && Array.isArray(metadata.artworks)
      && Array.isArray(metadata.trailers)
      && Array.isArray(metadata.related_games)
    );

  return Boolean(
    item?.description
    && item?.image_url
    && metadata
    && typeof metadata === 'object'
    && Object.keys(metadata).length > 0
    && hasExtendedGameMetadata
  );
}

/**
 * Limpia arrays de cadenas para que metadata conserve un contrato estable.
 *
 * @param value Valor recibido desde admin o proveedor externo.
 * @returns Array de cadenas no vacias.
 */
function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item ?? '').trim()).filter(Boolean))];
}

/**
 * Valida URLs externas sin bloquear datos antiguos que no tienen el campo.
 *
 * @param value URL candidata.
 * @returns URL segura para persistir o undefined.
 */
function externalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Normaliza trailers editados manualmente o recibidos de IGDB.
 *
 * @param value Lista candidata de trailers.
 * @returns Trailers validos para metadata.
 */
function normalizeTrailers(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const trailer = item as Record<string, unknown>;
      const url = externalUrl(trailer.url);
      if (!url) return null;
      const source = ['youtube', 'vimeo', 'igdb', 'other'].includes(String(trailer.source))
        ? String(trailer.source)
        : 'other';
      return {
        ...(typeof trailer.title === 'string' && trailer.title.trim() ? { title: trailer.title.trim() } : {}),
        url,
        ...(externalUrl(trailer.thumbnail_url) ? { thumbnail_url: externalUrl(trailer.thumbnail_url) } : {}),
        source,
      };
    })
    .filter(Boolean);
}

/**
 * Mantiene campos manuales al refrescar un juego desde IGDB.
 *
 * @param incoming Metadata normalizada desde proveedor o admin.
 * @param existing Metadata ya persistida en catalog_items.
 * @returns Metadata fusionada sin perder campos curados manualmente.
 */
function mergeGameMetadata(incoming: Record<string, unknown>, existing: Record<string, unknown> = {}) {
  const interactiveMapUrl = externalUrl(incoming.interactive_map_url) ?? externalUrl(existing.interactive_map_url);
  const interactiveMapSource =
    typeof incoming.interactive_map_source === 'string' && incoming.interactive_map_source.trim()
      ? incoming.interactive_map_source.trim()
      : typeof existing.interactive_map_source === 'string' && existing.interactive_map_source.trim()
        ? existing.interactive_map_source.trim()
        : undefined;

  return {
    ...existing,
    ...incoming,
    screenshots: stringArray(incoming.screenshots ?? existing.screenshots),
    artworks: stringArray(incoming.artworks ?? existing.artworks),
    trailers: normalizeTrailers(incoming.trailers ?? existing.trailers),
    ...(interactiveMapUrl ? { interactive_map_url: interactiveMapUrl } : {}),
    ...(interactiveMapSource ? { interactive_map_source: interactiveMapSource } : {}),
  };
}

/**
 * Normaliza metadata antes de escribir desde admin o cache externo.
 *
 * @param metadata Metadata original.
 * @param apiCategory Categoria de API.
 * @param existing Metadata previa si existe.
 * @returns Metadata compatible con datos antiguos y nuevos.
 */
function normalizeMetadataForStorage(metadata: any, apiCategory: string, existing: Record<string, unknown> = {}) {
  if (apiCategory !== 'games') return metadata ?? {};
  return mergeGameMetadata((metadata ?? {}) as Record<string, unknown>, existing);
}

/**
 * Crea o reutiliza entidades derivadas y las enlaza con el elemento de catálogo.
 *
 * @param db Cliente Supabase de servicio.
 * @param itemId Identificador interno del elemento.
 * @param category Categoría de API del elemento.
 * @param metadata Metadatos normalizados del proveedor.
 * @returns Número de relaciones creadas o reutilizadas.
 */
async function upsertEntities(db: any, itemId: string, category: string, metadata: any) {
  const inputs = extractEntities(category, metadata);
  if (!inputs.length) return { linked: 0 };

  const seen = new Set<string>();
  const unique = inputs.filter(entity => {
    const key = `${entity.name}|${entity.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const { data: entities, error: entityError } = await db
    .from('entities')
    .upsert(
      unique.map(entity => ({
        name: entity.name,
        type: entity.type,
        slug: toEntitySlug(entity.name, entity.type),
      })),
      { onConflict: 'slug' },
    )
    .select('id, name, type');

  if (entityError) {
    console.error('Entity upsert error:', entityError);
    return { linked: 0 };
  }
  if (!entities?.length) return { linked: 0 };

  const idMap = new Map<string, string>();
  entities.forEach((entity: any) => idMap.set(`${entity.name}|${entity.type}`, entity.id));

  const relSeen = new Set<string>();
  const relations = inputs
    .map(entity => {
      const entityId = idMap.get(`${entity.name}|${entity.type}`);
      if (!entityId) return null;
      const key = `${itemId}|${entityId}|${entity.role}`;
      if (relSeen.has(key)) return null;
      relSeen.add(key);
      return { item_id: itemId, entity_id: entityId, role: entity.role };
    })
    .filter(Boolean);

  if (relations.length) {
    const { error: relationError } = await db
      .from('item_entities')
      .upsert(relations, { onConflict: 'item_id,entity_id,role' });
    if (relationError) console.error('item_entities upsert error:', relationError);
  }

  return { linked: relations.length };
}

/**
 * Obtiene el detalle externo de un elemento según su categoría.
 *
 * @param category Categoría de API.
 * @param sourceId Identificador del proveedor externo.
 * @returns Elemento normalizado o null si no existe.
 */
async function fetchExternalItem(category: string, sourceId: string) {
  if (category === 'games') return getIgdbGame(sourceId);
  if (category === 'movies') return getTmdbMovie(sourceId);
  if (category === 'series') return getTmdbSeries(sourceId);
  if (category === 'books') return getGoogleBook(sourceId);
  if (category === 'concerts') return getTicketmasterEvent(sourceId);
  return null;
}

/**
 * Añade tiempos de juego de HowLongToBeat a metadatos de videojuegos.
 *
 * @param item Videojuego normalizado desde IGDB.
 * @returns Elemento enriquecido sin modificar el contrato base.
 */
async function enrichGameWithHowLongToBeat(item: any) {
  const hltb = await getHowLongToBeatMetadata(item?.title, item?.metadata?.igdb_slug);
  return {
    ...item,
    metadata: {
      ...(item?.metadata ?? {}),
      howlongtobeat: {
        id: hltb.id,
        main: hltb.gameplayMain,
        main_extra: hltb.gameplayMainExtra,
        completionist: hltb.gameplayCompletionist,
        similarity: hltb.similarity,
      },
    },
  };
}

/**
 * Valida la sesión del usuario cuando una operación intenta persistir datos.
 *
 * @param req Petición HTTP con cabecera Authorization.
 * @returns Usuario autenticado o null.
 */
async function requireAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const client = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

async function getRequester(req: Request, db: any) {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return { userId: null, isAdmin: false, isActive: false };

  const { data: userData } = await db.auth.getUser(token);
  const userId = userData.user?.id ?? null;
  if (!userId) return { userId: null, isAdmin: false, isActive: false };

  const { data } = await db
    .from('profiles')
    .select('role, status')
    .eq('id', userId)
    .maybeSingle();

  return {
    userId,
    isAdmin: data?.role === 'admin' && data?.status === 'active',
    isActive: data?.status === 'active',
  };
}

/**
 * Inserta o actualiza un elemento de catálogo y sincroniza sus entidades relacionadas.
 *
 * @param db Cliente Supabase de servicio.
 * @param item Elemento normalizado por proveedor.
 * @param apiCategory Categoría usada por la API externa.
 * @returns Elemento persistido y contador de entidades enlazadas.
 */
async function upsertCatalogItem(db: any, item: any, apiCategory: string) {
  const dbCategory = toDbCategory(apiCategory);
  const { data: existing } = await db
    .from('catalog_items')
    .select('metadata')
    .eq('category', dbCategory)
    .eq('source', item.source)
    .eq('source_item_id', item.source_item_id)
    .maybeSingle();

  const metadata = normalizeMetadataForStorage(item.metadata, apiCategory, existing?.metadata ?? {});
  const { data: upserted, error: upsertError } = await db
    .from('catalog_items')
    .upsert({ ...item, category: dbCategory, metadata }, { onConflict: 'category,source,source_item_id' })
    .select('*')
    .maybeSingle();

  if (upsertError) throw upsertError;

  let entityStats = { linked: 0 };
  if (upserted?.id) {
    entityStats = await upsertEntities(db, upserted.id, apiCategory, metadata);
  }

  return { item: upserted, entitiesLinked: entityStats.linked };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const shouldPersist = req.method === 'POST';
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const requester = await getRequester(req, db);
    const allowed = await checkRateLimit(
      db,
      'catalog-item',
      clientIdentifier(req, requester.userId),
      shouldPersist ? 20 : 60,
      60,
    );
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (shouldPersist) {
      const user = await requireAuthenticatedUser(req);
      if (!user || !requester.isActive) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const url = new URL(req.url);
    const body = shouldPersist ? await req.json().catch(() => ({})) : {};
    const slug = safeText(url.searchParams.get('slug') ?? body.slug, 180) || null;
    const category = safeText(url.searchParams.get('category') ?? body.category, 20) || null;
    const sourceId = safeText(url.searchParams.get('source_id') ?? body.source_id, 180) || null;
    const forceSyncRequested = url.searchParams.get('force_sync') === '1' || body.force_sync === true;
    if (forceSyncRequested && !requester.isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const forceSync = forceSyncRequested && requester.isAdmin;

    let cachedFallback: any = null;

    if (!forceSync) {
      let cacheQuery = db.from('catalog_items').select('*');
      if (slug) {
        cacheQuery = cacheQuery.eq('slug', slug);
        const dbCategory = toDbCategory(category);
        if (dbCategory) cacheQuery = cacheQuery.eq('category', dbCategory);
      }
      else if (sourceId) cacheQuery = cacheQuery.eq('source_item_id', sourceId);
      else {
        return new Response(JSON.stringify({ error: 'Provide slug or source_id' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: cached } = await cacheQuery.maybeSingle();
      cachedFallback = cached;

      if (cached && (cached.source === 'manual' || hasImportantCatalogData(cached))) {
        return new Response(JSON.stringify({ data: cached, source: 'cache' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (cached && !category) {
        const cat = Object.entries(CATEGORY_ENUM).find(([, value]) => value === cached.category)?.[0];
        if (cat) url.searchParams.set('category', cat);
      }
    }

    let resolvedCategory = toApiCategory(url.searchParams.get('category'));
    if (!resolvedCategory && slug) {
      const prefix = slug.split('-')[0];
      const catMap: Record<string, string> = {
        games: 'games',
        movies: 'movies',
        series: 'series',
        books: 'books',
        concerts: 'concerts',
      };
      resolvedCategory = catMap[prefix] ?? null;
    }

    if (!resolvedCategory) {
      return new Response(JSON.stringify({ error: 'category required for external fetch' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const effectiveSourceId = sourceId ?? slug?.replace(/^[a-z]+-/, '') ?? '';
    let item = await fetchExternalItem(resolvedCategory, effectiveSourceId);

    if (!item) {
      if (cachedFallback) {
        return new Response(JSON.stringify({ data: cachedFallback, source: 'cache' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Not found or unsupported category' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!shouldPersist) {
      return new Response(JSON.stringify({
        data: { ...item, category: toDbCategory(resolvedCategory) },
        source: 'external',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (resolvedCategory === 'games') {
      item = await enrichGameWithHowLongToBeat(item);
    }

    const { item: upserted, entitiesLinked } = await upsertCatalogItem(db, item, resolvedCategory);

    return new Response(JSON.stringify({ data: upserted, source: 'external_cached', entities_linked: entitiesLinked }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('catalog-item error:', err);
    return new Response(JSON.stringify(publicError()), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
