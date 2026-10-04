import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConsentProvider } from "@/context/ConsentContext";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

import { getBaseUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "HD MOVIES — Free & Legal Public Domain Feature Films",
    template: "%s | HD MOVIES",
  },
  description:
    "Stream verified public domain and Creative Commons feature films legally in high definition. Powered by the official Internet Archive player without paywalls or subscriptions.",
  keywords: [
    "HD movies",
    "public domain movies",
    "free classic movies",
    "watch old movies free",
    "Internet Archive movies",
    "film noir streaming",
    "classic horror movies",
    "silent films streaming",
    "legal free movies",
    "open license cinema",
  ],
  authors: [{ name: "HD MOVIES Preservation Initiative" }],
  creator: "HD MOVIES",
  publisher: "HD MOVIES",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getBaseUrl(),
    siteName: "HD MOVIES",
    title: "HD MOVIES — Watch Legal Public Domain Movies",
    description:
      "Explore and stream hundreds of timeless public domain feature films from the Internet Archive collection.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HD MOVIES Streaming Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HD MOVIES — Legal Public Domain Feature Films",
    description:
      "Stream verified public domain films from the Internet Archive collection with zero subscription fees.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#06080d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark h-full`}>
      <head>
        {/* Preconnect to Internet Archive media servers for speed */}
        <link rel="preconnect" href="https://archive.org" />
        <link rel="dns-prefetch" href="https://archive.org" />
      </head>
      <body className="min-h-full flex flex-col bg-cinema-950 text-cinema-100 selection:bg-rose-600 selection:text-white antialiased">
        <ConsentProvider>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">{children}</main>
          <Footer />
          <CookieConsent />
        </ConsentProvider>
      </body>
    </html>
  );
}
