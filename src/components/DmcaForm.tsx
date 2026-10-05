"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";

export function DmcaForm() {
  const searchParams = useSearchParams();
  const prefillTitle = searchParams.get("film") || "";
  const prefillId = searchParams.get("id") || "";

  const [formData, setFormData] = useState({
    work_title: prefillTitle,
    film_identifier: prefillId,
    claimant_name: "",
    claimant_email: "",
    infringement_details: "",
    good_faith_confirmed: false,
    perjury_confirmed: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [ticketId, setTicketId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.good_faith_confirmed || !formData.perjury_confirmed) {
      setErrorMessage("Please check both legal certification checkboxes to submit a formal notice.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/dmca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit DMCA notice.");
      }

      setTicketId(data.ticketId);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please email our agent directly.";
      setErrorMessage(msg);
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 rounded-2xl bg-cinema-900 border border-emerald-500/40 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Notice Received & Logged</h3>
        <p className="text-xs text-cinema-300 max-w-lg mx-auto leading-relaxed">
          Your DMCA takedown notice has been logged under reference ticket:
        </p>
        <div className="inline-block px-4 py-2 rounded-lg bg-cinema-950 border border-cinema-700 text-sm font-mono text-emerald-400">
          {ticketId}
        </div>
        <p className="text-xs text-cinema-400 max-w-md mx-auto">
          Our designated agent will inspect your claim against our public domain records and execute
          immediate de-indexing within <strong>24 hours</strong> of receipt. A confirmation email has been dispatched.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-cinema-900 border border-cinema-800/80 space-y-5 shadow-xl">
      <div className="flex items-center gap-2.5 pb-2 border-b border-cinema-800">
        <ShieldAlert className="w-5 h-5 text-rose-500" />
        <h3 className="text-base font-bold text-white">Submit Online DMCA Notice</h3>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-cinema-200">
            Work Title Claimed <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.work_title}
            onChange={(e) => setFormData({ ...formData, work_title: e.target.value })}
            placeholder="e.g. Night of the Living Dead"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cinema-950 border border-cinema-750 text-white placeholder:text-cinema-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-cinema-200">
            Film Identifier or URL <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.film_identifier}
            onChange={(e) => setFormData({ ...formData, film_identifier: e.target.value })}
            placeholder="e.g. night_of_the_living_dead or /watch/123"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cinema-950 border border-cinema-750 text-white placeholder:text-cinema-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-cinema-200">
            Claimant Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.claimant_name}
            onChange={(e) => setFormData({ ...formData, claimant_name: e.target.value })}
            placeholder="Full Name / Authorized Representative"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cinema-950 border border-cinema-750 text-white placeholder:text-cinema-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-cinema-200">
            Contact Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.claimant_email}
            onChange={(e) => setFormData({ ...formData, claimant_email: e.target.value })}
            placeholder="copyright@yourcompany.com"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cinema-950 border border-cinema-750 text-white placeholder:text-cinema-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-cinema-200">
          Statement of Infringement & Copyright Evidence <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.infringement_details}
          onChange={(e) => setFormData({ ...formData, infringement_details: e.target.value })}
          placeholder="Please describe the copyrighted work, copyright registration numbers (if any), and why this film does not qualify as public domain in your jurisdiction."
          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cinema-950 border border-cinema-750 text-white placeholder:text-cinema-500 focus:outline-none focus:border-rose-500 leading-relaxed"
        />
      </div>

      {/* Certifications required under 17 U.S.C. § 512(c)(3) */}
      <div className="space-y-2.5 pt-2 text-xs text-cinema-300">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.good_faith_confirmed}
            onChange={(e) => setFormData({ ...formData, good_faith_confirmed: e.target.checked })}
            className="mt-0.5 rounded border-cinema-700 bg-cinema-950 text-rose-600 focus:ring-rose-500"
          />
          <span>
            I have a good faith belief that the use of the material in the manner complained of is not
            authorized by the copyright owner, its agent, or the law.
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.perjury_confirmed}
            onChange={(e) => setFormData({ ...formData, perjury_confirmed: e.target.checked })}
            className="mt-0.5 rounded border-cinema-700 bg-cinema-950 text-rose-600 focus:ring-rose-500"
          />
          <span>
            Under penalty of perjury, I certify that the information in this notification is accurate and that
            I am the owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting formal DMCA claim...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Takedown Notice (24-Hour Resolution)</span>
          </>
        )}
      </button>
    </form>
  );
}
