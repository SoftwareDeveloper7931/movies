"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Scale,
} from "lucide-react";

const GENRES = [
  "Film Noir",
  "Horror",
  "Sci-Fi",
  "Comedy",
  "Drama",
  "Mystery",
  "Silent",
  "Western",
  "Adventure",
  "Thriller",
  "Crime",
  "Action",
  "Documentary",
];

const DECADES = [
  { label: "1910s — Silent Pioneers", value: "1910s" },
  { label: "1920s — Expressionism & Silent Era", value: "1920s" },
  { label: "1930s — Golden Age Dawn", value: "1930s" },
  { label: "1940s — Film Noir & Classic Dramas", value: "1940s" },
  { label: "1950s — Sci-Fi & Drive-In Classics", value: "1950s" },
  { label: "1960s — Cult Cinema & Gothic Horror", value: "1960s" },
  { label: "1970s — New Wave & Grindhouse", value: "1970s" },
];

const LICENSES = [
  { label: "Public Domain Mark 1.0 (PD)", value: "PD" },
  { label: "Creative Commons Zero (CC0)", value: "CC0" },
  { label: "Creative Commons Attribution (CC BY)", value: "CC BY" },
  { label: "CC Attribution-ShareAlike (CC BY-SA)", value: "CC BY-SA" },
];

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const genresRef = useRef<HTMLDivElement>(null);
  const decadesRef = useRef<HTMLDivElement>(null);
  const licensesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        genresRef.current &&
        !genresRef.current.contains(event.target as Node) &&
        decadesRef.current &&
        !decadesRef.current.contains(event.target as Node) &&
        licensesRef.current &&
        !licensesRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="px-2 py-1 rounded bg-amber-400 text-black font-extrabold text-sm tracking-wider shadow-md shadow-amber-950/40 group-hover:scale-105 transition-transform">
              ARCHIVE
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                CINEMA<span className="text-amber-400">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-cinema-400 font-semibold mt-0.5">
                Verified Open Licenses
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cinema-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive titles, creators, genres..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-cinema-900 border border-cinema-750 text-xs text-cinema-100 placeholder-cinema-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-cinema-200">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>

            <Link href="/browse" className="hover:text-white transition-colors">
              Browse All
            </Link>

            <Link href="/popular-movies" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>Popular</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-400 font-semibold">ARCHIVE</span>
            </Link>

            {/* Genres Dropdown */}
            <div className="relative" ref={genresRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "genres" ? null : "genres")}
                className="flex items-center gap-1 hover:text-white transition-colors py-2 text-xs font-semibold"
              >
                <span>Genres</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "genres" && (
                <div className="absolute top-full -left-10 mt-1 w-72 rounded-xl bg-cinema-900 border border-cinema-750 shadow-2xl p-3 z-50 animate-fade-in">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cinema-400 px-2 pb-2 mb-2 border-b border-cinema-800">
                    Filter by Genre
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {GENRES.map((g) => (
                      <Link
                        key={g}
                        href={`/browse?genre=${encodeURIComponent(g)}`}
                        onClick={() => setOpenDropdown(null)}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-cinema-800 text-cinema-200 hover:text-amber-400 transition-colors"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Decades Dropdown */}
            <div className="relative" ref={decadesRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "decades" ? null : "decades")}
                className="flex items-center gap-1 hover:text-white transition-colors py-2 text-xs font-semibold"
              >
                <span>Decades</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "decades" && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-cinema-900 border border-cinema-750 shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cinema-400 px-3 py-1.5 border-b border-cinema-800">
                    Cinema Eras
                  </div>
                  {DECADES.map((d) => (
                    <Link
                      key={d.value}
                      href={`/browse?decade=${d.value}`}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-1.5 rounded-lg hover:bg-cinema-800 text-cinema-200 hover:text-white transition-colors"
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Licenses Dropdown */}
            <div className="relative" ref={licensesRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "licenses" ? null : "licenses")}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors py-2 text-xs font-semibold"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Licenses</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "licenses" && (
                <div className="absolute top-full right-0 mt-1 w-64 rounded-xl bg-cinema-900 border border-cinema-750 shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cinema-400 px-3 py-1.5 border-b border-cinema-800">
                    Verified Open Licenses
                  </div>
                  {LICENSES.map((l) => (
                    <Link
                      key={l.value}
                      href={`/browse?license=${encodeURIComponent(l.value)}`}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-1.5 rounded-lg hover:bg-cinema-800 text-cinema-200 hover:text-emerald-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-white transition-colors text-xs text-cinema-300">
              About
            </Link>

            <Link
              href="/dmca"
              className="text-xs px-2.5 py-1 rounded-lg bg-cinema-850 hover:bg-cinema-750 text-cinema-300 hover:text-white border border-cinema-700 transition-colors"
            >
              DMCA
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-cinema-300 hover:text-white hover:bg-cinema-850 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-cinema-800/80 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="mb-4 px-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-cinema-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-cinema-900 border border-cinema-750 text-xs text-cinema-100 placeholder-cinema-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-medium text-cinema-200">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-cinema-850 hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/browse"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-cinema-850 hover:text-white"
              >
                Browse All Movies
              </Link>
              <Link
                href="/popular-movies"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-cinema-850 hover:text-white text-amber-400 font-semibold"
              >
                Popular Movies
              </Link>

              <div className="px-3 pt-2 text-[11px] font-bold uppercase tracking-wider text-cinema-400">
                Explore Genres
              </div>
              <div className="grid grid-cols-2 gap-1 px-3">
                {GENRES.slice(0, 8).map((g) => (
                  <Link
                    key={g}
                    href={`/browse?genre=${encodeURIComponent(g)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs py-1 text-cinema-300 hover:text-white"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <div className="px-3 pt-2 text-[11px] font-bold uppercase tracking-wider text-cinema-400">
                Eras & Decades
              </div>
              <div className="grid grid-cols-2 gap-1 px-3">
                {DECADES.slice(1, 5).map((d) => (
                  <Link
                    key={d.value}
                    href={`/browse?decade=${d.value}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs py-1 text-cinema-300 hover:text-white"
                  >
                    {d.value}
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-cinema-800/80">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-cinema-850 hover:text-white text-xs"
                >
                  About & Open License Framework
                </Link>
                <Link
                  href="/dmca"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-cinema-850 text-rose-400 font-medium text-xs"
                >
                  DMCA Takedown Policy
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
