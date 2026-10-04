import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedFilms,
  getRecentlyAddedFilms,
  getPopularFilms,
  getFilmsByIndustry,
  getAllFilms,
} from "@/lib/db";
import { getBaseUrl } from "@/lib/site";
import { Film } from "@/types/film";
import { MovieCard } from "@/components/MovieCard";
import { AdSlot } from "@/components/AdSlot";
import {
  Play,
  Info,
  ShieldCheck,
  Sparkles,
  Clapperboard,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";

export const revalidate = 3600; // Revalidate every hour for fresh content

const GENRE_LIST = [
  { name: "Horror", slug: "Horror", count: "12+ films", icon: "👻" },
  { name: "Film Noir", slug: "Film Noir", count: "10+ films", icon: "🕵️" },
  { name: "Sci-Fi", slug: "Sci-Fi", count: "8+ films", icon: "🚀" },
  { name: "Silent", slug: "Silent", count: "9+ films", icon: "🎞️" },
  { name: "Comedy", slug: "Comedy", count: "11+ films", icon: "🎭" },
  { name: "Mystery", slug: "Mystery", count: "14+ films", icon: "🔍" },
  { name: "Drama", slug: "Drama", count: "15+ films", icon: "🎬" },
  { name: "Adventure", slug: "Adventure", count: "7+ films", icon: "⚔️" },
];

const DECADE_LIST = [
  { name: "1920s", slug: "1920s", title: "Silent Era Pioneers", desc: "Expressionism & early cinema breakthroughs" },
  { name: "1930s", slug: "1930s", title: "Golden Age Dawn", desc: "Pre-code dramas & monster cinema" },
  { name: "1940s", slug: "1940s", title: "Film Noir Epoch", desc: "Shadows, cynics & hard-boiled intrigue" },
  { name: "1950s", slug: "1950s", title: "Sci-Fi & Cold War B-Movies", desc: "Atomic terror & drive-in thrills" },
  { name: "1960s", slug: "1960s", title: "Counterculture Dawn", desc: "Independent cinema & gothic horror" },
];

export default async function HomePage() {
  const [featuredFilms, hollywoodFilms, bollywoodFilms, southIndianFilms] = await Promise.all([
    getFeaturedFilms(),
    getFilmsByIndustry("Hollywood", 6),
    getFilmsByIndustry("Bollywood", 6),
    getFilmsByIndustry("South Indian", 6),
  ]);

  const heroFilm = featuredFilms[0] || hollywoodFilms[0];

  const siteUrl = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HD MOVIES",
    "url": siteUrl,
    "description": "Stream 1000+ legal free movies from Hollywood, Bollywood, and South Indian cinema in high definition.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Schema.org WebSite structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot placement="header-banner" />
      </div>

      {/* Hero Section */}
      {heroFilm && (
        <section className="relative w-full min-h-[500px] lg:min-h-[580px] flex items-center overflow-hidden border-b border-cinema-800/60 bg-cinema-950">
          {/* Backdrop Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={heroFilm.backdrop || heroFilm.thumbnail}
              alt={heroFilm.title}
              fill
              priority
              className="object-cover object-center brightness-[0.35] filter blur-sm scale-105"
              unoptimized
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div className="max-w-2xl space-y-4">
              {/* Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-extrabold text-xs tracking-wider shadow-md shadow-amber-950/40">
                  HD
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                  heroFilm.industry === "Bollywood"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-600/50"
                    : heroFilm.industry === "South Indian"
                    ? "bg-purple-950 text-purple-300 border border-purple-600/50"
                    : "bg-amber-950 text-amber-300 border border-amber-600/50"
                }`}>
                  {heroFilm.industry}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cinema-800/80 border border-cinema-700/80 text-cinema-300 text-xs">
                  {heroFilm.year}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cinema-800/80 border border-cinema-700/80 text-cinema-300 text-xs">
                  {heroFilm.runtime}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none font-display">
                {heroFilm.title}
              </h1>

              {/* Synopsis */}
              <p className="text-sm sm:text-base text-cinema-200 leading-relaxed line-clamp-3">
                {heroFilm.description}
              </p>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {heroFilm.genres.map((g: string) => (
                  <Link
                    key={g}
                    href={`/browse?genre=${encodeURIComponent(g)}`}
                    className="text-xs px-2.5 py-1 rounded-md bg-cinema-900/80 hover:bg-cinema-800 hover:text-amber-400 text-cinema-300 border border-cinema-700/60 transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <Link
                  href={`/watch/${heroFilm.id}`}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm transition-all shadow-xl shadow-amber-950/60 flex items-center gap-2 group"
                >
                  <Play className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
                  <span>Watch Free Now</span>
                </Link>

                <Link
                  href={`/watch/${heroFilm.id}`}
                  className="px-5 py-3 rounded-xl bg-cinema-850/90 hover:bg-cinema-750 text-cinema-100 font-medium text-sm border border-cinema-700 transition-colors flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-cinema-400" />
                  <span>Film Details & Stream</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-8 w-full">
        {/* Industry Fast Hub: Hollywood, Bollywood, South Indian */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/browse?industry=Hollywood"
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-cinema-900 to-cinema-900 border border-amber-500/30 hover:border-amber-400 transition-all group flex items-center justify-between shadow-lg"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Western Cinema
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Hollywood Movies
              </h3>
              <p className="text-xs text-cinema-400 mt-1">
                700+ Blockbusters, Oscar Winners & Cult Classics
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            href="/browse?industry=Bollywood"
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-cinema-900 to-cinema-900 border border-emerald-500/30 hover:border-emerald-400 transition-all group flex items-center justify-between shadow-lg"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Hindi Cinema
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Bollywood Movies
              </h3>
              <p className="text-xs text-cinema-400 mt-1">
                150+ Iconic Blockbusters, Romance & Action
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            href="/browse?industry=South+Indian"
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-cinema-900 to-cinema-900 border border-purple-500/30 hover:border-purple-400 transition-all group flex items-center justify-between shadow-lg"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Pan-Indian Cinema
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                South Indian Movies
              </h3>
              <p className="text-xs text-cinema-400 mt-1">
                200+ Telugu, Tamil, Malayalam & Kannada Hits
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </section>

        {/* Section 1: Hollywood Blockbusters */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Popular Hollywood Movies
              </h2>
              <p className="text-xs text-cinema-400 mt-0.5">
                Top-rated English blockbusters and world-renowned classics
              </p>
            </div>
            <Link
              href="/browse?industry=Hollywood"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Hollywood</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {hollywoodFilms.map((film: Film, index: number) => (
              <MovieCard key={film.id} film={film} priority={index < 6} />
            ))}
          </div>
        </section>

        {/* Ad Placement: Between Rows */}
        <AdSlot placement="between-rows" />

        {/* Section 2: Best of Bollywood */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Best of Bollywood
              </h2>
              <p className="text-xs text-cinema-400 mt-0.5">
                The greatest Hindi movies from romantic epics to high-octane blockbusters
              </p>
            </div>
            <Link
              href="/browse?industry=Bollywood"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Bollywood</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {bollywoodFilms.map((film: Film) => (
              <MovieCard key={film.id} film={film} />
            ))}
          </div>
        </section>

        {/* Section 3: South Indian Cinema Hits */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                South Indian Cinema Hits
              </h2>
              <p className="text-xs text-cinema-400 mt-0.5">
                Sensational Telugu, Tamil, Malayalam & Kannada pan-Indian masterworks
              </p>
            </div>
            <Link
              href="/browse?industry=South+Indian"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All South Indian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {southIndianFilms.map((film: Film) => (
              <MovieCard key={film.id} film={film} />
            ))}
          </div>
        </section>

        {/* Browse by Genre */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-500" />
              Explore by Genre
            </h2>
            <p className="text-xs text-cinema-400 mt-0.5">
              From eerie gothic horror to atmospheric hard-boiled film noir
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GENRE_LIST.map((genre) => (
              <Link
                key={genre.slug}
                href={`/browse?genre=${encodeURIComponent(genre.slug)}`}
                className="group p-4 rounded-xl bg-cinema-900/90 border border-cinema-800 hover:border-rose-500/50 hover:bg-cinema-850 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{genre.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm text-cinema-100 group-hover:text-rose-400 transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-[11px] text-cinema-400">{genre.count}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cinema-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Decade */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-rose-500" />
              Decades of Cinema
            </h2>
            <p className="text-xs text-cinema-400 mt-0.5">
              Experience the evolution of movie history across the 20th century
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DECADE_LIST.map((decade) => (
              <Link
                key={decade.slug}
                href={`/browse?decade=${decade.slug}`}
                className="group p-4 rounded-xl bg-cinema-900 border border-cinema-800/90 hover:border-rose-500/50 hover:bg-cinema-850 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xl font-bold text-white group-hover:text-rose-400 font-display">
                    {decade.name}
                  </div>
                  <h4 className="text-xs font-semibold text-cinema-200 mt-1">
                    {decade.title}
                  </h4>
                  <p className="text-[11px] text-cinema-400 mt-1 leading-snug">
                    {decade.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-cinema-800 flex items-center justify-between text-xs text-rose-400 font-medium">
                  <span>Browse era</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Public Domain Educational & Rights Transparency Box */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cinema-900 via-cinema-850 to-cinema-900 border border-cinema-700/60 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              100% Free, Legal & Archival Cinema
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why are these feature films completely free to stream?
            </h2>
            <p className="text-sm text-cinema-300 leading-relaxed">
              Every film in our collection belongs to the global <strong className="text-white">Public Domain</strong> or is licensed under <strong className="text-white">Creative Commons</strong>. Works enter the public domain when their copyright term expires or when original copyright formalities were not fulfilled. We stream exclusively via the official embed player provided by the 501(c)(3) non-profit <strong className="text-white">Internet Archive</strong> without copying or re-hosting video files.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/about"
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
              >
                <span>Read our public domain framework</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-cinema-600">&bull;</span>
              <Link
                href="/dmca"
                className="text-xs text-cinema-400 hover:text-cinema-200 hover:underline"
              >
                Have questions regarding rights? Contact our copyright agent
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
