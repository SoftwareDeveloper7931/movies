import { Film } from "@/types/film";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export interface SyncResult {
  success: boolean;
  totalFetched: number;
  qualifyingCount: number;
  addedCount: number;
  skippedCount: number;
  errorCount: number;
  filmsAdded: Array<{ title: string; identifier: string; license: string }>;
  errors: string[];
}

/**
 * Strict legal license verification engine.
 * Only accepts explicitly verified Public Domain or Creative Commons open licenses.
 * Excludes anything missing, ambiguous, or claiming rights reservation.
 */
export function verifyPublicDomainLicense(item: {
  licenseurl?: string;
  rights?: string;
  description?: string;
}): { isValid: boolean; licenseUrl: string; licenseName: string; licenseType?: "PD" | "CC BY" | "CC BY-SA" | "CC0"; rejectionReason?: string } {
  const licenseUrl = (item.licenseurl || "").toLowerCase().trim();
  const rights = (item.rights || "").toLowerCase().trim();

  // Explicit exclusion 1: All rights reserved or copyright restricted
  const forbiddenPhrases = [
    "all rights reserved",
    "copyrighted",
    "copyright (c)",
    "unauthorized duplication",
    "proprietary",
    "commercial distribution prohibited",
  ];

  for (const phrase of forbiddenPhrases) {
    if (rights.includes(phrase) || licenseUrl.includes(phrase)) {
      return {
        isValid: false,
        licenseUrl: "",
        licenseName: "",
        rejectionReason: `Rejected: contains rights reservation text "${phrase}"`,
      };
    }
  }

  // Explicit exclusion 2: Non-Commercial (NC) Creative Commons licenses
  // Since HD MOVIES is an ad-supported site, CC BY-NC / CC BY-NC-SA / CC BY-NC-ND are legally prohibited.
  if (
    licenseUrl.includes("-nc") ||
    licenseUrl.includes("/nc") ||
    licenseUrl.includes("noncommercial") ||
    licenseUrl.includes("non-commercial") ||
    rights.includes("noncommercial") ||
    rights.includes("non-commercial")
  ) {
    return {
      isValid: false,
      licenseUrl: "",
      licenseName: "",
      rejectionReason: "Rejected: Creative Commons Non-Commercial (NC) license is not allowed on ad-supported sites",
    };
  }

  // 1. Creative Commons Public Domain Mark 1.0 (PDM)
  if (
    licenseUrl.includes("creativecommons.org/publicdomain/mark/1.0") ||
    rights.includes("public domain mark 1.0")
  ) {
    return {
      isValid: true,
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
      licenseName: "Public Domain Mark 1.0",
      licenseType: "PD",
    };
  }

  // 2. Creative Commons Zero 1.0 (CC0)
  if (
    licenseUrl.includes("creativecommons.org/publicdomain/zero/1.0") ||
    licenseUrl.includes("/cc0/") ||
    rights.includes("cc0")
  ) {
    return {
      isValid: true,
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      licenseName: "Creative Commons CC0 1.0 Universal",
      licenseType: "CC0",
    };
  }

  // 3. General Public Domain dedication
  if (
    licenseUrl.includes("publicdomain") ||
    rights.includes("public domain") ||
    rights.includes("no known copyright") ||
    rights.includes("released into the public domain")
  ) {
    return {
      isValid: true,
      licenseUrl: licenseUrl || "https://creativecommons.org/publicdomain/mark/1.0/",
      licenseName: "Public Domain (Unrestricted)",
      licenseType: "PD",
    };
  }

  // 4. Commercial-friendly Creative Commons Open Licenses (CC BY, CC BY-SA)
  if (licenseUrl.includes("creativecommons.org/licenses/")) {
    if (licenseUrl.includes("/by/") && !licenseUrl.includes("/by-nc")) {
      return {
        isValid: true,
        licenseUrl,
        licenseName: "Creative Commons Attribution (CC BY)",
        licenseType: "CC BY",
      };
    }
    if (licenseUrl.includes("/by-sa/") && !licenseUrl.includes("/by-nc-sa")) {
      return {
        isValid: true,
        licenseUrl,
        licenseName: "Creative Commons Attribution-ShareAlike (CC BY-SA)",
        licenseType: "CC BY-SA",
      };
    }
  }

  // If no clear open/public domain license is declared, exclude it!
  return {
    isValid: false,
    licenseUrl: "",
    licenseName: "",
    rejectionReason: "Excluded: Missing or unverified public domain / open license indicator",
  };
}

/**
 * Sync feature films from Internet Archive Advanced Search API.
 * Query restricted strictly to: collection:(feature_films) AND mediatype:(movies)
 */
export async function syncFilmsFromInternetArchive(options: {
  rows?: number;
  page?: number;
  minYear?: number;
} = {}): Promise<SyncResult> {
  const rows = options.rows || 50;
  const page = options.page || 1;

  const result: SyncResult = {
    success: true,
    totalFetched: 0,
    qualifyingCount: 0,
    addedCount: 0,
    skippedCount: 0,
    errorCount: 0,
    filmsAdded: [],
    errors: [],
  };

  try {
    const query = 'collection:(feature_films) AND mediatype:(movies)';
    const searchUrl = new URL("https://archive.org/advancedsearch.php");
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.append("fl[]", "identifier");
    searchUrl.searchParams.append("fl[]", "title");
    searchUrl.searchParams.append("fl[]", "description");
    searchUrl.searchParams.append("fl[]", "year");
    searchUrl.searchParams.append("fl[]", "licenseurl");
    searchUrl.searchParams.append("fl[]", "rights");
    searchUrl.searchParams.append("fl[]", "runtime");
    searchUrl.searchParams.append("fl[]", "genre");
    searchUrl.searchParams.append("fl[]", "downloads");
    searchUrl.searchParams.append("fl[]", "creator");
    searchUrl.searchParams.append("fl[]", "publicdate");
    searchUrl.searchParams.append("sort[]", "downloads desc");
    searchUrl.searchParams.set("rows", rows.toString());
    searchUrl.searchParams.set("page", page.toString());
    searchUrl.searchParams.set("output", "json");

    const response = await fetch(searchUrl.toString(), {
      headers: {
        "User-Agent": "HDMoviesCrawler/1.0 (Public Domain Archive Indexer; https://hdmovies.org)",
        "Accept": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Internet Archive API responded with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const docs = data?.response?.docs || [];
    result.totalFetched = docs.length;

    for (const doc of docs) {
      if (!doc.identifier || !doc.title) {
        result.skippedCount++;
        continue;
      }

      // Check licensing strictly
      const licenseCheck = verifyPublicDomainLicense({
        licenseurl: doc.licenseurl,
        rights: doc.rights,
        description: doc.description,
      });

      if (!licenseCheck.isValid) {
        result.skippedCount++;
        continue;
      }

      result.qualifyingCount++;

      // Clean up description HTML / formatting
      const cleanDesc = (doc.description || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Format genres
      let genres: string[] = [];
      if (Array.isArray(doc.genre)) {
        genres = doc.genre;
      } else if (typeof doc.genre === "string") {
        genres = doc.genre.split(/[,;/]+/).map((s: string) => s.trim());
      }
      if (genres.length === 0) {
        genres = ["Classic"];
      }

      const filmPayload: Film = {
        id: doc.identifier,
        title: doc.title,
        year: parseInt(doc.year, 10) || 1930,
        description: cleanDesc.slice(0, 1000) || "Preserved feature film in the public domain.",
        runtime: doc.runtime || "Feature",
        license_url: licenseCheck.licenseUrl,
        license_name: licenseCheck.licenseName,
        license_type: licenseCheck.licenseType || "PD",
        ia_identifier: doc.identifier,
        thumbnail: `https://archive.org/services/img/${doc.identifier}`,
        rights_checked: true, // Only added when verified
        genres: genres.slice(0, 4),
        creator: Array.isArray(doc.creator) ? doc.creator[0] : doc.creator,
        director: Array.isArray(doc.creator) ? doc.creator[0] : doc.creator,
        downloads: parseInt(doc.downloads, 10) || 0,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          const { error } = await supabaseAdmin.from("films").upsert(
            {
              id: filmPayload.id,
              title: filmPayload.title,
              year: filmPayload.year,
              description: filmPayload.description,
              runtime: filmPayload.runtime,
              license_url: filmPayload.license_url,
              license_name: filmPayload.license_name,
              ia_identifier: filmPayload.ia_identifier,
              thumbnail: filmPayload.thumbnail,
              rights_checked: true,
              genres: filmPayload.genres,
              director: filmPayload.director,
              downloads: filmPayload.downloads,
              updated_at: filmPayload.updated_at,
            },
            { onConflict: "ia_identifier" }
          );

          if (error) {
            result.errorCount++;
            result.errors.push(`Failed to upsert "${filmPayload.title}": ${error.message}`);
          } else {
            result.addedCount++;
            result.filmsAdded.push({
              title: filmPayload.title,
              identifier: filmPayload.ia_identifier,
              license: licenseCheck.licenseName,
            });
          }
        } catch (dbErr: unknown) {
          result.errorCount++;
          const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
          result.errors.push(`DB Exception on "${filmPayload.title}": ${msg}`);
        }
      } else {
        // When running in demo/offline mode
        result.addedCount++;
        result.filmsAdded.push({
          title: filmPayload.title,
          identifier: filmPayload.ia_identifier,
          license: licenseCheck.licenseName,
        });
      }
    }
  } catch (err: unknown) {
    result.success = false;
    const msg = err instanceof Error ? err.message : "Unknown error during sync";
    result.errors.push(msg);
  }

  return result;
}

/**
 * Fetch full, item-level metadata from the Internet Archive Metadata API.
 * Endpoint: https://archive.org/metadata/IDENTIFIER
 */
export async function fetchFilmMetadata(identifier: string) {
  const url = `https://archive.org/metadata/${encodeURIComponent(identifier)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "HDMoviesCrawler/1.0 (Public Domain Metadata Fetcher)",
      Accept: "application/json",
    },
    next: { revalidate: 86400 }, // Cache for 24h
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch metadata for ${identifier}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Page through large result sets (> 10,000 items) using the Internet Archive Scrape API.
 * Endpoint: https://archive.org/services/search/v1/scrape
 */
export async function scrapeFeatureFilms(options: {
  cursor?: string;
  total?: number;
} = {}) {
  const scrapeUrl = new URL("https://archive.org/services/search/v1/scrape");
  scrapeUrl.searchParams.set("q", "collection:feature_films AND mediatype:movies");
  scrapeUrl.searchParams.append("fields", "identifier,title,year,licenseurl,rights,runtime,genre,downloads,creator");
  if (options.cursor) {
    scrapeUrl.searchParams.set("cursor", options.cursor);
  }
  if (options.total) {
    scrapeUrl.searchParams.set("total", options.total.toString());
  }

  const res = await fetch(scrapeUrl.toString(), {
    headers: {
      "User-Agent": "HDMoviesCrawler/1.0 (Public Domain Scrape API)",
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Scrape API failed: ${res.statusText}`);
  }

  return res.json();
}
