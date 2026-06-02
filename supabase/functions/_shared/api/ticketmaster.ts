import type { NormalizedCatalogItem } from './types.ts';
import { compact, requireEnv, stripHtml, toSourceSlug } from './utils.ts';

const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

interface TicketmasterSearchOptions {
  keyword: string;
  city?: string | null;
  music?: boolean;
  page?: number;
  limit?: number;
}

function bestImage(images: any[] | undefined) {
  return images?.find((image: any) => image.ratio === '3_2')?.url ?? images?.[0]?.url ?? null;
}

function normalizeEvent(event: any): NormalizedCatalogItem {
  const venue = event._embedded?.venues?.[0];
  const attractions = compact((event._embedded?.attractions ?? []).map((item: any) => item.name));
  const classifications = event.classifications ?? [];

  return {
    source: 'ticketmaster',
    source_item_id: String(event.id),
    title: event.name ?? 'Unknown',
    slug: toSourceSlug('concerts', event.id),
    description: stripHtml(event.info ?? event.pleaseNote),
    image_url: bestImage(event.images),
    release_date: event.dates?.start?.localDate ?? null,
    metadata: {
      rating: null,
      genres: compact(classifications.map((item: any) => item.genre?.name)),
      segment: classifications[0]?.segment?.name ?? null,
      subgenre: classifications[0]?.subGenre?.name ?? null,
      city: venue?.city?.name ?? null,
      venue: venue?.name ?? null,
      country: venue?.country?.name ?? null,
      timezone: event.dates?.timezone ?? null,
      status: event.dates?.status?.code ?? null,
      artists: attractions,
      url: event.url ?? null,
    },
  };
}

async function ticketmasterGet(path: string, params: Record<string, string | number | undefined> = {}) {
  const apiKey = requireEnv('TICKETMASTER_API_KEY');
  requireEnv('TICKETMASTER_SECRET');

  const url = new URL(`${TICKETMASTER_BASE_URL}${path}`);
  url.searchParams.set('apikey', apiKey);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ticketmaster error: ${res.status}`);
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
  });

  return compact((data._embedded?.events ?? []).map(normalizeEvent));
}

export async function getTicketmasterEvent(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const event = await ticketmasterGet(`/events/${encodeURIComponent(sourceId)}.json`);
  return event?.id ? normalizeEvent(event) : null;
}
