import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site";
import { AdSlot } from "@/components/AdSlot";
import {
  ShieldCheck,
  Clapperboard,
  BookOpen,
  Film,
  Lock,
  Globe2,
  ExternalLink,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Our Archival Mission & Public Domain Legal Framework",
  description:
    "Learn how HD MOVIES indexes and streams verified public domain feature films from the Internet Archive without paywalls.",
};

export default function AboutPage() {
  const siteUrl = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HD MOVIES",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description":
      "Non-commercial archival catalog indexing and streaming verified public domain films from the Internet Archive in high definition.",
  };

  return (
    <div className="w-full pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="header-banner" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-12">
        {/* Intro Banner */}
        <div className="border-b border-cinema-800 pb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Clapperboard className="w-3.5 h-3.5" />
            Preserving Global Cultural Heritage
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Cinema History Belongs to Everyone
          </h1>
          <p className="text-base text-cinema-300 leading-relaxed">
            HD MOVIES is an open-access curation project dedicated to indexing, restoring discovery, and streaming feature films that have legally entered the global public domain.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-cinema-900 border border-cinema-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">100% Free & Legal</h2>
            <p className="text-xs text-cinema-300 leading-relaxed">
              Every title undergoes automated and human rights screening. Only works with confirmed Public Domain or Creative Commons open licenses are shown.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cinema-900 border border-cinema-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Official IA Embeds</h2>
            <p className="text-xs text-cinema-300 leading-relaxed">
              We never pirate, re-host, or scrape commercial platforms like YouTube or Tubi. Video playback is directly streamed via the official Internet Archive player.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cinema-900 border border-cinema-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">No Paywalls Ever</h2>
            <p className="text-xs text-cinema-300 leading-relaxed">
              Timeless cinema should not be locked behind proprietary subscription tiers. Anyone with a web browser can watch instantly with zero account creation required.
            </p>
          </div>
        </div>

        {/* Legal Framework Section */}
        <section id="licensing" className="p-8 rounded-2xl bg-cinema-900 border border-cinema-800 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Understanding the Public Domain Framework
            </h2>
            <p className="text-xs text-cinema-300 leading-relaxed">
              Films enter the public domain in the United States and internationally through several distinct legal mechanisms:
            </p>
          </div>

          <div className="space-y-4 text-xs text-cinema-300">
            <div className="p-4 rounded-xl bg-cinema-950 border border-cinema-800 space-y-1.5">
              <h3 className="font-semibold text-white text-sm">1. Expiration of Copyright Term</h3>
              <p className="leading-relaxed">
                Under United States copyright law, works published before January 1, 1929 (which continually advances each year under public domain day laws) have completely expired copyright protection. Landmark works like <em>Metropolis</em> (1927), <em>Nosferatu</em> (1922), and <em>The General</em> (1926) belong unconditionally to the public.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cinema-950 border border-cinema-800 space-y-1.5">
              <h3 className="font-semibold text-white text-sm">2. Failure of Statutory Formalities</h3>
              <p className="leading-relaxed">
                Prior to the Copyright Act of 1976 and the Berne Convention Implementation Act, works published in the United States required strict copyright notices and timely copyright renewals. Prominent classics such as George A. Romero&apos;s <em>Night of the Living Dead</em> (1968) and Stanley Donen&apos;s <em>Charade</em> (1963) entered the public domain upon theatrical release due to fatal notice omission errors by distributors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cinema-950 border border-cinema-800 space-y-1.5">
              <h3 className="font-semibold text-white text-sm">3. Voluntary Dedication & Open Licenses (CC0 / CC BY)</h3>
              <p className="leading-relaxed">
                Creators and estates frequently dedicate preservation scans or independent projects to the public domain through Creative Commons Zero (CC0) or open educational licensing.
              </p>
            </div>
          </div>
        </section>

        {/* Respect for Copyright Holders */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-cinema-900 to-cinema-850 border border-cinema-750 space-y-3">
          <h2 className="text-lg font-bold text-white">Rights Verification & DMCA Compliance</h2>
          <p className="text-xs text-cinema-300 leading-relaxed">
            While our ingestion pipeline strictly queries metadata tags and license strings from the Internet Archive Advanced Search API, rights determinations can occasionally be contested (e.g. underlying literary rights or localized international copyright restorations). We maintain a zero-friction, guaranteed 24-hour takedown policy for any valid claim.
          </p>
          <div className="pt-2">
            <Link
              href="/dmca"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
            >
              <span>Visit our DMCA & Takedown Portal</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
