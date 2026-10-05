"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";

type ConsentStatus = "pending" | "accepted" | "declined";

interface ConsentContextType {
  consent: ConsentStatus;
  acceptConsent: () => void;
  declineConsent: () => void;
  openSettings: () => void;
  showModal: boolean;
  closeModal: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("cookie_consent_updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cookie_consent_updated", callback);
  };
}

function getSnapshot(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  const stored = localStorage.getItem("hdmovies_cookie_consent");
  if (stored === "accepted" || stored === "declined") {
    return stored;
  }
  return "pending";
}

function getServerSnapshot(): ConsentStatus {
  return "pending";
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [explicitModalOpen, setExplicitModalOpen] = useState(false);
  const [explicitModalClosed, setExplicitModalClosed] = useState(false);

  const showModal = (consent === "pending" || explicitModalOpen) && !explicitModalClosed;

  const acceptConsent = () => {
    localStorage.setItem("hdmovies_cookie_consent", "accepted");
    window.dispatchEvent(new CustomEvent("cookie_consent_updated", { detail: { consent: "accepted" } }));
  };

  const declineConsent = () => {
    localStorage.setItem("hdmovies_cookie_consent", "declined");
    window.dispatchEvent(new CustomEvent("cookie_consent_updated", { detail: { consent: "declined" } }));
  };

  const openSettings = () => {
    setExplicitModalClosed(false);
    setExplicitModalOpen(true);
  };

  const closeModal = () => {
    setExplicitModalOpen(false);
    setExplicitModalClosed(true);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        acceptConsent,
        declineConsent,
        openSettings,
        showModal,
        closeModal,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
