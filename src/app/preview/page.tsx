"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MigrationMap } from "@/components/MigrationMap";
import { PremiumWorldMap } from "@/components/PremiumWorldMap";
import EthnicGroups from "@/components/EthnicGroups";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { LandingNavbar } from "@/components/LandingNavbar";
import type { RegionKey } from "@/components/WorldMap";
import { estimateOrigins, getRegionParagraph } from "@/lib/estimateOrigins";

const FORM_STORAGE_KEY = "origine-scope-form";
const PAID_STORAGE_KEY = "origineScope_paid";
const OFFER_EXPIRY_KEY = "origineScope_offerExpiry";
const OFFER_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const FIVE_MINUTES_MS = 5 * 60 * 1000;

interface FormData {
  firstName: string;
  lastName: string;
  fatherCountry: string;
  motherCountry: string;
}

function loadFormData(): FormData {
  if (typeof window === "undefined")
    return { firstName: "", lastName: "", fatherCountry: "", motherCountry: "" };
  try {
    const s = localStorage.getItem(FORM_STORAGE_KEY);
    if (s) return { ...{ firstName: "", lastName: "", fatherCountry: "", motherCountry: "" }, ...JSON.parse(s) };
  } catch {}
  return { firstName: "", lastName: "", fatherCountry: "", motherCountry: "" };
}

const REGION_COLORS: Record<string, string> = {
  "Southern Europe": "#C1440E",
  "Eastern Europe": "#1B3A6B",
  "Western Europe": "#2D6A4F",
  "North Africa": "#F59E0B",
  "Other regions": "#9CA3AF",
};

const NOTABLE_ANCESTORS_BY_REGION: Record<string, [string, string, string]> = {
  "Southern Europe": ["Leonardo da Vinci", "Miguel de Cervantes", "Isabella of Castile"],
  "Eastern Europe": ["Nicholas II of Russia", "Marie Curie", "Frédéric Chopin"],
  "Western Europe": ["Victor Hugo", "Johann Sebastian Bach", "Marie Antoinette"],
  "North Africa": ["Ibn Khaldun", "Averroes", "Fatima al-Fihri"],
  "Other regions": ["Alexander the Great", "Cleopatra", "Hannibal"],
};

function useOfferCountdown() {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let expiry = 0;
    try {
      const stored = localStorage.getItem(OFFER_EXPIRY_KEY);
      if (stored) {
        expiry = parseInt(stored, 10);
      }
      if (!stored || isNaN(expiry) || expiry <= Date.now()) {
        expiry = Date.now() + OFFER_DURATION_MS;
        localStorage.setItem(OFFER_EXPIRY_KEY, String(expiry));
      }
    } catch {
      expiry = Date.now() + OFFER_DURATION_MS;
      try {
        localStorage.setItem(OFFER_EXPIRY_KEY, String(expiry));
      } catch {}
    }
    const tick = () => {
      const left = expiry - Date.now();
      if (left <= 0) {
        setRemainingMs(0);
        setExpired(true);
        return;
      }
      setRemainingMs(left);
      setExpired(false);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const totalSeconds = remainingMs === null ? 0 : Math.max(0, Math.floor(remainingMs / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const display = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const isUrgent = remainingMs !== null && remainingMs > 0 && remainingMs < FIVE_MINUTES_MS;

  const progress = remainingMs !== null ? Math.max(0, remainingMs / OFFER_DURATION_MS) : 1;
  return { display, expired, isUrgent, remainingMs, progress };
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [shares, setShares] = useState<ReturnType<typeof estimateOrigins> | null>(null);
  const [regionPercentages, setRegionPercentages] = useState<Partial<Record<RegionKey, number>>>({});
  const [barsVisible, setBarsVisible] = useState(false);
  const [nameRevealed, setNameRevealed] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaidConfetti, setShowPaidConfetti] = useState(false);
  const [profileShares, setProfileShares] = useState<Array<{ name: string; picture: string }>>([]);
  const [nameAnalysis, setNameAnalysis] = useState<Record<string, unknown> | null>(null);
  const [nameLoading, setNameLoading] = useState(true);
  const nameSectionRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const blob4Ref = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState<Record<string, boolean>>({ header: true, statRow: true });
  const headerRef = useRef<HTMLElement>(null);
  const statRowRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const culturalRef = useRef<HTMLElement>(null);
  const migrationRef = useRef<HTMLDivElement>(null);
  const unlockCardRef = useRef<HTMLElement>(null);
  const { display: countdownDisplay, expired, isUrgent, progress } = useOfferCountdown();

  useEffect(() => {
    const form = loadFormData();
    setFormData(form);
    const result = estimateOrigins(form.lastName, form.fatherCountry, form.motherCountry);
    setShares(result);
    const pct: Partial<Record<RegionKey, number>> = {};
    result.forEach((s) => {
      pct[s.key] = s.percentage;
    });
    setRegionPercentages(pct);
  }, []);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(FORM_STORAGE_KEY) : null;
    let lastName = "";
    let firstName = "";
    let fatherCountry = "Unknown";
    let motherCountry = "Unknown";
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        lastName = parsed.lastName || "";
        firstName = parsed.firstName || "";
        fatherCountry = parsed.fatherCountry || "Unknown";
        motherCountry = parsed.motherCountry || "Unknown";
      } catch {}
    }
    if (!lastName) {
      lastName = typeof window !== "undefined" ? (localStorage.getItem("origineScope_lastName") || localStorage.getItem("lastName") || "") : "";
      firstName = typeof window !== "undefined" ? (localStorage.getItem("origineScope_firstName") || localStorage.getItem("firstName") || "") : "";
      fatherCountry = typeof window !== "undefined" ? (localStorage.getItem("origineScope_fatherCountry") || localStorage.getItem("fatherCountry") || "Unknown") : "Unknown";
      motherCountry = typeof window !== "undefined" ? (localStorage.getItem("origineScope_motherCountry") || localStorage.getItem("motherCountry") || "Unknown") : "Unknown";
    }
    if (lastName) {
      fetch("/api/analyze-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastName, firstName, fatherCountry, motherCountry }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setNameAnalysis(data);
          setNameLoading(false);
        })
        .catch(() => setNameLoading(false));
    } else {
      setNameLoading(false);
    }
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get("paid") === "true";
    const fromStorage = typeof window !== "undefined" && localStorage.getItem(PAID_STORAGE_KEY) === "true";
    if (fromUrl) {
      setIsPaid(true);
      try {
        localStorage.setItem(PAID_STORAGE_KEY, "true");
      } catch {}
      setShowPaidConfetti(true);
      window.history.replaceState({}, "", window.location.pathname || "/preview");
      const t = setTimeout(() => setShowPaidConfetti(false), 2000);
      return () => clearTimeout(t);
    }
    if (fromStorage) setIsPaid(true);
  }, [searchParams]);

  const handleShare = async () => {
    if (!shares || shares.length === 0) return;
    const text = `My origins according to OrigineTrace: ${shares.map((s) => `${s.region} ${s.percentage}%`).join(", ")}. Discover yours!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My origins — OrigineTrace",
          text,
          url: typeof window !== "undefined" ? window.location.origin : "",
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(text);
        }
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = nameSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setNameRevealed(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallax on aurora blobs — 30% of scroll speed
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY * 0.3;
      [blob1Ref, blob2Ref, blob3Ref, blob4Ref].forEach((ref) => {
        if (ref.current) ref.current.style.transform = `translateY(${y}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section scroll-in animations
  useEffect(() => {
    const refs: { ref: React.RefObject<HTMLElement | HTMLDivElement | null>; key: string }[] = [
      { ref: headerRef, key: "header" },
      { ref: statRowRef, key: "statRow" },
      { ref: leftColRef, key: "leftCol" },
      { ref: rightColRef, key: "rightCol" },
      { ref: nameSectionRef as React.RefObject<HTMLDivElement>, key: "name" },
      { ref: culturalRef, key: "cultural" },
      { ref: migrationRef, key: "migration" },
      { ref: unlockCardRef, key: "unlock" },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = (entry.target as HTMLElement).dataset.section;
          if (key && entry.isIntersecting) setSectionVisible((v) => ({ ...v, [key]: true }));
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    const t = setTimeout(() => {
      refs.forEach(({ ref, key }) => {
        const el = ref.current;
        if (el) {
          el.dataset.section = key;
          observer.observe(el);
        }
      });
    }, 100);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isPaid) return;
    fetch("https://randomuser.me/api/?results=3")
      .then((res) => res.json())
      .then((data: { results?: Array<{ name: { first: string; last: string }; picture: { medium: string } }> }) => {
        const list = (data.results || []).map((u) => ({
          name: `${u.name.first} ${u.name.last}`,
          picture: u.picture.medium,
        }));
        setProfileShares(list);
      })
      .catch(() => setProfileShares([]));
  }, [isPaid]);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      const url = expired ? "/api/create-checkout?expired=true" : "/api/create-checkout";
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const buttonText = expired
    ? "Yes, reveal my full origins — $9.90 →"
    : "Yes, reveal my full origins — $4.90 →";

  const firstName = formData?.firstName?.trim() || "";
  const fullParagraph = shares && shares[0] ? getRegionParagraph(shares[0].region) : "";
  const paragraphParts = fullParagraph ? fullParagraph.match(/.{1,120}(\s|$)/g)?.slice(0, 2) || [fullParagraph] : [];

  return (
    <>
      <div className="preview-top-border fixed top-0 left-0 right-0 z-[1000]" aria-hidden />
      <LandingNavbar variant="analyze" />
      <main
        className="min-h-screen w-full px-4 sm:px-6 md:px-8 pt-24 md:pt-28 pb-12 relative preview-bg-base"
        style={{ paddingBottom: isPaid ? "3rem" : "calc(80px + 3rem)" }}
      >
        {/* Background layers — z-index 0, parallax on blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
          {/* Aurora blob 1 */}
          <div
            ref={blob1Ref}
            className="absolute w-[600px] h-[600px] rounded-full preview-blob-1"
            style={{
              top: -200,
              left: -100,
              background: "radial-gradient(circle, rgba(193, 68, 14, 0.15) 0%, transparent 70%)",
            }}
          />
          <div
            ref={blob2Ref}
            className="absolute w-[500px] h-[500px] rounded-full preview-blob-2"
            style={{
              top: 200,
              right: -150,
              background: "radial-gradient(circle, rgba(27, 58, 107, 0.2) 0%, transparent 70%)",
            }}
          />
          <div
            ref={blob3Ref}
            className="absolute w-[700px] h-[400px] rounded-full preview-blob-3"
            style={{
              bottom: 100,
              left: "30%",
              background: "radial-gradient(ellipse, rgba(139, 69, 19, 0.1) 0%, transparent 60%)",
            }}
          />
          <div
            ref={blob4Ref}
            className="absolute w-[400px] h-[400px] rounded-full preview-blob-4"
            style={{
              top: "calc(40% - 200px)",
              left: "calc(50% - 200px)",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 65%)",
            }}
          />
          {/* Soft center glow */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255,255,255,0.02) 0%, transparent 50%)",
            }}
          />
          {/* Starfield — 40 stars via box-shadow */}
          <div
            className="absolute inset-0 preview-starfield"
            style={{
              boxShadow: [
                "5% 12% 0 0 rgba(255,255,255,0.25)",
                "18% 8% 0 0 rgba(255,255,255,0.15)",
                "28% 45% 0 0 rgba(255,255,255,0.35)",
                "42% 22% 0 0 rgba(255,255,255,0.2)",
                "55% 68% 0 0 rgba(255,255,255,0.3)",
                "72% 15% 0 0 rgba(255,255,255,0.18)",
                "85% 55% 0 0 rgba(255,255,255,0.22)",
                "12% 78% 0 0 rgba(255,255,255,0.12)",
                "35% 88% 0 0 rgba(255,255,255,0.28)",
                "68% 82% 0 0 rgba(255,255,255,0.2)",
                "92% 35% 0 0 rgba(255,255,255,0.15)",
                "8% 32% 0 0 rgba(255,255,255,0.38)",
                "48% 5% 0 0 rgba(255,255,255,0.1)",
                "78% 42% 0 0 rgba(255,255,255,0.25)",
                "22% 62% 0 0 rgba(255,255,255,0.32)",
                "58% 92% 0 0 rgba(255,255,255,0.18)",
                "95% 72% 0 0 rgba(255,255,255,0.22)",
                "15% 48% 0 0 rgba(255,255,255,0.28)",
                "62% 28% 0 0 rgba(255,255,255,0.2)",
                "38% 75% 0 0 rgba(255,255,255,0.15)",
                "88% 8% 0 0 rgba(255,255,255,0.3)",
                "2% 58% 0 0 rgba(255,255,255,0.12)",
                "45% 38% 0 0 rgba(255,255,255,0.35)",
                "75% 65% 0 0 rgba(255,255,255,0.2)",
                "25% 18% 0 0 rgba(255,255,255,0.25)",
                "52% 52% 0 0 rgba(255,255,255,0.18)",
                "98% 48% 0 0 rgba(255,255,255,0.22)",
                "32% 92% 0 0 rgba(255,255,255,0.28)",
                "65% 12% 0 0 rgba(255,255,255,0.15)",
                "18% 38% 0 0 rgba(255,255,255,0.32)",
                "82% 88% 0 0 rgba(255,255,255,0.2)",
                "42% 62% 0 0 rgba(255,255,255,0.25)",
                "58% 42% 0 0 rgba(255,255,255,0.12)",
                "12% 22% 0 0 rgba(255,255,255,0.3)",
                "88% 62% 0 0 rgba(255,255,255,0.18)",
                "28% 72% 0 0 rgba(255,255,255,0.22)",
                "72% 38% 0 0 rgba(255,255,255,0.28)",
                "5% 85% 0 0 rgba(255,255,255,0.15)",
                "48% 78% 0 0 rgba(255,255,255,0.35)",
                "95% 18% 0 0 rgba(255,255,255,0.2)",
                "38% 28% 0 0 rgba(255,255,255,0.18)",
              ].join(", "),
            }}
          />
          {/* Second star layer — dimmer, depth */}
          <div
            className="absolute inset-0 preview-starfield-dim"
            style={{
              boxShadow: [
                "7% 25% 0 0 rgba(255,255,255,0.08)",
                "22% 14% 0 0 rgba(255,255,255,0.06)",
                "35% 62% 0 0 rgba(255,255,255,0.1)",
                "51% 35% 0 0 rgba(255,255,255,0.07)",
                "66% 75% 0 0 rgba(255,255,255,0.09)",
                "80% 22% 0 0 rgba(255,255,255,0.05)",
                "14% 52% 0 0 rgba(255,255,255,0.08)",
                "44% 8% 0 0 rgba(255,255,255,0.06)",
                "73% 58% 0 0 rgba(255,255,255,0.07)",
                "3% 72% 0 0 rgba(255,255,255,0.05)",
                "58% 42% 0 0 rgba(255,255,255,0.09)",
                "88% 65% 0 0 rgba(255,255,255,0.06)",
                "28% 38% 0 0 rgba(255,255,255,0.08)",
                "62% 18% 0 0 rgba(255,255,255,0.05)",
                "95% 42% 0 0 rgba(255,255,255,0.07)",
                "18% 88% 0 0 rgba(255,255,255,0.06)",
                "42% 95% 0 0 rgba(255,255,255,0.08)",
                "76% 8% 0 0 rgba(255,255,255,0.05)",
                "9% 42% 0 0 rgba(255,255,255,0.07)",
                "55% 68% 0 0 rgba(255,255,255,0.06)",
              ].join(", "),
            }}
          />
          {/* Subtle grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Vignette — double layer for cinematic depth */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.5) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.35) 100%)",
            }}
          />
        </div>

      <div className="max-w-6xl mx-auto relative z-10 preview-content-in">
        {/* Top header */}
        <header ref={headerRef} className={`text-center mb-10 md:mb-12 transition-opacity duration-700 ${sectionVisible.header ? "preview-section-visible opacity-100" : "opacity-0"}`}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
            <h1 className="preview-section-title preview-hero-glow text-3xl sm:text-4xl md:text-[42px] tracking-tight">
              Here are your origins{firstName ? `, ${firstName}` : ""}
            </h1>
            <span className="inline-flex items-center gap-2 text-white/80 text-sm font-medium px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 shadow-sm shadow-emerald-500/10">
              <span className="relative inline-block w-2 h-2 rounded-full bg-emerald-400 green-dot-pulse" aria-hidden />
              Analysis complete
            </span>
          </div>
          <p className="preview-section-subtitle text-center mb-4">
            Your personalized ancestry breakdown based on your profile
          </p>
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
              isPaid
                ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/20"
                : "text-white border-[#C1440E]/60 bg-[#C1440E]/20 animate-shimmer"
            }`}
            style={isPaid ? { boxShadow: "0 0 24px rgba(52, 211, 153, 0.25)" } : undefined}
          >
            {isPaid ? "✓ Full results unlocked" : "Your results are ready ✨"}
          </div>
        </header>

        {/* Paid celebration confetti */}
        {showPaidConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden>
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 opacity-0"
                style={{
                  left: `${5 + (i * 4) % 90}%`,
                  top: "-10px",
                  background: ["#C1440E", "#F59E0B", "#22c55e", "#3b82f6", "rgba(255,255,255,0.9)"][i % 5],
                  animation: "confetti-fall 2s ease-out forwards",
                  animationDelay: `${(i * 0.04)}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Teaser stat bar — animated top border, icons */}
        <div ref={statRowRef} className={`relative grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10 md:mb-12 rounded-2xl overflow-visible bg-gradient-to-b from-white/[0.03] to-transparent py-1 ${sectionVisible.statRow ? "preview-section-visible opacity-100" : "opacity-0"}`}>
          <div className="preview-stat-row-top-border rounded-t-2xl" aria-hidden />
          <div className="stat-box-hover frosted-glass rounded-2xl py-6 px-5 sm:px-6 flex items-start gap-3">
            <div className="preview-globe-icon flex-shrink-0" aria-hidden />
            <div>
              <p className="preview-stat-value text-[32px] sm:text-[36px] leading-none mb-1.5">3</p>
              <p className="preview-subtitle text-xs">Continents detected</p>
            </div>
          </div>
          <div className="stat-box-hover frosted-glass rounded-2xl py-6 px-5 sm:px-6">
            {isPaid && shares?.[0] ? (
              <>
                <p className="preview-stat-value text-lg sm:text-xl leading-tight mb-1.5 break-words">{shares[0].region}</p>
                <p className="preview-subtitle text-xs">Dominant region</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-gray-500/50 flex items-center justify-center overflow-hidden mb-1" style={{ width: 56, height: 36 }}>
                  <span className="text-white text-sm font-semibold select-none" style={{ filter: "blur(5px)" }}>Europe</span>
                </div>
                <p className="text-white/60 text-xs flex items-center gap-1">Dominant region <span aria-hidden>🔒</span></p>
              </>
            )}
          </div>
          <div className="stat-box-hover frosted-glass rounded-2xl py-6 px-5 sm:px-6">
            {isPaid && shares && shares.length > 0 ? (
              <>
                <p className="preview-stat-value text-[32px] sm:text-[36px] leading-none mb-1.5">
                  {Math.min(...shares.map((s) => s.percentage))}%
                </p>
                <p className="preview-subtitle text-xs">Rarest ancestry %</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-gray-500/50 flex items-center justify-center overflow-hidden mb-1" style={{ width: 48, height: 28 }}>
                  <span className="text-white text-xs font-semibold select-none" style={{ filter: "blur(4px)" }}>12%</span>
                </div>
                <p className="text-white/60 text-xs flex items-center gap-1">Rarest ancestry % <span aria-hidden>🔒</span></p>
              </>
            )}
          </div>
          <div className="stat-box-hover stat-box-rotating-border frosted-glass rounded-2xl py-6 px-5 sm:px-6 flex items-start gap-3">
            <div className="preview-star-diamond flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="preview-stat-value text-[32px] sm:text-[36px] leading-none mb-1.5">Top 8%</p>
              <p className="preview-subtitle text-xs">Unique origin profile</p>
            </div>
          </div>
        </div>

        {/* Early CTA — below stat boxes (hidden when paid) */}
        {!isPaid && (
          <div className={`flex flex-col items-center text-center mb-10 md:mb-12 px-4 py-5 rounded-2xl transition-colors duration-300 ${isUrgent || expired ? "bg-red-500/5 border border-red-500/20" : "bg-white/[0.02] border border-white/5"}`}>
            <p
              className={`text-sm font-semibold mb-3 ${isUrgent ? "animate-pulse-urgent" : ""}`}
              style={{ color: expired ? "#EF4444" : isUrgent ? "#EF4444" : "#F59E0B" }}
            >
              {expired
                ? "⏰ Offer expired — price increased to $9.90"
                : "🔥 Offer expires in " + countdownDisplay + " — then $9.90"}
            </p>
            <button
              type="button"
              onClick={handleUnlock}
              disabled={loading}
              className="preview-btn-primary btn-ripple rounded-2xl bg-[#C1440E] text-white font-semibold text-base py-4 px-10 hover:bg-[#a63a0c] hover:shadow-xl hover:shadow-[#C1440E]/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting..." : buttonText}
            </button>
          </div>
        )}

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-8 lg:gap-14 mb-14">
          {/* Left column — Premium map and breakdown */}
          <div
            ref={leftColRef}
            className={`space-y-6 ${sectionVisible.leftCol ? "preview-section-visible opacity-100" : "opacity-0"}`}
            style={sectionVisible.leftCol ? { animationDelay: "0s" } : undefined}
          >
            <div className="rounded-2xl overflow-hidden frosted-glass relative preview-card shadow-lg shadow-black/10">
              <p className="preview-section-label px-4 pt-4 pb-1">Origin map</p>
              <div className="aspect-video w-full relative">
                <PremiumWorldMap
                  regionPercentages={regionPercentages}
                  shares={shares ?? []}
                  className="w-full h-full object-contain"
                  isPaid={isPaid}
                />
              </div>
            </div>
            <div className="space-y-4">
              {shares?.slice(0, 4).map((s, idx) => (
                <div
                  key={s.region}
                  className="flex items-center gap-4 py-1 rounded-lg transition-colors duration-200 hover:bg-white/[0.03] -mx-1 px-1"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-2 ring-white/10"
                    style={{ backgroundColor: REGION_COLORS[s.region] || "#9CA3AF" }}
                  />
                  <span className="text-white font-medium text-sm min-w-[120px]">
                    {s.region}
                  </span>
                  <div className="flex-1 rounded-full bg-white/[0.08] overflow-hidden relative" style={{ height: 10 }}>
                    <div
                      className={`h-full rounded-full bar-fill-anim relative ${barsVisible ? "visible" : ""}`}
                      style={{
                        "--bar-width": `${s.percentage}%`,
                        transitionDelay: `${idx * 150}ms`,
                        backgroundColor: REGION_COLORS[s.region] || "#9CA3AF",
                      } as React.CSSProperties}
                    >
                      <div
                        className="preview-bar-glow"
                        style={{ backgroundColor: REGION_COLORS[s.region] || "#9CA3AF" }}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <div
                    className={`rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${!isPaid ? "tooltip-unlock-wrap cursor-default bg-gray-500/50" : "bg-white/10"}`}
                    style={{ width: 48, minHeight: 28 }}
                  >
                    <AnimatedCounter
                      value={s.percentage}
                      duration={1500}
                      delay={idx * 200}
                      suffix="%"
                      className="text-white text-xs font-semibold select-none"
                      style={{ filter: isPaid ? "none" : "blur(4px)" }}
                      blur={!isPaid}
                    />
                  </div>
                </div>
              ))}
              {/* 5th row — hidden ancestry teaser */}
              <div className={`flex items-center gap-4 py-1 rounded-lg transition-colors duration-200 hover:bg-white/[0.03] -mx-1 px-1 ${!isPaid ? "tooltip-unlock-wrap cursor-default" : ""}`}>
                <span className="text-white font-medium text-sm min-w-0 flex items-center gap-2 flex-shrink-0">
                  {!isPaid && <span aria-hidden>🔒</span>}
                  Hidden ancestry detected
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#F59E0B" }}>Surprising</span>
                </span>
                <div className="flex-1 rounded-full bg-white/[0.08] overflow-hidden" style={{ height: 10 }}>
                  <div
                    className="h-full rounded-full bg-gray-500/60 transition-all duration-500"
                    style={{ width: "42%", filter: isPaid ? "none" : "blur(3px)" }}
                  />
                </div>
                <div
                  className={`rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${!isPaid ? "bg-gray-500/50" : "bg-white/10"}`}
                  style={{ width: 48, minHeight: 28 }}
                >
                  <AnimatedCounter value={12} duration={1500} delay={800} suffix="%" className="text-white text-xs font-semibold select-none" style={{ filter: isPaid ? "none" : "blur(4px)" }} blur={!isPaid} />
                </div>
              </div>
            </div>
            <p className="text-[13px] font-medium mt-4 flex items-center gap-2" style={{ color: "#C1440E" }}>
              <span className="inline-flex w-5 h-5 rounded-full bg-[#C1440E]/20 items-center justify-center text-[10px]" aria-hidden>!</span>
              One of your ancestry results may surprise you.
            </p>
          </div>

          {/* Right column — Personal story card */}
          <div
            ref={rightColRef}
            className={`lg:pt-0 ${sectionVisible.rightCol ? "preview-section-visible opacity-100" : "opacity-0"}`}
            style={sectionVisible.rightCol ? { animationDelay: "150ms" } : undefined}
          >
            <div className="rounded-2xl p-6 md:p-8 h-full frosted-glass preview-story-parchment relative overflow-hidden preview-card">
              {/* Decorative quotation mark */}
              <span
                className="absolute left-5 top-3 font-serif text-[#C1440E] pointer-events-none select-none"
                style={{ fontSize: 120, opacity: 0.12, fontFamily: "var(--font-playfair), 'Playfair Display', serif", lineHeight: 1 }}
                aria-hidden
              >
                &quot;
              </span>
              {/* SVG border draw on load */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none preview-card-border-draw" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="rgba(193,68,14,0.35)" strokeWidth="1" rx="16" ry="16" />
              </svg>
              <p className="preview-section-label mb-2">Story</p>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="preview-section-title text-2xl md:text-[26px]">
                  Your personal story
                </h2>
                <span className="w-5 h-5 rounded-full bg-emerald-500/90 flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/30" title="Verified">
                  <span className="text-white text-[11px] leading-none font-bold">✓</span>
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" aria-hidden />
              <p className="preview-body text-[15px] mb-4">
                Your origins trace back to one of the most historically rich regions of the world, where civilizations have crossed paths for millennia.
              </p>
              <p
                className="preview-body text-[15px] mb-4 select-none"
                style={{ filter: isPaid ? "none" : "blur(5px)", userSelect: isPaid ? "auto" : "none" }}
              >
                {paragraphParts[0] || "This paragraph reveals how your family history connects to major cultural and historical movements across continents."}
              </p>
              <p
                className="preview-body text-[15px] mb-6 select-none"
                style={{ filter: isPaid ? "none" : "blur(5px)", userSelect: isPaid ? "auto" : "none" }}
              >
                {paragraphParts[1] || "Another layer of your origin story awaits, with surprising links to traditions and migrations that shaped the world."}
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" aria-hidden />
              <div className="mb-6">
                <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-3">
                  Notable ancestors
                </h3>
                <ul className="space-y-2">
                  {(Array.isArray(nameAnalysis?.notableAncestors) ? nameAnalysis.notableAncestors : (isPaid && shares?.[0]
                    ? NOTABLE_ANCESTORS_BY_REGION[shares[0].region] ?? NOTABLE_ANCESTORS_BY_REGION["Other regions"]
                    : ["A historical figure from your roots", "Another ancestor in your line", "A third notable name"])
                  ).map((name: string, i: number) => (
                    <li
                      key={i}
                      className="text-white/70 text-sm select-none"
                      style={{ filter: isPaid ? "none" : "blur(6px)" }}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
              {/* People who share your profile — avatars when paid */}
              <div className="mb-6">
                <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-3">
                  People who share your profile
                </h3>
                {isPaid && profileShares.length > 0 ? (
                  <>
                    <div className="flex gap-6 mb-3 flex-wrap">
                      {profileShares.map((person, i) => (
                        <div key={i} className="flex flex-col items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={person.picture}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-white/20"
                          />
                          <p className="text-white/80 text-xs mt-2 text-center max-w-[80px] truncate" title={person.name}>
                            {person.name}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/70 text-sm">
                      People with similar origin profiles to yours.
                    </p>
                  </>
                ) : isPaid ? (
                  <>
                    <div className="flex gap-4 mb-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0 animate-pulse" />
                      ))}
                    </div>
                    <p className="text-white/60 text-sm">Loading profiles…</p>
                  </>
                ) : (
                  <>
                    <div className="flex gap-4 mb-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full bg-white/20 flex-shrink-0"
                          style={{ filter: "blur(8px)" }}
                        />
                      ))}
                    </div>
                    <p className="text-white/70 text-sm select-none" style={{ filter: "blur(8px)" }}>
                      3 public figures share your exact origin profile.
                    </p>
                  </>
                )}
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" aria-hidden />
              {/* Origin rarity score — fully visible */}
              <div>
                <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-2">
                  Origin rarity score
                </h3>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-2">
                  <div
                    className="preview-rarity-bar h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: "73%" }}
                  />
                </div>
                <p className="preview-body text-sm">
                  Your profile is rarer than 73% of users.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ethnic group breakdown — before name analysis */}
        <EthnicGroups
          isPaid={isPaid}
          detectedRegions={shares?.map((s) => s.region) ?? []}
        />

        {/* What your name reveals — Mercator bg, golden shimmer */}
        <section
          ref={nameSectionRef}
          className={`w-full rounded-2xl p-8 md:p-10 frosted-glass relative overflow-hidden preview-card mt-8 ${sectionVisible.name ? "preview-section-name-visible opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 z-0" aria-hidden style={{ backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Mercator_1569.png/1280px-Mercator_1569.png)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.05, mixBlendMode: "overlay" }} />
          <div className="absolute inset-0 bg-[#0f1923]/92 z-0" aria-hidden />
          <div className="relative z-10">
          <p className="preview-section-label mb-2">Name analysis</p>
          <p className="preview-section-subtitle mb-4">What your name reveals</p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <h2
              className="preview-section-title text-3xl sm:text-4xl md:text-[48px] tracking-[0.15em] uppercase inline-flex flex-wrap name-golden-shimmer-sweep"
            >
              {(formData?.lastName?.trim() || "Your name").split("").map((char, i) => (
                <span
                  key={i}
                  className={nameRevealed ? "name-letter inline-block" : "inline-block"}
                  style={nameRevealed ? { animationDelay: `${i * 100}ms` } : { opacity: 0 }}
                >
                  {char}
                </span>
              ))}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg shadow-[#C1440E]/20" style={{ backgroundColor: "#C1440E" }}>
              <span aria-hidden>✓</span> Analyzed
            </span>
          </div>

          {/* Timeline — dynamic from nameAnalysis or skeleton */}
          <div className="relative mb-10">
            {nameLoading ? (
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-[14px] h-[14px] rounded-full bg-white/20 animate-pulse" />
                    <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="absolute top-[7px] left-0 right-0 h-px flex z-0 gap-0">
                  <div className="flex-1 h-full overflow-hidden"><div className="preview-timeline-path-seg h-full bg-white/15" style={{ animationDelay: "0.2s" }} /></div>
                  <div className="flex-1 h-full overflow-hidden"><div className="preview-timeline-path-seg h-full bg-white/15" style={{ animationDelay: "0.6s" }} /></div>
                  <div className="flex-1 h-full overflow-hidden"><div className="preview-timeline-path-seg h-full bg-white/15" style={{ animationDelay: "1s" }} /></div>
                </div>
                <div className="grid grid-cols-4 gap-0 relative">
                  {[
                    { year: nameAnalysis?.firstRecordedYear ?? "~800 AD", label: "First recorded in", place: nameAnalysis?.firstRecordedPlace ?? "—", color: "#C1440E", blurred: false },
                    { year: nameAnalysis?.spreadYear ?? "~1200 AD", label: "Spread across", place: nameAnalysis?.spreadPlace ?? "—", color: "#C1440E", blurred: false },
                    { year: "~1600 AD", label: "Migration to", place: nameAnalysis?.migrationDestination1 ?? "—", color: "#F59E0B", blurred: true },
                    { year: "~1900 AD", label: "Modern presence in", place: nameAnalysis?.migrationDestination2 ?? "—", color: "rgba(255,255,255,0.5)", blurred: true },
                  ].map((node, i) => (
                    <div key={i} className="flex flex-col items-center text-center group">
                      <div
                        className="w-[14px] h-[14px] rounded-full flex-shrink-0 relative z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          border: `2px solid ${node.color}`,
                          boxShadow: node.color === "#C1440E" ? "0 0 12px rgba(193, 68, 14, 0.3)" : undefined,
                        }}
                      >
                        <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: node.color }} />
                      </div>
                      <p className="text-white/50 text-[11px] mt-2">{node.year}</p>
                      <p className="text-white/40 text-[11px] mt-0.5">{node.label}</p>
                      <p className="text-white text-[13px] font-semibold mt-1 flex items-center justify-center gap-1.5">
                        {node.blurred && !isPaid ? (
                          <>
                            <span className="select-none" style={{ filter: "blur(5px)", userSelect: "none" }}>{node.place}</span>
                            <span className="flex-shrink-0" aria-hidden>🔒</span>
                          </>
                        ) : (
                          node.place
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            {nameLoading ? (
              <>
                <div className="h-10 w-40 rounded-xl bg-white/10 animate-pulse" />
                <div className="h-10 w-48 rounded-xl bg-white/10 animate-pulse" />
                <div className="h-10 w-36 rounded-xl bg-white/10 animate-pulse" />
              </>
            ) : (
              <>
                <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium">
                  📍 Origin region : {nameAnalysis?.originRegion ?? shares?.[0]?.region ?? "Southern Europe"}
                </span>
                <span className={`px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium flex items-center gap-2 ${!isPaid ? "tooltip-unlock-wrap cursor-default" : ""}`}>
                  🌍 Migration route : <span className="select-none" style={{ filter: isPaid ? "none" : "blur(5px)" }}>{nameAnalysis?.migrationRoute ?? "—"}</span>
                  {!isPaid && <span aria-hidden>🔒</span>}
                </span>
                <span className={`px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium flex items-center gap-2 ${!isPaid ? "tooltip-unlock-wrap cursor-default" : ""}`}>
                  👥 Estimated carriers : <span className="select-none" style={{ filter: isPaid ? "none" : "blur(5px)" }}>{nameAnalysis?.estimatedCarriers ?? "—"}</span>
                  {!isPaid && <span aria-hidden>🔒</span>}
                </span>
              </>
            )}
          </div>

          {nameLoading ? (
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-[80%] rounded bg-white/10 animate-pulse" />
            </div>
          ) : (
            <p className="preview-body text-[14px] mb-6">
              {nameAnalysis?.historyParagraph ?? `The name ${formData?.lastName?.trim() || "your surname"} has roots stretching back over 1,200 years. It belongs to a family of surnames that originated in the southwestern Mediterranean and spread through trade routes and historical migrations. The full etymology and migration map are available in your complete report.`}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-[14px]">
              The literal meaning of {formData?.lastName?.trim() || "your name"} is
            </span>
            {nameLoading ? (
              <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" />
            ) : (
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-white text-sm font-medium select-none ${!isPaid ? "tooltip-unlock-wrap cursor-default bg-gray-500/50" : "bg-white/10"}`}
                style={{ filter: isPaid ? "none" : "blur(5px)" }}
              >
                {nameAnalysis?.meaning ?? "—"}
              </span>
            )}
          </div>
          </div>
        </section>

        {/* Your cultural DNA — 6 trait cards */}
        <section
          ref={culturalRef}
          className={`w-full rounded-2xl p-8 md:p-10 frosted-glass preview-card mt-8 ${sectionVisible.cultural ? "opacity-100" : "opacity-0"}`}
        >
          <p className="preview-section-label mb-2">Traits</p>
          <h2 className="preview-section-title text-2xl md:text-[28px] mb-6">
            Your cultural DNA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Array.isArray(nameAnalysis?.culturalTraits) && nameAnalysis.culturalTraits.length > 0
              ? (nameAnalysis.culturalTraits as string[]).slice(0, 6).map((desc, i) => ({ emoji: ["🌊", "☀️", "📚", "🎭", "⚓", "🕌"][i] ?? "✨", title: `Trait ${i + 1}`, desc }))
              : [
                  { emoji: "🌊", title: "Mediterranean soul", desc: "Deep connection to family, food and community" },
                  { emoji: "☀️", title: "Southern warmth", desc: "Natural hospitality and emotional expressiveness" },
                  { emoji: "📚", title: "Ancient wisdom", desc: "Heir to one of the world's oldest intellectual traditions" },
                  { emoji: "🎭", title: "Artistic heritage", desc: "Creativity flows through your ancestral bloodline" },
                  { emoji: "⚓", title: "Maritime spirit", desc: "Your ancestors were explorers and traders" },
                  { emoji: "🕌", title: "Cultural crossroads", desc: "Your DNA carries the richness of civilizations meeting" },
                ]
            ).map((trait, i) => (
              <div
                key={i}
                className="preview-cultural-card rounded-2xl p-5 bg-white/[0.06] border border-white/10 hover:border-white/20"
                style={{
                  animation: sectionVisible.cultural ? "cultural-card-in 0.6s ease-out forwards" : "none",
                  animationDelay: `${i * 80}ms`,
                  opacity: sectionVisible.cultural ? 1 : 0,
                }}
              >
                <span className="text-2xl mb-3 block" aria-hidden>{trait.emoji}</span>
                <h3 className="text-white font-semibold text-[15px] mb-1.5">{trait.title}</h3>
                <p className="preview-body text-xs">{trait.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Migration map — slides in from bottom */}
        <div ref={migrationRef} className={`mt-8 ${sectionVisible.migration ? "preview-section-migration-visible opacity-100" : "opacity-0"}`}>
          <MigrationMap isPaid={isPaid} />
        </div>

        {/* Reveal section — inline (hidden when paid) */}
        {!isPaid && (
        <section
          ref={unlockCardRef}
          className={`max-w-4xl mx-auto rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 mt-8 relative overflow-hidden frosted-glass preview-card ${sectionVisible.unlock ? "preview-section-visible opacity-100" : "opacity-0"}`}
          style={{
            boxShadow: "0 0 0 1px rgba(239, 159, 39, 0.2), 0 24px 64px rgba(0, 0, 0, 0.22), 0 0 80px rgba(193, 68, 14, 0.06)",
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139, 37, 0, 0.22) 0%, transparent 65%)",
          }}
        >
          <p className="absolute top-4 left-6 preview-section-label z-10">Unlock</p>
          {/* 8 floating terracotta dots */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="unlock-particle"
              style={{
                left: `${8 + (i * 11) % 84}%`,
                bottom: `${5 + (i % 4) * 18}%`,
                animationDuration: `${3 + (i % 4)}s`,
                animationDelay: `${i * 0.4}s`,
                width: 2,
                height: 2,
                background: "#C1440E",
              }}
            />
          ))}
          <ul className="space-y-4 text-white/90 text-[15px] relative z-10 font-medium">
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C1440E]/30 flex items-center justify-center text-[#C1440E] text-sm" aria-hidden>✓</span>
              Every exact percentage revealed
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C1440E]/30 flex items-center justify-center text-[#C1440E] text-sm" aria-hidden>✓</span>
              Your complete personal origin story
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C1440E]/30 flex items-center justify-center text-[#C1440E] text-sm" aria-hidden>✓</span>
              Historical figures sharing your origins
            </li>
            <li className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C1440E]/30 flex items-center justify-center text-[#C1440E] text-sm" aria-hidden>✓</span>
              Shareable origin profile card
            </li>
          </ul>
          <div className="relative z-10 flex flex-col items-center md:items-end text-center md:text-right">
            <p
              className={`text-[13px] font-medium mb-2 ${isUrgent ? "animate-pulse-urgent" : ""}`}
              style={{ color: expired ? "#EF4444" : isUrgent ? "#EF4444" : "#F59E0B" }}
            >
              {expired
                ? "⏰ Offer expired — price increased to $9.90"
                : "⏱ Special price expires in " + countdownDisplay}
            </p>
            {/* Urgency progress bar — depletes over 15 min, terracotta to red */}
            <div className="preview-urgency-bar w-full max-w-[300px] h-2 mb-4">
              <div
                className="preview-urgency-fill h-full"
                style={{
                  width: `${progress * 100}%`,
                  background: progress > 0.2 ? "linear-gradient(90deg, #C1440E, #D45312)" : progress > 0.05 ? "#E85D04" : "#EF4444",
                }}
              />
            </div>
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="preview-btn-primary preview-unlock-btn btn-ripple rounded-2xl bg-[#C1440E] text-white font-semibold px-10 hover:bg-[#a63a0c] hover:shadow-xl hover:shadow-[#C1440E]/30 disabled:opacity-70 disabled:cursor-not-allowed animate-pulse-cta flex items-center justify-center gap-2"
              style={{ height: 64, fontSize: 18 }}
            >
              {loading ? "Redirecting..." : buttonText}
              <span className="preview-unlock-check opacity-0 text-emerald-400" aria-hidden>✓</span>
            </button>
            <p className="text-white/50 text-xs mt-2 font-medium">
              4,847 people revealed their results this week.
            </p>
            <p className="text-white/60 text-sm mt-1 tracking-wide">
              One-time payment · No subscription · Instant access
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-3 text-white/50 text-xs font-medium">
              <span className="flex items-center gap-1">🔒 Secure</span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1">⚡ Instant</span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1">↩ Refund guarantee</span>
            </div>
            <p className="text-[11px] text-white/40 mt-2 flex items-center justify-center md:justify-end gap-1.5">
              <span className="inline-flex w-4 h-4 rounded-full bg-emerald-500/20 items-center justify-center text-emerald-400 text-[10px] font-bold">✓</span>
              Verified secure checkout
            </p>
          </div>
        </section>
        )}

        {/* Share button — visible when paid */}
        {isPaid && (
          <div className="flex justify-center mt-12 mb-10">
            <button
              type="button"
              onClick={handleShare}
              className="preview-btn-primary btn-ripple rounded-2xl bg-[#C1440E] text-white font-semibold text-base px-10 py-4 hover:bg-[#a63a0c] hover:shadow-xl hover:shadow-[#C1440E]/30"
            >
              Share my origin profile 🌍
            </button>
          </div>
        )}
      </div>
      </main>

      {/* Sticky bottom bar — hidden when paid */}
      {!isPaid && (
      <div
        className="fixed bottom-0 left-0 right-0 h-[76px] grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8 z-[999] gap-4 relative rounded-t-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(13, 17, 23, 0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.25), 0 -1px 0 rgba(255,255,255,0.05) inset",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] preview-top-border rounded-t-2xl" aria-hidden />
        <p
          className={`text-sm font-semibold hidden sm:block text-left ${isUrgent ? "animate-pulse-urgent" : ""}`}
          style={{ color: expired ? "#EF4444" : isUrgent ? "#EF4444" : "#F59E0B" }}
        >
          {expired ? "⏰ Offer expired" : "⏱ Price increases in " + countdownDisplay}
        </p>
        <button
          type="button"
          onClick={handleUnlock}
          disabled={loading}
          className="preview-btn-primary btn-ripple rounded-2xl bg-[#C1440E] text-white font-semibold text-base px-8 py-3.5 hover:bg-[#a63a0c] hover:shadow-xl hover:shadow-[#C1440E]/30 disabled:opacity-70 disabled:cursor-not-allowed justify-self-center"
        >
          {loading ? "Redirecting..." : buttonText}
        </button>
        <p className="text-white/50 text-sm hidden sm:block text-right font-medium">
          🔒 Secure · Instant access
        </p>
      </div>
      )}
    </>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full flex items-center justify-center preview-bg-base" style={{ backgroundColor: "#0f1923" }}>
          <p className="text-white/60">Loading...</p>
        </main>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
