import React from "react";
import Link from "next/link";
import { AdSlot } from "./AdSlot";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-cinema-800/80 bg-cinema-950 mt-16 text-cinema-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Footer Ad Placement */}
        <div className="mb-10">
          <AdSlot placement="footer-banner" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="px-2 py-1 rounded bg-amber-400 text-black font-extrabold text-xs tracking-wider shadow-md shadow-amber-950/40 group-hover:scale-105 transition-transform">
                HD
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight leading-none">
                  MOVIES<span className="text-amber-400">.</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-cinema-400 font-semibold mt-0.5">
                  Public Domain
                </span>
              </div>
            </Link>
            <p className="text-xs text-cinema-400 leading-relaxed">
              Curating, preserving, and streaming verified public domain feature films.
              Streaming is powered by the official Internet Archive embedded player.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Open License Archive</span>
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cinema-100">
              Browse Classics
            </h4>
            <ul className="space-y-1.5 text-xs text-cinema-400">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  All Feature Films
                </Link>
              </li>
              <li>
                <Link href="/browse?genre=Film+Noir" className="hover:text-white transition-colors">
                  Film Noir
                </Link>
              </li>
              <li>
                <Link href="/browse?genre=Horror" className="hover:text-white transition-colors">
                  Horror Classics
                </Link>
              </li>
              <li>
                <Link href="/browse?genre=Sci-Fi" className="hover:text-white transition-colors">
                  Sci-Fi & Fantasy
                </Link>
              </li>
              <li>
                <Link href="/browse?genre=Silent" className="hover:text-white transition-colors">
                  Silent Masterpieces
                </Link>
              </li>
              <li>
                <Link href="/browse?decade=1920s" className="hover:text-white transition-colors">
                  1920s Golden Age
                </Link>
              </li>
              <li>
                <Link href="/browse?decade=1940s" className="hover:text-white transition-colors">
                  1940s Wartime Era
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cinema-100">
              Legal & Compliance
            </h4>
            <ul className="space-y-1.5 text-xs text-cinema-400">
              <li>
                <Link href="/dmca" className="hover:text-white text-rose-400 font-medium transition-colors">
                  DMCA & Takedown Policy
                </Link>
              </li>
              <li>
                <Link href="/about#licensing" className="hover:text-white transition-colors">
                  Public Domain Framework
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Cookies
                </Link>
              </li>
              <li>
                <a href="/ads.txt" target="_blank" className="hover:text-white transition-colors">
                  ads.txt Specification
                </a>
              </li>
              <li>
                <a
                  href="https://archive.org/details/feature_films"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Internet Archive Collection</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* About & Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cinema-100">
              Organization
            </h4>
            <ul className="space-y-1.5 text-xs text-cinema-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Archival Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Copyright Agent
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-lg bg-cinema-900 border border-cinema-800 text-[11px] text-cinema-300 leading-snug">
                <span className="font-semibold text-cinema-100 block mb-1">
                  24-Hour Takedown Promise
                </span>
                We remove any disputed work within 24 hours of receiving a valid claim at{" "}
                <span className="text-rose-400">dmca@hdmovies.org</span>.
              </div>
            </div>
          </div>
        </div>

        {/* Moviespedia / HDToday style streaming disclaimer */}
        <div className="py-4 px-6 rounded-xl bg-cinema-900/60 border border-cinema-800/60 text-center text-[11px] text-cinema-400 space-y-1 mb-8">
          <p className="font-medium text-cinema-300">
            Free Access to all Public Domain HD Movies online &bull; No Account Required &bull; Fast Free Legal Streaming on HD MOVIES!
          </p>
          <p className="text-[10px] text-cinema-500">
            Disclaimer: This site does not host or store media files on its servers. All contents are embedded directly via the Internet Archive official player under open public domain licensing.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-cinema-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cinema-400">
          <p>
            &copy; {new Date().getFullYear()} HD MOVIES. Preserving film history for posterity.
          </p>
          <p className="flex items-center gap-1">
            Built with respect for open culture &bull; Powered by Internet Archive & Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
