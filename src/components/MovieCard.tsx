import React from "react";
import Link from "next/link";
import { Film } from "@/types/film";
import { MoviePoster } from "./MoviePoster";
import { Play, Clock, Scale } from "lucide-react";

interface MovieCardProps {
  film: Film;
  priority?: boolean;
}

export function MovieCard({ film, priority = false }: MovieCardProps) {
  const licenseType = film.license_type || "PD";
  const licenseColorMap: Record<string, string> = {
    PD: "bg-emerald-950 text-emerald-300 border-emerald-600/50",
    CC0: "bg-blue-950 text-blue-300 border-blue-600/50",
    "CC BY": "bg-amber-950 text-amber-300 border-amber-600/50",
    "CC BY-SA": "bg-purple-950 text-purple-300 border-purple-600/50",
  };
  const licenseClass = licenseColorMap[licenseType] || licenseColorMap.PD;

  return (
    <Link
      href={`/watch/${film.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-cinema-900 border border-cinema-800/80 hover:border-amber-400/60 card-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-cinema-950 shadow-md"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-poster w-full overflow-hidden bg-cinema-850">
        <MoviePoster
          src={film.thumbnail}
          alt={`${film.title} poster`}
          title={film.title}
          year={film.year}
          genre={film.genres[0]}
          priority={priority}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Left Badge: Verified License Type */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded backdrop-blur-md text-[10px] font-bold tracking-wide border shadow-sm ${licenseClass}`}>
          <Scale className="w-3 h-3" />
          <span>{licenseType}</span>
        </div>

        {/* Right Badge: Archive Tag */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-400 text-black text-[11px] font-extrabold tracking-wider shadow-md shadow-amber-950/50">
          ARCHIVE
        </div>

        {/* Year tag floating bottom left of poster */}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-cinema-300 text-[10px] font-medium border border-white/10">
          {film.year}
        </div>

        {/* Duration floating bottom right of poster */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-cinema-300 text-[10px] font-medium border border-white/10 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-cinema-400" />
          <span>{film.runtime}</span>
        </div>

        {/* Play Button Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="w-12 h-12 p-3 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl shadow-amber-400/50 transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase border ${licenseClass}`}>
            {licenseType}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cinema-800 text-cinema-300 border border-cinema-700/60 font-mono">
            {film.genres[0] || "Classic"}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-cinema-100 group-hover:text-amber-400 transition-colors line-clamp-1">
          {film.title}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-1 text-xs text-cinema-400">
          <span className="truncate text-[11px] font-medium text-cinema-400">
            {film.creator || film.director || "Archive Collection"}
          </span>
          <span className="text-[11px] text-cinema-400 shrink-0">
            {film.year}
          </span>
        </div>
      </div>
    </Link>
  );
}
