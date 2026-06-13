import type { CategoryStatus } from '@/constants/tracker-statuses';
export type TrackerStatus = CategoryStatus | null;

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface CastMember {
  name: string;
  character: string;
  photo: string | null;
}

export interface CrewMember {
  name: string;
  job: string;
}

export interface ItemDetail {
  gallery?: GalleryImage[];
  id: string;
  category: string;
  title: string;
  cover: string;
  backdrop: string;
  rating: number;
  year: number;
  genre: string;
  description: string;
  tags: string[];

  // Cast & crew
  developer?: string;
  publisher?: string;
  platforms?: string[];
  director?: string;
  cast?: string[];
  cast_detailed?: CastMember[];
  crew_detailed?: CrewMember[];

  // Movies & Series
  duration?: string;
  seasons?: number;
  episodes?: number;
  network?: string;
  original_language?: string;
  origin_country?: string;
  production_companies?: string[];
  keywords?: string[];
  trailer_key?: string;
  backdrops?: string[];
  last_air_date?: string;
  series_status?: string;

  // Games
  metacritic?: number;
  website?: string;
  esrb?: string;
  playtime?: number;
  achievements_count?: number;

  // Books
  author?: string;
  authors?: string[];
  pages?: number;
  isbn?: string;
  language?: string;

  // Concerts
  venue?: string;
  city?: string;
  country?: string;
  artist?: string;
  setlist?: string[];
  event_date?: string;
  event_time?: string;

  // Community
  community_rating: number;
  total_ratings: number;
  total_reviews: number;
}
