export type LicenseType = "PD" | "CC BY" | "CC BY-SA" | "CC0";

export interface Film {
  id: string;
  title: string;
  year: number;
  description: string;
  runtime: string; // e.g. "96 min" or "Feature"
  license_url: string;
  license_name: string; // e.g. "Public Domain Mark 1.0", "Creative Commons Attribution"
  license_type: LicenseType;
  creator?: string;
  ia_identifier: string; // Internet Archive ID e.g. "his_girl_friday"
  thumbnail: string;
  backdrop?: string;
  rights_checked: boolean;
  genres: string[];
  director?: string;
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
  | "Adventure"
  | "Crime"
  | "Action"
  | "Animation"
  | "Documentary"
  | "Classic";

export type DecadeType = "1910s" | "1920s" | "1930s" | "1940s" | "1950s" | "1960s" | "1970s";

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
