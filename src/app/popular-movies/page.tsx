import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllFilms } from "@/lib/db";
import { MovieCard } from "@/components/MovieCard";
import { AdSlot } from "@/components/AdSlot";
import { Flame, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Popular Movies — Most Watched Public Domain Films",
  description:
    "Discover the most watched, highest-downloaded public domain and open license feature films from Internet Archive.",
};

interface PopularPageProps {
  searchParams: Promise<{ genre?: string; license?: string }>;
}

const POPULAR_GENRES = [
  "All",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Fantasy",
  "Adventure",
  "Silent",
  "Mystery",
  "Western",
];

export default async function PopularMoviesPage({ searchParams }: PopularPageProps) {
  const resolvedParams = await searchParams;
  const currentGenre = resolvedParams.genre || "All";
  const currentLicense = resolvedParams.license || "All";

  const allFilms = await getAllFilms();

  let filtered = allFilms;
  if (currentGenre !== "All") {
    filtered = filtered.filter((f) =>
      f.genres.some((g) => g.toLowerCase() === currentGenre.toLowerCase())
    );
  }
  if (currentLicense !== "All") {
    filtered = filtered.filter(
      (f) => f.license_type?.toLowerCase() === currentLicense.toLowerCase()
    );
  }

  // Sort by downloads descending
  const popularFilms = [...filtered].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

  return (
    <div className="w-full pb-16">
      {/* Header Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="header-banner" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Header */}
        <div className="border-b border-cinema-800 pb-5 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Trending & Popular</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              {currentGenre !== "All" ? `Popular ${currentGenre} Films` : "Popular Archival Feature Films"}
            </h1>
            <p className="text-xs text-cinema-400 mt-1">
              The most downloaded and watched films in the Internet Archive collection with verified open licenses
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/browse"
              className="px-3.5 py-2 rounded-lg bg-cinema-850 hover:bg-cinema-750 text-cinema-200 border border-cinema-750 transition-colors"
            >
              Browse All ({allFilms.length})
            </Link>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {POPULAR_GENRES.map((genre) => {
            const isActive = currentGenre === genre;
            return (
              <Link
                key={genre}
                href={genre === "All" ? "/popular-movies" : `/popular-movies?genre=${encodeURIComponent(genre)}`}
                className={`text-xs px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
                  isActive
                    ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-950/40"
                    : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 border border-cinema-750"
                }`}
              >
                {genre}
              </Link>
            );
          })}
        </div>

        {/* Popular Movie Grid */}
        {popularFilms.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {popularFilms.slice(0, 48).map((film, index) => (
              <MovieCard key={film.id} film={film} priority={index < 6} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-cinema-900 border border-cinema-800 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-cinema-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No films in this category</h3>
            <p className="text-xs text-cinema-400">
              Try selecting another genre or view all popular titles.
            </p>
            <Link
              href="/popular-movies"
              className="inline-block px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold"
            >
              View All Popular
            </Link>
          </div>
        )}

        {/* Ad Placement */}
        <div className="my-10">
          <AdSlot placement="between-rows" />
        </div>
      </div>
    </div>
  );
}
