export interface GameCompanyGame {
  igdb_id?: number | null;
  slug?: string | null;
  title: string;
  cover_url?: string | null;
  release_year?: number | string | null;
  genres: string[];
  platforms: string[];
  rating?: number | null;
  rating_count?: number | null;
}

export interface RelatedGameCompany {
  igdb_id?: number | null;
  slug?: string | null;
  name: string;
  relation?: string | null;
  roles?: string[];
  shared_games_count?: number | null;
}

export interface GameCompanyFacet {
  name: string;
  count?: number | null;
}

export interface GameCompanyLinks {
  website: string | null;
  twitter: string | null;
  discord: string | null;
  wikipedia: string | null;
  linkedin: string | null;
}

export interface GameCompany {
  id?: string;
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
  developed_count: number;
  published_count: number;
  ported_count: number;
  supported_count: number;
  dlc_count: number;
  cancelled_count: number;
  average_rating: number | null;
  rating_count: number;
  popular_games: GameCompanyGame[];
  related_companies: RelatedGameCompany[];
  genres: GameCompanyFacet[];
  platforms: GameCompanyFacet[];
  links: GameCompanyLinks;
  metadata: Record<string, unknown>;
  last_synced_at: string | null;
}
