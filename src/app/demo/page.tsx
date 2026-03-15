"use client";

// Record this page with screen capture software and add background music in editing. Recommended : upbeat world music or cinematic orchestral.

import { useEffect, useRef, useState } from "react";

const EARTH_IMAGE_URL =
  "https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg";
const DEMO_PHOTO = "https://randomuser.me/api/portraits/women/44.jpg";
const TOTAL_DURATION = 15;
const CAPTIONS: { at: number; text: string }[] = [
  { at: 0, text: "Where are you REALLY from? 🌍" },
  { at: 2, text: "Upload your photo..." },
  { at: 6, text: "Our AI analyzes your origins..." },
  { at: 8, text: "Results ready in seconds ⚡" },
  { at: 10, text: "Your complete origin profile 🗺️" },
  { at: 13, text: "Only $4.90 · Try it now" },
];
const LOADING_MESSAGES = [
  "Analyzing facial structure...",
  "Mapping ancestral regions...",
];

function getCaptionIndex(t: number): number {
  for (let i = CAPTIONS.length - 1; i >= 0; i--) {
    if (t >= CAPTIONS[i].at) return i;
  }
  return 0;
}

export default function DemoPage() {
  const [t, setT] = useState(0);
  const startTimeRef = useRef(Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = () => {
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    tickRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const current = elapsed % TOTAL_DURATION;
      setT(current);
    }, 50);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        restart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const phase =
    t < 2
      ? "landing"
      : t < 4
        ? "upload"
        : t < 6
          ? "name"
          : t < 8
            ? "loading"
            : t < 13
              ? "reveal"
              : t < 14.5
                ? "cta"
                : "black";

  const captionIndex = getCaptionIndex(t);
  const caption = CAPTIONS[captionIndex];
  const showCaption = caption && t >= caption.at && (captionIndex >= CAPTIONS.length - 1 ? t < 15 : t < CAPTIONS[captionIndex + 1].at);

  // Upload sub-state: photo at 2.5s, brackets at 2.7s, pills one by one
  const uploadPhotoVisible = t >= 2.5;
  const uploadBracketsVisible = t >= 2.7;
  const pill1 = t >= 2.9;
  const pill2 = t >= 3.2;
  const pill3 = t >= 3.5;

  // Name: type "Martinez" from 4 to 4.8 (8 letters * 100ms)
  const nameTypedLength = Math.min(8, Math.max(0, Math.floor((t - 4) * 10)));
  const nameBadgeVisible = t >= 5;

  // Loading: progress 0-100 over 6-8s
  const loadingProgress = phase === "loading" ? Math.min(100, ((t - 6) / 2) * 100) : 0;
  const loadingMessageIndex = Math.floor((t - 6) * 2) % LOADING_MESSAGES.length;

  // Reveal: stripe at 9-9.5, then reveal at 9.5
  const showStripeModal = phase === "reveal" && t >= 9 && t < 9.5;
  const revealed = phase === "reveal" && t >= 9.5;
  const revealScroll = phase === "reveal" ? Math.min(1, (t - 10) / 2.5) : 0;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#0d1117", fontFamily: "Inter, sans-serif" }}
    >
      {/* Caption overlay — TikTok style */}
      {showCaption && (
        <div
          key={captionIndex}
          className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{
            animation: "demo-caption-in 0.25s ease-out forwards",
          }}
        >
          <p
            className="text-white font-bold text-center px-4 text-3xl md:text-4xl lg:text-5xl"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {caption.text}
          </p>
        </div>
      )}

      {/* Landing 0-2s */}
      {phase === "landing" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
          style={{
            opacity: t < 0.3 ? t / 0.3 : 1,
            backgroundImage: `url(${EARTH_IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(27, 58, 107, 0.7) 0%, rgba(193, 68, 14, 0.4) 50%, rgba(10, 15, 26, 0.8) 100%)",
            }}
          />
          <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
            <h1
              className="text-white font-bold mb-4"
              style={{
                fontSize: "52px",
                fontFamily: "Playfair Display, serif",
                lineHeight: 1.2,
                textShadow: "0 2px 24px rgba(0,0,0,0.5)",
              }}
            >
              You are more than
              <br />
              where you were born.
            </h1>
            <p className="text-white/90 text-xl mb-8">Discover your true origins in 30 seconds.</p>
            <div
              className="inline-block rounded-2xl text-white font-semibold text-lg px-12 py-4"
              style={{ background: "#C1440E" }}
            >
              Discover my origins →
            </div>
          </div>
        </div>
      )}

      {/* Upload 2-4s */}
      {phase === "upload" && (
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{
            background: "#0d1117",
            transition: "opacity 0.4s",
          }}
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full border border-white/10"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
            }}
          >
            <h2 className="text-white font-semibold text-2xl text-center mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
              Upload your photo
            </h2>
            <div className="flex flex-col items-center">
              <div
                className="w-[180px] h-[180px] rounded-full overflow-hidden border-2 flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: uploadPhotoVisible ? "rgba(255,255,255,0.15)" : "rgba(193, 68, 14, 0.5)",
                  background: uploadPhotoVisible ? "#1a1f2e" : "transparent",
                }}
              >
                {uploadPhotoVisible ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={DEMO_PHOTO}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {uploadBracketsVisible && (
                      <>
                        <div className="absolute top-2 left-2 w-8 h-8 border-2 border-[#C1440E] rounded-tl-lg" style={{ animation: "demo-bracket-in 0.3s ease-out" }} />
                        <div className="absolute top-2 right-2 w-8 h-8 border-2 border-[#C1440E] rounded-tr-lg" style={{ animation: "demo-bracket-in 0.3s ease-out 0.05s both" }} />
                        <div className="absolute bottom-2 left-2 w-8 h-8 border-2 border-[#C1440E] rounded-bl-lg" style={{ animation: "demo-bracket-in 0.3s ease-out 0.1s both" }} />
                        <div className="absolute bottom-2 right-2 w-8 h-8 border-2 border-[#C1440E] rounded-br-lg" style={{ animation: "demo-bracket-in 0.3s ease-out 0.15s both" }} />
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-[#C1440E]" style={{ fontSize: 48 }}>📷</span>
                )}
              </div>
              <div className="mt-6 flex flex-col gap-2 w-full">
                {pill1 && (
                  <div className="rounded-lg bg-white/10 px-4 py-2 text-white/80 text-sm flex items-center gap-2" style={{ animation: "demo-pill-in 0.3s ease-out" }}>
                    📸 Photo detected
                  </div>
                )}
                {pill2 && (
                  <div className="rounded-lg bg-white/10 px-4 py-2 text-white/80 text-sm flex items-center gap-2" style={{ animation: "demo-pill-in 0.3s ease-out" }}>
                    ✓ Face detected
                  </div>
                )}
                {pill3 && (
                  <div className="rounded-lg bg-white/10 px-4 py-2 text-white/80 text-sm flex items-center gap-2" style={{ animation: "demo-pill-in 0.3s ease-out" }}>
                    🔍 Ready to analyze
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name 4-6s */}
      {phase === "name" && (
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{ background: "#0d1117" }}
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full border border-white/10"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
          >
            <h2 className="text-white font-semibold text-2xl text-center mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              What is your name?
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-sm mb-1">First name</label>
                <input
                  type="text"
                  readOnly
                  value="Maria"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Last name</label>
                <input
                  type="text"
                  readOnly
                  value={"Martinez".slice(0, nameTypedLength)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
                />
                {nameBadgeVisible && (
                  <p
                    className="mt-2 text-sm text-white/80 inline-flex items-center gap-1.5 rounded-full px-3 py-2 border border-[#C1440E]/40"
                    style={{ background: "rgba(193, 68, 14, 0.2)", animation: "demo-fade-in 0.4s ease-out" }}
                  >
                    📍 Possible origin: 🇪🇸 Iberian Peninsula
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading 6-8s */}
      {phase === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6" style={{ background: "#0d1117" }}>
          <p className="text-white text-xl mb-8 font-medium" style={{ fontFamily: "Playfair Display, serif" }}>
            Analyzing your origins...
          </p>
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#C1440E]"
              style={{
                animation: "loading-dash-rotate 4s linear infinite",
                boxShadow: "0 0 30px rgba(193, 68, 14, 0.25)",
              }}
            />
            <div className="absolute w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center">
              <span className="text-white/60 text-2xl">👤</span>
            </div>
          </div>
          <p className="text-white/90 text-sm mb-6 min-h-[2rem] transition-opacity duration-300">
            {LOADING_MESSAGES[loadingMessageIndex]}
          </p>
          <div className="w-full max-w-xs h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${loadingProgress}%`,
                background: "linear-gradient(90deg, #C1440E, #F59E0B)",
              }}
            />
          </div>
        </div>
      )}

      {/* Reveal 8-13s */}
      {phase === "reveal" && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            background: "#0d1117",
            transform: `translateY(${-revealScroll * 40}vh)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Stripe-style modal 9-9.5s */}
          {showStripeModal && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
              style={{ animation: "demo-fade-in 0.2s ease-out" }}
            >
              <div
                className="rounded-2xl p-8 max-w-sm w-full mx-4 border border-white/10 shadow-2xl"
                style={{
                  background: "#1a1f2e",
                  animation: "demo-scale-in 0.25s ease-out",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-6 rounded bg-[#635BFF]" />
                  <span className="text-white font-semibold">Payment</span>
                </div>
                <p className="text-white/80 text-sm mb-4">Card **** 4242</p>
                <p className="text-white/60 text-xs mb-6">$4.90 — One-time</p>
                <div className="h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-sm font-medium">
                  ✓ Payment successful
                </div>
              </div>
            </div>
          )}

          {/* Preview content — blurred then revealed */}
          <div
            className="absolute inset-0 p-6 pt-16 pb-24"
            style={{
              filter: revealed ? "none" : "blur(12px)",
              opacity: revealed ? 1 : 0.7,
              transition: "filter 0.6s ease-out, opacity 0.6s ease-out",
            }}
          >
            {/* Confetti when revealed */}
            {revealed && t < 10.5 && (
              <div className="fixed inset-0 pointer-events-none z-40" aria-hidden>
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-sm opacity-0"
                    style={{
                      left: `${5 + (i * 3) % 90}%`,
                      top: "-10px",
                      background: ["#C1440E", "#F59E0B", "#22c55e", "#3b82f6", "rgba(255,255,255,0.9)"][i % 5],
                      animation: "demo-confetti-fall 1.5s ease-out forwards",
                      animationDelay: `${i * 0.03}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  Here are your origins, Maria
                </h1>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                    revealed ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/20" : "text-white/70 border-white/20 bg-white/10"
                  }`}
                >
                  {revealed ? "✓ Full results unlocked" : "Your results are ready ✨"}
                </div>
              </div>

              {/* Mini map + stats */}
              <div className="rounded-2xl border border-white/10 p-6 mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="h-32 rounded-xl bg-white/5 mb-4 flex items-center justify-center text-white/40 text-sm">
                  🗺️ World map with colored regions
                </div>
                <div className="flex gap-4 flex-wrap">
                  {[
                    { label: "Southern Europe", pct: 42, color: "#C1440E" },
                    { label: "North Africa", pct: 28, color: "#F59E0B" },
                    { label: "Western Europe", pct: 18, color: "#2D6A4F" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                      <span className="text-white/80 text-sm">{r.label}</span>
                      <span className="text-white font-semibold text-sm">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name analysis */}
              <div className="rounded-2xl border border-white/10 p-6 mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Name analysis</p>
                <h2 className="text-white text-2xl font-bold tracking-widest uppercase mb-4" style={{ fontFamily: "Playfair Display, serif", color: "#C1440E" }}>
                  MARTINEZ
                </h2>
                <p className="text-white/70 text-sm">Iberian origin · First recorded ~800 AD</p>
              </div>

              {/* Ethnic cards */}
              <div className="grid grid-cols-2 gap-3">
                {["Southern European", "North African", "Iberian", "Mediterranean"].map((label, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 p-4 text-center"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <p className="text-white/90 text-sm font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA 13-14.5s */}
      {phase === "cta" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-500"
          style={{
            background: "#0d1117",
            opacity: t < 13.2 ? (t - 13) / 0.2 : t > 14.2 ? (14.5 - t) / 0.3 : 1,
          }}
        >
          <h1
            className="text-white text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Discover your origins
          </h1>
          <p className="text-white/60 text-lg mb-8">30 seconds · $4.90 · No DNA kit</p>
          <a
            href="https://originetrace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl text-white font-semibold text-lg px-10 py-4 inline-block"
            style={{ background: "#C1440E" }}
          >
            Try it now → originetrace.com
          </a>
        </div>
      )}

      {/* Black 14.5-15s */}
      {phase === "black" && (
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: (t - 14.5) / 0.5,
            transition: "opacity 0.1s",
          }}
        />
      )}

      {/* Hint */}
      <div
        className="absolute bottom-4 right-4 z-[200] text-white text-xs"
        style={{ opacity: 0.2 }}
      >
        Press R to restart
      </div>
    </div>
  );
}
