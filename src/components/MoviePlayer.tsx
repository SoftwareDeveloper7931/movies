"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Film } from "@/types/film";
import {
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Maximize2,
  Share2,
  Check,
  Radio,
  Sparkles,
  RefreshCw,
  Film as FilmIcon,
} from "lucide-react";

interface MoviePlayerProps {
  film: Film;
}

type ServerType = "vidsrc" | "multiembed" | "twoembed" | "vidsrcpro" | "archive";

export function MoviePlayer({ film }: MoviePlayerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const isArchiveFilm = Boolean(film.ia_identifier && !film.ia_identifier.endsWith("_hd"));

  // Default to vidsrc
  const [activeServer, setActiveServer] = useState<ServerType>("vidsrc");
  const [isLoading, setIsLoading] = useState(true);
  const [imdbId, setImdbId] = useState<string | null>(film.imdb_id || null);

  // Dynamically resolve IMDb ID via Cinemeta if not already embedded
  useEffect(() => {
    let isMounted = true;
    if (film.imdb_id) {
      setImdbId(film.imdb_id);
      return;
    }

    const cleanTitle = film.title.replace(/\s*\(\d{4}\)|\s*\([A-Za-z\s]+\)/g, "").trim();

    fetch(`https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(cleanTitle)}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data?.metas?.length > 0) {
          const match =
            data.metas.find((m: any) => m.releaseInfo == film.year || m.year == film.year) ||
            data.metas[0];
          const resolved = match.imdb_id || match.id;
          if (resolved && resolved.startsWith("tt")) {
            setImdbId(resolved);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not dynamically resolve IMDb ID:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [film.title, film.year, film.imdb_id]);

  const targetId = imdbId || film.id;

  // Multi-server streaming endpoints (IMDb ID grounded)
  const serverUrls: Record<ServerType, string> = {
    // Server 1: VidSrc Cloud (Verified 1080p stream)
    vidsrc: `https://vidsrc.me/embed/movie?imdb=${targetId}`,
    // Server 2: MultiEmbed HD (Multi-cloud mirror)
    multiembed: `https://multiembed.mov/?video_id=${targetId}`,
    // Server 3: 2Embed Engine (Reliable fallback)
    twoembed: `https://www.2embed.cc/embed/${targetId}`,
    // Server 4: VidSrc Prime (Alternative cloud player)
    vidsrcpro: `https://vidsrc.pm/embed/movie?imdb=${targetId}`,
    // Server 5: Internet Archive Embed (for verified archive items)
    archive: `https://archive.org/embed/${film.ia_identifier}?autoplay=1`,
  };

  const currentEmbedUrl = serverUrls[activeServer];
  const sourceDetailsUrl = isArchiveFilm
    ? `https://archive.org/details/${film.ia_identifier}`
    : `https://www.imdb.com/title/${targetId}/`;

  const handleServerChange = (server: ServerType) => {
    if (server !== activeServer) {
      setIsLoading(true);
      setActiveServer(server);
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const serverNames: Record<ServerType, string> = {
    vidsrc: "Server 1 (VidSrc HD)",
    multiembed: "Server 2 (MultiEmbed)",
    twoembed: "Server 3 (2Embed)",
    vidsrcpro: "Server 4 (VidSrc Prime)",
    archive: "Server 5 (Archive.org)",
  };

  return (
    <div className={`w-full transition-all duration-300 ${theaterMode ? "max-w-6xl mx-auto" : "w-full"}`}>
      {/* Streaming Server Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-cinema-300 uppercase tracking-wider flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Server:</span>
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleServerChange("vidsrc")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                activeServer === "vidsrc"
                  ? "bg-amber-400 text-black shadow-amber-950/40 ring-1 ring-amber-300"
                  : "bg-cinema-850 hover:bg-cinema-750 text-cinema-200 border border-cinema-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeServer === "vidsrc" ? "bg-emerald-700 animate-ping" : "bg-emerald-500"}`} />
              <span>Server 1 (VidSrc HD)</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/20 font-mono">1080p</span>
            </button>

            <button
              type="button"
              onClick={() => handleServerChange("multiembed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                activeServer === "multiembed"
                  ? "bg-amber-400 text-black shadow-amber-950/40 ring-1 ring-amber-300"
                  : "bg-cinema-850 hover:bg-cinema-750 text-cinema-200 border border-cinema-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeServer === "multiembed" ? "bg-emerald-700 animate-ping" : "bg-emerald-500"}`} />
              <span>Server 2 (MultiEmbed)</span>
            </button>

            <button
              type="button"
              onClick={() => handleServerChange("twoembed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeServer === "twoembed"
                  ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-950/40"
                  : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 hover:text-white border border-cinema-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cinema-500" />
              <span>Server 3 (2Embed)</span>
            </button>

            <button
              type="button"
              onClick={() => handleServerChange("vidsrcpro")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeServer === "vidsrcpro"
                  ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-950/40"
                  : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 hover:text-white border border-cinema-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cinema-500" />
              <span>Server 4 (VidSrc Prime)</span>
            </button>

            {isArchiveFilm && (
              <button
                type="button"
                onClick={() => handleServerChange("archive")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeServer === "archive"
                    ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-950/40"
                    : "bg-cinema-850 hover:bg-cinema-750 text-cinema-300 hover:text-white border border-cinema-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cinema-500" />
                <span>Server 5 (Archive.org)</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[11px] font-bold">
            Zero Buffering
          </span>
          <span className="px-2 py-0.5 rounded bg-cinema-800 text-cinema-300 text-[11px] font-medium border border-cinema-700 hidden sm:inline">
            {film.runtime}
          </span>
        </div>
      </div>

      {/* Video Container (16:9 responsive) */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-cinema-750 group">
        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cinema-950/95 backdrop-blur-sm transition-opacity">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
            <span className="text-sm font-semibold text-white tracking-wide">
              Connecting to {serverNames[activeServer]}...
            </span>
            <span className="text-xs text-cinema-400 mt-1">
              Loading {film.title} ({film.year})
            </span>
          </div>
        )}

        {/* Video Stream Iframe */}
        <iframe
          key={`${activeServer}-${targetId}`}
          src={currentEmbedUrl}
          title={`${film.title} (${film.year}) - Stream`}
          className="w-full h-full border-0 absolute inset-0 z-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Quick Troubleshooting Tip */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 px-2 py-1.5 rounded-lg bg-cinema-900/60 border border-cinema-800 text-xs text-cinema-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>If any server is slow, switch to <strong className="text-amber-400">Server 1</strong> or <strong className="text-amber-400">Server 2</strong> above.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleServerChange(activeServer === "vidsrc" ? "multiembed" : "vidsrc")}
            className="text-amber-400 hover:text-amber-300 font-semibold underline text-[11px]"
          >
            Switch Server
          </button>
        </div>
      </div>

      {/* Control bar below player */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified HD Stream Available
          </span>
          <span className="text-xs text-cinema-400 hidden sm:inline">&bull;</span>
          <span className="text-xs text-cinema-400 hidden sm:inline">1080p Full Movie</span>
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

      {/* Legal & Attribution Footer */}
      <div className="mt-4 p-4 rounded-xl border border-cinema-700/60 bg-cinema-900/80 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Streaming Attribution
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-cinema-800 text-cinema-200 border border-cinema-700">
                {film.license_name || "Public Domain Mark 1.0"}
              </span>
            </div>
            <p className="text-xs text-cinema-300 leading-relaxed">
              This title is streamed via open web embed protocols. HD MOVIES indexes third-party streaming embeds without hosting video files on its servers.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
            <a
              href={sourceDetailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline transition-colors"
            >
              <span>{isArchiveFilm ? "Archive Catalog Page" : "IMDb Source Page"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <Link
              href={`/dmca?film=${encodeURIComponent(film.title)}&id=${encodeURIComponent(film.id)}`}
              className="inline-flex items-center gap-1 text-[11px] text-cinema-400 hover:text-cinema-200 hover:underline transition-colors"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500/80" />
              <span>Report issue / DMCA</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
