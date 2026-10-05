import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { searchFilms, SearchOptions } from "@/lib/db";
import { MovieCard } from "@/components/MovieCard";
import { AdSlot } from "@/components/AdSlot";
import { Filter, Search, RotateCcw, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Archival Films — HD MOVIES Catalog",
  description:
    "Explore our complete vault of verified public domain and open license films from Internet Archive. Filter by genre, decade, or license type.",
};

interface BrowsePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LICENSES = ["All", "PD", "CC0", "CC BY", "CC BY-SA"];

const GENRES = [
  "All",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Fantasy",
  "Adventure",
  "Mystery",
  "Crime",
  "Western",
  "Silent",
  "Sci-Fi",
];

const DECADES = ["All", "1910s", "1920s", "1930s", "1940s", "1950s", "1960s", "1970s"];

const SORT_OPTIONS = [
  { label: "Most Downloaded", value: "popular" },
  { label: "Recently Added", value: "recent" },
  { label: "Release Year (Newest)", value: "year_desc" },
  { label: "Release Year (Oldest)", value: "year_asc" },
  { label: "Title (A-Z)", value: "title" },
];

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const resolvedParams = await searchParams;

  const currentGenre = typeof resolvedParams.genre === "string" ? resolvedParams.genre : "All";
  const currentDecade = typeof resolvedParams.decade === "string" ? resolvedParams.decade : "All";
  const currentLicense = typeof resolvedParams.license === "string" ? resolvedParams.license : "All";
  const currentSort = (typeof resolvedParams.sort === "string" ? resolvedParams.sort : "popular") as SearchOptions["sortBy"];
  const currentQuery = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const currentPage = Math.max(1, parseInt(typeof resolvedParams.page === "string" ? resolvedParams.page : "1", 10) || 1);

  const films = await searchFilms(currentQuery, {
    genre: currentGenre === "All" ? undefined : currentGenre,
    decade: currentDecade === "All" ? undefined : currentDecade,
    license: currentLicense === "All" ? undefined : currentLicense,
    sortBy: currentSort,
  });

  const pageSize = 24;
  const totalPages = Math.ceil(films.length / pageSize) || 1;
  const paginatedFilms = films.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const hasActiveFilters =
    currentGenre !== "All" ||
    currentDecade !== "All" ||
    currentLicense !== "All" ||
    currentSort !== "popular" ||
    Boolean(currentQuery);

  const buildUrl = (overrideParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    if (currentQuery) params.set("q", currentQuery);
    if (currentGenre !== "All") params.set("genre", currentGenre);
    if (currentDecade !== "All") params.set("decade", currentDecade);
    if (currentLicense !== "All") params.set("license", currentLicense);
    if (currentSort && currentSort !== "popular") params.set("sort", currentSort);
    if (currentPage > 1) params.set("page", currentPage.toString());

    Object.entries(overrideParams).forEach(([k, v]) => {
      if (v === undefined || v === "" || (k === "page" && v === 1)) {
        params.delete(k);
      } else {
        params.set(k, v.toString());
      }
    });

    const str = params.toString();
    return `/browse${str ? `?${str}` : ""}`;
  };

  return (
    <div className="w-full pb-16">
      {/* Header Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="header-banner" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Page Title & Intro */}
        <div className="border-b border-cinema-800 pb-5 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Internet Archive Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              {currentGenre !== "All"
                ? `${currentGenre} Movies`
                : currentDecade !== "All"
                ? `${currentDecade} Cinema`
                : "Browse Archival Feature Films"}
            </h1>
            <p className="text-xs text-cinema-400 mt-1">
              Every film is verified under Public Domain or Creative Commons open licenses
            </p>
          </div>

          <div className="text-xs text-cinema-400">
            Total <strong className="text-amber-400">{films.length}</strong> verified films available
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cinema-900 border border-cinema-800/80 space-y-4 mb-8 shadow-lg">
          {/* Search bar inside filter panel */}
          <form method="GET" action="/browse" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-400" />
              <input
                type="text"
                name="q"
                defaultValue={currentQuery}
                placeholder="Search by title, director, creator, or license..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-cinema-950 border border-cinema-750 text-cinema-100 placeholder:text-cinema-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Preserve other filters when searching */}
            {currentGenre !== "All" && <input type="hidden" name="genre" value={currentGenre} />}
            {currentDecade !== "All" && <input type="hidden" name="decade" value={currentDecade} />}
            {currentLicense !== "All" && <input type="hidden" name="license" value={currentLicense} />}
            {currentSort && <input type="hidden" name="sort" value={currentSort} />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs sm:text-sm transition-colors shadow-md shadow-amber-950/40"
            >
              Search
            </button>

            {hasActiveFilters && (
              <Link
                href="/browse"
                className="px-3.5 py-2.5 rounded-xl bg-cinema-800 hover:bg-cinema-750 text-cinema-300 hover:text-white border border-cinema-700 text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Link>
            )}
          </form>

          {/* Filter: License Type */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cinema-400 uppercase tracking-wider">
              <span>Verified License</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LICENSES.map((lic) => {
                const isActive = (currentLicense === "All" && lic === "All") || currentLicense === lic;
                return (
                  <Link
                    key={lic}
                    href={buildUrl({ license: lic === "All" ? undefined : lic, page: 1 })}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      isActive
                        ? "bg-emerald-400 text-black font-bold shadow-md shadow-emerald-950/40"
                        : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 border border-cinema-750"
                    }`}
                  >
                    {lic === "PD"
                      ? "Public Domain (PD)"
                      : lic === "CC0"
                      ? "Creative Commons Zero (CC0)"
                      : lic === "CC BY"
                      ? "Attribution (CC BY)"
                      : lic === "CC BY-SA"
                      ? "Attribution-ShareAlike (CC BY-SA)"
                      : "All Licenses"}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Filter: Genres */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cinema-400 uppercase tracking-wider">
              <span>Genre</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map((g) => {
                const isActive = (currentGenre === "All" && g === "All") || currentGenre === g;
                return (
                  <Link
                    key={g}
                    href={buildUrl({ genre: g === "All" ? undefined : g, page: 1 })}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      isActive
                        ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-950/40"
                        : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 border border-cinema-750"
                    }`}
                  >
                    {g}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Filter: Decades */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cinema-400 uppercase tracking-wider">
              <span>Decade / Era</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DECADES.map((d) => {
                const isActive = (currentDecade === "All" && d === "All") || currentDecade === d;
                return (
                  <Link
                    key={d}
                    href={buildUrl({ decade: d === "All" ? undefined : d, page: 1 })}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      isActive
                        ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-950/40"
                        : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 border border-cinema-750"
                    }`}
                  >
                    {d}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sort bar & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cinema-800 text-xs">
            <div className="text-cinema-300">
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> &bull; Showing <strong className="text-amber-400">{paginatedFilms.length}</strong> of {films.length} films
            </div>

            <div className="flex items-center gap-2">
              <span className="text-cinema-400">Sort by:</span>
              <div className="flex flex-wrap gap-1">
                {SORT_OPTIONS.map((opt) => {
                  const isActive = currentSort === opt.value;
                  return (
                    <Link
                      key={opt.value}
                      href={buildUrl({ sort: opt.value === "popular" ? undefined : opt.value, page: 1 })}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        isActive
                          ? "bg-amber-400 text-black font-bold"
                          : "text-cinema-400 hover:text-cinema-200"
                      }`}
                    >
                      {opt.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Film Grid or Empty State */}
        {paginatedFilms.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {paginatedFilms.map((film, index) => (
                <MovieCard key={film.id} film={film} priority={index < 6} />
              ))}
            </div>

            {/* Ad Placement */}
            <div className="my-8">
              <AdSlot placement="between-rows" />
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8 pt-4 border-t border-cinema-800">
                {currentPage > 1 ? (
                  <Link
                    href={buildUrl({ page: currentPage - 1 })}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-cinema-850 hover:bg-cinema-750 text-cinema-200 border border-cinema-750 text-xs font-semibold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-cinema-950 text-cinema-600 border border-cinema-850 text-xs font-semibold cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </span>
                )}

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = p === currentPage;
                  return (
                    <Link
                      key={p}
                      href={buildUrl({ page: p })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                        isCurrent
                          ? "bg-amber-400 text-black shadow-md shadow-amber-950/40"
                          : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 border border-cinema-750"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}

                {currentPage < totalPages ? (
                  <Link
                    href={buildUrl({ page: currentPage + 1 })}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-cinema-850 hover:bg-cinema-750 text-cinema-200 border border-cinema-750 text-xs font-semibold transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-cinema-950 text-cinema-600 border border-cinema-850 text-xs font-semibold cursor-not-allowed">
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="p-12 rounded-2xl bg-cinema-900 border border-cinema-800 text-center space-y-4">
            <Filter className="w-12 h-12 text-cinema-500 mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-white">No qualifying films found</h3>
            <p className="text-xs text-cinema-400 max-w-md mx-auto">
              We couldn&apos;t find any verified archival films matching your current filters. Try resetting the filters or searching with a different term.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold"
            >
              Reset All Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
