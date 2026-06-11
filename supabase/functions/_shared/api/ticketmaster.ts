import type { NormalizedCatalogItem } from './types.ts';
import { compact, stripHtml, toSourceSlug } from './utils.ts';

const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

interface TicketmasterSearchOptions {
  keyword: string;
  city?: string | null;
  music?: boolean;
  page?: number;
  limit?: number;
}

interface TicketmasterRequestContext {
  query?: string;
  sourceId?: string;
}

function bestImage(images: any[] | undefined) {
  return images?.find((image: any) => image.ratio === '3_2')?.url ?? images?.[0]?.url ?? null;
}

function normalizeEvent(event: any): NormalizedCatalogItem {
  const venue = event._embedded?.venues?.[0];
  const attractions = compact((event._embedded?.attractions ?? []).map((item: any) => item.name));
  const classifications = event.classifications ?? [];
  const eventDate = event.dates?.start?.localDate ?? null;

  return {
    source: 'ticketmaster',
    source_item_id: String(event.id),
    title: event.name ?? 'Unknown',
    slug: toSourceSlug('concerts', event.id),
    description: stripHtml(event.info ?? event.pleaseNote),
    image_url: bestImage(event.images),
    release_date: eventDate,
    metadata: {
      rating: null,
      rating_count: null,
      genres: compact(classifications.map((item: any) => item.genre?.name)),
      segment: classifications[0]?.segment?.name ?? null,
      subgenre: classifications[0]?.subGenre?.name ?? null,
      city: venue?.city?.name ?? null,
      venue: venue?.name ?? null,
      country: venue?.country?.name ?? null,
      event_date: eventDate,
      start_time: event.dates?.start?.localTime ?? null,
      timezone: event.dates?.timezone ?? null,
      status: event.dates?.status?.code ?? null,
      artists: attractions,
      url: event.url ?? null,
      language: 'original',
    },
  };
}

function sanitizeUrl(url: URL) {
  const safe = new URL(url.toString());
  if (safe.searchParams.has('apikey')) safe.searchParams.set('apikey', '[redacted]');
  return safe.toString();
}

async function readExternalError(res: Response) {
  const text = await res.text().catch(() => '');
  return text.replace(/\s+/g, ' ').trim().slice(0, 300);
}

async function ticketmasterGet(
  path: string,
  params: Record<string, string | number | undefined> = {},
  context: TicketmasterRequestContext = {},
) {
  const apiKey = Deno.env.get('TICKETMASTER_API_KEY');
  if (!apiKey) {
    console.error('external-api config error', {
      provider: 'ticketmaster',
      category: 'concerts',
      query: context.query ?? null,
      sourceId: context.sourceId ?? null,
      message: 'TICKETMASTER_API_KEY is not configured',
    });
    throw new Error('TICKETMASTER_API_KEY is not configured');
  }

  const url = new URL(`${TICKETMASTER_BASE_URL}${path}`);
  url.searchParams.set('apikey', apiKey);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });

  const res = await fetch(url);
  console.info('external-api request', {
    provider: 'ticketmaster',
    category: 'concerts',
    query: context.query ?? null,
    sourceId: context.sourceId ?? null,
    url: sanitizeUrl(url),
    status: res.status,
  });

  if (!res.ok) {
    const message = await readExternalError(res);
    console.error('external-api error', {
      provider: 'ticketmaster',
      category: 'concerts',
      query: context.query ?? null,
      sourceId: context.sourceId ?? null,
      url: sanitizeUrl(url),
      status: res.status,
      message,
    });
    throw new Error(`Ticketmaster error: status ${res.status}${message ? ` - ${message}` : ''}`);
  }

  return res.json();
}

export async function searchTicketmasterEvents(options: TicketmasterSearchOptions): Promise<NormalizedCatalogItem[]> {
  const { keyword, city, music = true, page = 1, limit = 20 } = options;
  if (!keyword.trim()) return [];
  const data = await ticketmasterGet('/events.json', {
    keyword,
    city: city ?? undefined,
    classificationName: music ? 'music' : undefined,
    page: Math.max(page - 1, 0),
    size: limit,
  }, { query: keyword });

  return compact((data._embedded?.events ?? []).map(normalizeEvent));
}

export async function getTicketmasterEvent(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const event = await ticketmasterGet(`/events/${encodeURIComponent(sourceId)}.json`, {}, { sourceId });
  return event?.id ? normalizeEvent(event) : null;
}
