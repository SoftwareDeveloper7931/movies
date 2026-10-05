import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DmcaForm } from "@/components/DmcaForm";
import { AdSlot } from "@/components/AdSlot";
import { ShieldAlert, Mail, Clock, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "DMCA & Copyright Takedown Policy",
  description:
    "Designated copyright agent information and 24-hour expedited takedown procedure for HD MOVIES.",
};

const DMCA_EMAIL = process.env.NEXT_PUBLIC_DMCA_EMAIL || "dmca@hdmovies.org";

export default function DmcaPage() {
  return (
    <div className="w-full pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="header-banner" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-10">
        {/* Header */}
        <div className="border-b border-cinema-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            17 U.S.C. § 512 & Open Archive Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            DMCA & Copyright Takedown Policy
          </h1>
          <p className="text-sm text-cinema-300 max-w-2xl leading-relaxed">
            HD MOVIES is committed to respecting the rights of copyright holders. If you believe that your copyrighted work is indexed here erroneously, we guarantee prompt de-indexing within <strong className="text-white">24 hours</strong> of a verified notice.
          </p>
        </div>

        {/* 24-Hour Commitment Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-cinema-900 to-cinema-900 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Guaranteed 24-Hour Removal Protocol
              </h2>
              <p className="text-xs text-cinema-300 mt-0.5">
                All valid claims received by our designated agent result in immediate removal within 24 hours.
              </p>
            </div>
          </div>

          <a
            href={`mailto:${DMCA_EMAIL}?subject=Urgent%20DMCA%20Takedown%20Notice`}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Agent Directly</span>
          </a>
        </div>

        {/* Two Column Section: Form & Policy Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="p-8 text-center text-cinema-400">Loading form...</div>}>
              <DmcaForm />
            </Suspense>
          </div>

          {/* Legal Details / Designated Agent Contact */}
          <div className="lg:col-span-5 space-y-6 text-xs text-cinema-300">
            <div className="p-6 rounded-2xl bg-cinema-900 border border-cinema-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" />
                <span>Designated Copyright Agent</span>
              </h2>

              <p className="leading-relaxed">
                Pursuant to Title 17, United States Code, Section 512(c)(2), notifications of claimed copyright infringement should be sent to our Designated Agent:
              </p>

              <div className="p-3.5 rounded-xl bg-cinema-950 border border-cinema-800 space-y-1 font-mono text-[11px] text-cinema-200">
                <p className="font-semibold text-rose-400">HD MOVIES Legal Department</p>
                <p>Attention: Designated Copyright Agent</p>
                <p>Email: <a href={`mailto:${DMCA_EMAIL}`} className="underline text-rose-300">{DMCA_EMAIL}</a></p>
                <p>Address: 100 Archival Way, Suite 400</p>
                <p>San Francisco, CA 94105</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-cinema-800">
                <h3 className="font-semibold text-cinema-100 text-xs">Required Notice Elements:</h3>
                <ul className="list-disc pl-4 space-y-1 text-cinema-400">
                  <li>Physical or electronic signature of copyright holder.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed.</li>
                  <li>Identification of the material to be removed (URL / Archive identifier).</li>
                  <li>Sufficient contact info (Email, telephone, address).</li>
                  <li>A statement of good faith belief.</li>
                  <li>A statement of accuracy under penalty of perjury.</li>
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cinema-900 border border-cinema-800 space-y-2">
              <h3 className="font-bold text-cinema-100 text-xs">Important Note on Archival Hosting</h3>
              <p className="text-cinema-400 leading-relaxed">
                HD MOVIES does not re-host, download, or copy video files. All media streams are embedded directly from the <strong className="text-cinema-200">Internet Archive</strong> (archive.org). De-indexing a link on HD MOVIES removes it from our catalog, but does not remove it from the Internet Archive’s independent repository.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
