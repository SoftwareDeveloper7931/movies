import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getFilmById, getRelatedFilms, getAllFilms } from "@/lib/db";
import { getBaseUrl } from "@/lib/site";
import { MoviePlayer } from "@/components/MoviePlayer";
import { MovieCard } from "@/components/MovieCard";
import { AdSlot } from "@/components/AdSlot";
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Share2,
  ExternalLink,
  Film as FilmIcon,
  Star,
} from "lucide-react";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const films = await getAllFilms();
  return films.slice(0, 40).map((f) => ({ id: f.id }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const film = await getFilmById(id);

  if (!film) {
    return {
      title: "Film Not Found",
    };
  }

  const title = `Watch ${film.title} (${film.year}) Free — Public Domain Movie`;
  const description = `Stream ${film.title} (${film.year}) free and legally. ${film.description.slice(0, 150)}... Open license: ${film.license_name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.movie",
      images: [
        {
          url: film.backdrop || film.thumbnail,
          width: 1200,
          height: 630,
          alt: `${film.title} (${film.year})`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [film.backdrop || film.thumbnail],
    },
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const film = await getFilmById(id);

  if (!film) {
    notFound();
  }

  const relatedFilms = await getRelatedFilms(film.id, film.genres, 6);

  // Schema.org Movie structured data for Google Rich Results
  const movieJsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": film.title,
    "description": film.description,
    "image": film.thumbnail,
    "dateCreated": film.year.toString(),
    "datePublished": `${film.year}-01-01`,
    "duration": film.runtime,
    "director": film.director ? { "@type": "Person", "name": film.director } : undefined,
    "genre": film.genres,
    "license": film.license_url,
    "isFamilyFriendly": true,
    "potentialAction": {
      "@type": "WatchAction",
      "target": `${getBaseUrl()}/watch/${film.id}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Internet Archive",
      "url": "https://archive.org",
    },
    "embedUrl": `https://archive.org/embed/${film.ia_identifier}`,
  };

  return (
    <div className="w-full pb-16">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
      />

      {/* Top Breadcrumb & Return Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between text-xs text-cinema-400">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Browse</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span>Watch</span>
            <span>/</span>
            <span className="text-cinema-200 truncate max-w-[200px]">{film.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (Player + Synopsis) */}
          <div className="lg:col-span-8 space-y-6">
            {/* The Official Player */}
            <MoviePlayer film={film} />

            {/* Ad Placement: Below the player */}
            <AdSlot placement="below-player" />

            {/* Movie Details & Synopsis */}
            <div className="p-6 rounded-2xl bg-cinema-900 border border-cinema-800/80 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cinema-800 pb-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                      {film.title}
                    </h1>
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-xs font-extrabold tracking-wider shadow-sm">
                      HD
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-cinema-400">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.8 / 5.0
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cinema-400" />
                      {film.year}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cinema-400" />
                      {film.runtime}
                    </span>
                    {film.director && (
                      <>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-cinema-400" />
                          Directed by {film.director}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Public Domain
                  </span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-cinema-400">Genres:</span>
                {film.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/browse?genre=${encodeURIComponent(genre)}`}
                    className="text-xs px-2.5 py-1 rounded-md bg-cinema-800 hover:bg-cinema-750 text-cinema-200 border border-cinema-700/80 transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              {/* Full Synopsis */}
              <div className="space-y-2 pt-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-cinema-300">
                  Synopsis
                </h2>
                <p className="text-sm text-cinema-200 leading-relaxed">
                  {film.description}
                </p>
              </div>

              {/* Metadata details table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-cinema-800 text-xs">
                <div>
                  <span className="text-cinema-400 block mb-0.5">Internet Archive Identifier</span>
                  <code className="text-cinema-200 bg-cinema-950 px-2 py-1 rounded border border-cinema-800">
                    {film.ia_identifier}
                  </code>
                </div>
                <div>
                  <span className="text-cinema-400 block mb-0.5">License URL</span>
                  <a
                    href={film.license_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-400 hover:underline truncate block"
                  >
                    {film.license_url}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column (Desktop Ads + Quick Info) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Desktop Sidebar Ad Slot */}
            <div className="hidden lg:block">
              <AdSlot placement="sidebar" />
            </div>

            {/* Archival Information Card */}
            <div className="p-5 rounded-2xl bg-cinema-900 border border-cinema-800/80 space-y-3.5 text-xs text-cinema-300">
              <div className="flex items-center gap-2 text-cinema-100 font-semibold text-sm">
                <FilmIcon className="w-4 h-4 text-rose-500" />
                <span>Archival Provenance</span>
              </div>
              <p className="leading-relaxed">
                This recording is preserved in the <strong className="text-white">feature_films</strong> collection of the Internet Archive. Public domain status allows worldwide streaming, educational use, and remixing under open cultural licensing.
              </p>
              <div className="pt-2 border-t border-cinema-800 flex flex-col gap-2">
                <a
                  href={`https://archive.org/details/${film.ia_identifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-cinema-800 hover:bg-cinema-750 text-cinema-100 border border-cinema-700 font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Archive.org Catalog Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href={`/dmca?film=${encodeURIComponent(film.title)}&id=${encodeURIComponent(film.ia_identifier)}`}
                  className="text-center text-[11px] text-cinema-400 hover:text-rose-400 pt-1 transition-colors"
                >
                  Have copyright questions? Submit DMCA Inquiry
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Ad Placement: Between related film rows */}
        <div className="mt-12">
          <AdSlot placement="between-rows" />
        </div>

        {/* Related Films Section */}
        {relatedFilms.length > 0 && (
          <section className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  More Films You Might Enjoy
                </h2>
                <p className="text-xs text-cinema-400 mt-0.5">
                  Similar genres and eras from our public domain vault
                </p>
              </div>
              <Link
                href={`/browse?genre=${encodeURIComponent(film.genres[0] || "Classic")}`}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                Browse more {film.genres[0]}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {relatedFilms.map((related) => (
                <MovieCard key={related.id} film={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
