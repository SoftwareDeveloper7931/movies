"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, FastForward, Film } from "lucide-react";

interface PreRollAdProps {
  onComplete: () => void;
  filmTitle: string;
}

export function PreRollAd({ onComplete, filmTitle }: PreRollAdProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Frequency capped to once per session
    const hasSeenPreroll = sessionStorage.getItem("hdmovies_preroll_shown");
    if (hasSeenPreroll) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkipOrFinish = () => {
    sessionStorage.setItem("hdmovies_preroll_shown", "true");
    onComplete();
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex flex-col items-center justify-center border border-cinema-700/80 shadow-2xl">
      {/* Background simulated video texture */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cinema-950 via-cinema-900 to-cinema-850 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Sponsor message / Brand info */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-4">
          <Film className="w-3.5 h-3.5" />
          <span>Sponsor Announcement &bull; Public Domain Supporter</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          Preserving Timeless Cinema For Everyone
        </h3>
        <p className="text-sm text-cinema-300 leading-relaxed mb-6">
          This feature presentation of <span className="text-rose-400 font-semibold">{filmTitle}</span> is brought to you 100% free and legal thanks to our archival partners and sponsors.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-cinema-800/80 hover:bg-cinema-700 text-cinema-200 border border-cinema-600 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {canSkip ? (
            <button
              onClick={handleSkipOrFinish}
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-950/50 flex items-center gap-2"
            >
              <span>Skip to Movie</span>
              <FastForward className="w-4 h-4" />
            </button>
          ) : (
            <div className="px-5 py-2.5 rounded-lg bg-cinema-800/90 border border-cinema-700 text-cinema-300 text-sm font-medium">
              You can skip in <span className="text-white font-bold">{secondsRemaining}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-cinema-400 z-10">
        <span>HD MOVIES Ad Network &bull; Session Capped (1x per session)</span>
        <span>No mid-roll interruptions guaranteed</span>
      </div>
    </div>
  );
}
