/**
 * googleBooks.ts — cliente compartido de Google Books.
 *
 * Consulta libros y transforma volúmenes al contrato común de catálogo.
 *
 * Utilizado por búsquedas y detalles de elementos de tipo libro.
 */

// ─── Framework ─────────────────────────────────────────────────────────
import type { NormalizedCatalogItem } from './types.ts';

// ─── Servicios ─────────────────────────────────────────────────────────
import { compact, stripHtml, timedFetch, toSourceSlug } from './utils.ts';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

interface GoogleBooksRequestContext {
  query?: string;
  sourceId?: string;
}

function pickIsbn(identifiers: any[] | undefined) {
  const isbn13 = identifiers?.find((item: any) => item.type === 'ISBN_13')?.identifier;
  const isbn10 = identifiers?.find((item: any) => item.type === 'ISBN_10')?.identifier;
  return isbn13 ?? isbn10 ?? null;
}

function coverUrl(url?: string | null) {
  return url ? url.replace('http://', 'https://') : null;
}

function normalizeBook(book: any): NormalizedCatalogItem {
  const info = book.volumeInfo ?? {};
  const ratingCount = info.ratingsCount ?? null;

  return {
    source: 'google_books',
    source_item_id: String(book.id),
    title: info.title ?? 'Unknown',
    slug: toSourceSlug('books', book.id),
    description: stripHtml(info.description),
    image_url: coverUrl(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail),
    release_date: info.publishedDate ?? null,
    metadata: {
      rating: info.averageRating ?? null,
      rating_count: ratingCount,
      authors: info.authors ?? [],
      publisher: info.publisher ?? null,
      page_count: info.pageCount ?? null,
      published_date: info.publishedDate ?? null,
      genres: info.categories ?? [],
      formats_available: [],
      language: info.language ?? null,
      isbn: pickIsbn(info.industryIdentifiers),
      preview_link: info.previewLink ?? null,
      info_link: info.infoLink ?? null,
      saga: {
        name: null,
        volume: null,
        type: null,
      },
    },
  };
}

function sanitizeUrl(url: URL) {
  const safe = new URL(url.toString());
  if (safe.searchParams.has('key')) safe.searchParams.set('key', '[redacted]');
  return safe.toString();
}

async function readExternalError(res: Response) {
  const text = await res.text().catch(() => '');
  return text.replace(/\s+/g, ' ').trim().slice(0, 300);
}

async function googleBooksGet(
  path: string,
  params: Record<string, string | number | undefined> = {},
  context: GoogleBooksRequestContext = {},
) {
  const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY');
  const url = new URL(`${GOOGLE_BOOKS_BASE_URL}${path}`);
  if (apiKey) url.searchParams.set('key', apiKey);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const res = await timedFetch(url);
  console.info('external-api request', {
    provider: 'google_books',
    category: 'books',
    query: context.query ?? null,
    sourceId: context.sourceId ?? null,
    url: sanitizeUrl(url),
    status: res.status,
  });

  if (!res.ok) {
    const message = await readExternalError(res);
    console.error('external-api error', {
      provider: 'google_books',
      category: 'books',
      query: context.query ?? null,
      sourceId: context.sourceId ?? null,
      url: sanitizeUrl(url),
      status: res.status,
      message,
    });
    throw new Error(`Google Books error: status ${res.status}${message ? ` - ${message}` : ''}`);
  }

  return res.json();
}

/**
 * Busca libros en Google Books y normaliza los volúmenes encontrados.
 *
 * @param query Texto de búsqueda.
 * @param page Página solicitada.
 * @param limit Tamaño máximo de página.
 * @returns Libros normalizados para el catálogo.
 */
export async function searchGoogleBooks(query: string, page = 1, limit = 20): Promise<NormalizedCatalogItem[]> {
  if (!query.trim()) return [];
  const startIndex = Math.max(page - 1, 0) * limit;
  const data = await googleBooksGet(
    '/volumes',
    { q: query, startIndex, maxResults: limit, langRestrict: 'es' },
    { query },
  );
  return compact((data.items ?? []).map(normalizeBook));
}

/**
 * Obtiene el detalle de un libro por identificador de Google Books.
 *
 * @param sourceId Identificador del volumen externo.
 * @returns Libro normalizado o null.
 */
export async function getGoogleBook(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const book = await googleBooksGet(`/volumes/${encodeURIComponent(sourceId)}`, {}, { sourceId });
  return book?.id ? normalizeBook(book) : null;
}
