import type { NormalizedCatalogItem } from './types.ts';
import { compact, requireEnv, stripHtml, toSourceSlug } from './utils.ts';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

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
      ratings_count: info.ratingsCount ?? null,
      authors: info.authors ?? [],
      publisher: info.publisher ?? null,
      page_count: info.pageCount ?? null,
      genres: info.categories ?? [],
      language: info.language ?? null,
      isbn: pickIsbn(info.industryIdentifiers),
      preview_link: info.previewLink ?? null,
      info_link: info.infoLink ?? null,
    },
  };
}

async function googleBooksGet(path: string, params: Record<string, string | number | undefined> = {}) {
  const apiKey = requireEnv('GOOGLE_BOOKS_API_KEY');
  const url = new URL(`${GOOGLE_BOOKS_BASE_URL}${path}`);
  url.searchParams.set('key', apiKey);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Books error: ${res.status}`);
  return res.json();
}

export async function searchGoogleBooks(query: string, page = 1, limit = 20): Promise<NormalizedCatalogItem[]> {
  if (!query.trim()) return [];
  const startIndex = Math.max(page - 1, 0) * limit;
  const data = await googleBooksGet('/volumes', { q: query, startIndex, maxResults: limit });
  return compact((data.items ?? []).map(normalizeBook));
}

export async function getGoogleBook(sourceId: string): Promise<NormalizedCatalogItem | null> {
  const book = await googleBooksGet(`/volumes/${encodeURIComponent(sourceId)}`);
  return book?.id ? normalizeBook(book) : null;
}
