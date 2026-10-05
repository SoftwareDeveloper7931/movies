"use client";

import React, { useEffect } from "react";
import { useConsent } from "@/context/ConsentContext";
import { Info } from "lucide-react";

export type AdPlacement =
  | "header-banner"
  | "sidebar"
  | "below-player"
  | "between-rows"
  | "footer-banner";

interface AdSlotProps {
  placement: AdPlacement;
  slotId?: string;
  className?: string;
}

const PLACEMENT_CONFIGS: Record<
  AdPlacement,
  {
    label: string;
    dimensions: string;
    containerClass: string;
    width: number;
    height: number;
  }
> = {
  "header-banner": {
    label: "Header Leaderboard",
    dimensions: "728x90 (Desktop) / 320x50 (Mobile)",
    containerClass: "w-full max-w-[728px] min-h-[90px] mx-auto my-3",
    width: 728,
    height: 90,
  },
  "sidebar": {
    label: "Sidebar Display",
    dimensions: "300x250 / 300x600",
    containerClass: "w-full max-w-[300px] min-h-[250px] mx-auto my-4",
    width: 300,
    height: 250,
  },
  "below-player": {
    label: "Player Sponsor",
    dimensions: "728x90 Banner",
    containerClass: "w-full max-w-[728px] min-h-[90px] mx-auto my-4",
    width: 728,
    height: 90,
  },
  "between-rows": {
    label: "Catalog Banner",
    dimensions: "728x90 Responsive",
    containerClass: "w-full max-w-[728px] min-h-[90px] mx-auto my-6",
    width: 728,
    height: 90,
  },
  "footer-banner": {
    label: "Footer Leaderboard",
    dimensions: "728x90 Responsive",
    containerClass: "w-full max-w-[728px] min-h-[90px] mx-auto mt-6 mb-2",
    width: 728,
    height: 90,
  },
};

export function AdSlot({ placement, slotId, className = "" }: AdSlotProps) {
  const { consent } = useConsent();
  const config = PLACEMENT_CONFIGS[placement];

  useEffect(() => {
    // Only load external ad scripts if the user gave explicit cookie consent
    if (consent === "accepted") {
      try {
        if (typeof window !== "undefined") {
          const win = window as unknown as { adsbygoogle?: unknown[] };
          if (win.adsbygoogle) {
            win.adsbygoogle.push({});
          }
        }
      } catch (e) {
        console.warn("Ad network initialization:", e);
      }
    }
  }, [consent]);

  return (
    <aside
      aria-label={`Advertisement: ${config.label}`}
      className={`relative flex flex-col items-center justify-center ${config.containerClass} ${className}`}
    >
      {/* Reserved height wrapper to strictly prevent CLS (Cumulative Layout Shift) */}
      <div className="w-full h-full flex flex-col items-center justify-center p-2 rounded-lg border border-cinema-800/80 bg-cinema-900/60 backdrop-blur-sm text-center">
        {/* Subtle ethical ad disclosure */}
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-cinema-400 mb-1">
          <Info className="w-3 h-3" />
          <span>Advertisement &bull; {config.label}</span>
        </div>

        {consent === "accepted" ? (
          <div className="w-full flex items-center justify-center overflow-hidden py-1">
            {/* If Google AdSense or ad tag is configured via environment variables */}
            {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ? (
              <ins
                className="adsbygoogle"
                style={{ display: "inline-block", width: config.width, height: config.height }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                data-ad-slot={slotId || "1234567890"}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-xs text-cinema-300 py-3">
                <span className="font-medium text-cinema-200">Public Domain Preservation Sponsor</span>
                <span className="text-[11px] text-cinema-400 mt-0.5">
                  Standard IAB {config.dimensions} placement &bull; ads.txt compliant
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 text-cinema-400 text-xs">
            <span className="text-[11px]">
              {consent === "declined"
                ? "Ad scripts disabled (Essential cookies only)"
                : "Awaiting cookie preferences..."}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
