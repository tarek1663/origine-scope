"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNavbar({ variant }: { variant?: "default" | "analyze" }) {
  const [scrolled, setScrolled] = useState(false);
  const isAnalyze = variant === "analyze";

  useEffect(() => {
    if (isAnalyze) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAnalyze]);

  const navStyle = isAnalyze
    ? { backgroundColor: "transparent", borderBottom: "1px solid transparent", backdropFilter: "none" as const }
    : {
        backgroundColor: scrolled ? "#0d1117" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(12px)" as const : "none" as const,
      };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-8 transition-all duration-300"
      style={navStyle}
    >
      <Link
        href="/"
        className="font-heading text-white text-xl font-semibold tracking-tight transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
      >
        OrigineScope
      </Link>
      {isAnalyze ? (
        <Link
          href="/"
          className="text-white/90 text-sm font-medium hover:text-white transition-colors"
        >
          ← Back to home
        </Link>
      ) : (
        <Link
          href="/analyze"
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C1440E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]"
          style={{ backgroundColor: "#C1440E", boxShadow: scrolled ? "0 2px 12px rgba(193, 68, 14, 0.25)" : "none" }}
        >
          Get started
        </Link>
      )}
    </nav>
  );
}
