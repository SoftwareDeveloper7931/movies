"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film } from "@/types/film";
import {
  ExternalLink,
  AlertTriangle,
  Maximize2,
  Share2,
  Check,
  Scale,
  User,
  Film as FilmIcon,
} from "lucide-react";

interface MoviePlayerProps {
  film: Film;
}

export function MoviePlayer({ film }: MoviePlayerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);

  // Official Internet Archive Embed Player (the only authorized streaming source)
  const embedUrl = `https://archive.org/embed/${film.ia_identifier}?autoplay=1`;
  const archiveItemUrl = `https://archive.org/details/${film.ia_identifier}`;

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // License badge styling
  const licenseType = film.license_type || "PD";
  const licenseColorMap: Record<string, string> = {
    PD: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    CC0: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    "CC BY": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "CC BY-SA": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };
  const licenseBadgeClass = licenseColorMap[licenseType] || licenseColorMap.PD;

  return (
    <div className={`w-full transition-all duration-300 ${theaterMode ? "max-w-6xl mx-auto" : "w-full"}`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-1">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-cinema-300 flex items-center gap-1.5">
            <FilmIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Archive Stream</span>
          </span>

          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${licenseBadgeClass}`}>
            <Scale className="w-3 h-3" />
            <span>{licenseType}</span>
          </span>

          <span className="text-cinema-500 hidden sm:inline">&bull;</span>
          <span className="text-cinema-400 text-[11px] hidden sm:inline">{film.runtime}</span>
        </div>

        {/* Creator / Director Credit */}
        {film.creator && (
          <div className="flex items-center gap-1.5 text-xs text-cinema-300">
            <User className="w-3 h-3 text-cinema-400" />
            <span className="text-cinema-400 text-[11px]">Creator:</span>
            <span className="font-medium text-cinema-200">{film.creator}</span>
          </div>
        )}
      </div>

      {/* Video Container (16:9 responsive) */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-cinema-750">
        <iframe
          src={embedUrl}
          title={`${film.title} (${film.year}) - Internet Archive Player`}
          className="w-full h-full border-0 absolute inset-0 z-0"
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Player Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
        <div className="flex items-center gap-2">
          <a
            href={archiveItemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cinema-850 hover:bg-cinema-750 text-cinema-200 hover:text-white border border-cinema-700 text-xs font-medium transition-colors"
          >
            <span>View on Archive.org</span>
            <ExternalLink className="w-3 h-3 text-cinema-400" />
          </a>

          <a
            href={film.license_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cinema-850 hover:bg-cinema-750 text-cinema-300 hover:text-amber-400 border border-cinema-700 text-xs font-medium transition-colors"
          >
            <Scale className="w-3 h-3 text-amber-400" />
            <span>{film.license_name || licenseType}</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cinema-850 hover:bg-cinema-750 text-cinema-200 border border-cinema-700 text-xs font-medium transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{theaterMode ? "Normal View" : "Theater Mode"}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cinema-850 hover:bg-cinema-750 text-cinema-200 border border-cinema-700 text-xs font-medium transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Verified Provenance & Attribution Box */}
      <div className="mt-4 p-4 rounded-xl border border-cinema-700/60 bg-cinema-900/80 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Verified Provenance
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${licenseBadgeClass}`}>
                {film.license_name || licenseType}
              </span>
            </div>
            <p className="text-xs text-cinema-300 leading-relaxed">
              This film is legally streamed directly from the Internet Archive via its official embed player under a verified open license ({licenseType}).
              {film.creator && (
                <span className="block text-cinema-400 mt-0.5">
                  Attribution: Creator / Director — <strong className="text-cinema-200">{film.creator}</strong>.
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
            <a
              href={archiveItemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline transition-colors"
            >
              <span>Original Archive Item</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <Link
              href={`/dmca?film=${encodeURIComponent(film.title)}&id=${encodeURIComponent(film.id)}`}
              className="inline-flex items-center gap-1 text-[11px] text-cinema-400 hover:text-cinema-200 hover:underline transition-colors"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500/80" />
              <span>Report a problem / DMCA</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
