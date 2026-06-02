import type { AniListMediaType, NormalizedCatalogItem } from './types.ts';
import { compact, stripHtml, toSourceSlug } from './utils.ts';

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';

const SEARCH_MEDIA_QUERY = `
  query SearchMedia($search: String!, $type: MediaType!, $page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: $type) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        bannerImage
        averageScore
        episodes
        chapters
        volumes
        genres
        description
        status
        seasonYear
      }
    }
  }
`;

function normalizeMedia(media: any, type: AniListMediaType): NormalizedCatalogItem {
  const title = media.title?.english ?? media.title?.romaji ?? media.title?.native ?? 'Unknown';
  const prefix = type === 'ANIME' ? 'anime' : 'manga';

  return {
    source: 'anilist',
    source_item_id: String(media.id),
    title,
    slug: toSourceSlug(prefix, media.id),
    description: stripHtml(media.description),
    image_url: media.coverImage?.large ?? null,
    release_date: media.seasonYear ? `${media.seasonYear}-01-01` : null,
    metadata: {
      media_type: type.toLowerCase(),
      rating: media.averageScore != null ? Number(media.averageScore) / 10 : null,
      average_score: media.averageScore ?? null,
      episodes: media.episodes ?? null,
      chapters: media.chapters ?? null,
      volumes: media.volumes ?? null,
      genres: media.genres ?? [],
      status: media.status ?? null,
      banner_url: media.bannerImage ?? null,
      title_romaji: media.title?.romaji ?? null,
      title_english: media.title?.english ?? null,
      title_native: media.title?.native ?? null,
    },
  };
}

export async function searchAniListMedia(
  query: string,
  type: AniListMediaType = 'ANIME',
  page = 1,
  limit = 20,
): Promise<NormalizedCatalogItem[]> {
  if (!query.trim()) return [];

  const res = await fetch(ANILIST_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: SEARCH_MEDIA_QUERY,
      variables: { search: query, type, page, perPage: limit },
    }),
  });

  if (!res.ok) throw new Error(`AniList error: ${res.status}`);
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors[0]?.message ?? 'AniList GraphQL error');

  return compact((data.data?.Page?.media ?? []).map((media: any) => normalizeMedia(media, type)));
}
