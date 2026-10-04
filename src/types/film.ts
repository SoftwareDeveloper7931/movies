export type IndustryType = "Hollywood" | "Bollywood" | "South Indian";

export interface Film {
  id: string;
  title: string;
  year: number;
  description: string;
  runtime: string; // e.g. "96 min"
  license_url: string;
  license_name: string; // e.g. "Public Domain Mark 1.0", "Creative Commons CC0"
  ia_identifier: string; // Internet Archive ID e.g. "night_of_the_living_dead"
  thumbnail: string;
  backdrop?: string;
  rights_checked: boolean;
  genres: string[];
  director?: string;
  industry: IndustryType;
  language?: string;
  imdb_rating?: number;
  imdb_id?: string;
  tmdb_id?: number | string;
  actors?: string[];
  featured?: boolean;
  downloads?: number;
  created_at?: string;
  updated_at?: string;
}

export type GenreType =
  | "Film Noir"
  | "Horror"
  | "Sci-Fi"
  | "Comedy"
  | "Drama"
  | "Mystery"
  | "Silent"
  | "Western"
  | "Thriller"
  | "Adventure";

export type DecadeType = "1920s" | "1930s" | "1940s" | "1950s" | "1960s";

export interface AdPlacementProps {
  placement: "header-banner" | "sidebar" | "below-player" | "between-rows" | "footer-banner";
  className?: string;
}

export interface DmcaRequest {
  id: string;
  work_title: string;
  film_identifier: string;
  claimant_name: string;
  claimant_email: string;
  infringement_details: string;
  status: "pending" | "investigating" | "removed" | "rejected";
  created_at: string;
}
