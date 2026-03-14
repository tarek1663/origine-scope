"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FORM_STORAGE_KEY = "origine-scope-form";

const ROTATING_MESSAGES = [
  "Scanning facial structure...",
  "Cross-referencing 847 surname databases...",
  "Mapping ancestral migration routes...",
  "Detecting hidden ancestry patterns...",
  "Calculating your origin percentages...",
  "Comparing with 2.4 million profiles...",
  "Almost there...",
  "Your story is being written...",
];

const STEPS = [
  { id: 1, label: "Photo analysis" },
  { id: 2, label: "Name research" },
  { id: 3, label: "Origin mapping" },
  { id: 4, label: "Report generation" },
];

function getFirstName(): string {
  if (typeof window === "undefined") return "";
  try {
    const s = localStorage.getItem(FORM_STORAGE_KEY);
    if (s) {
      const data = JSON.parse(s);
      return (data.firstName || "").trim();
    }
  } catch {}
  return "";
}

export default function LoadingPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [stepActive, setStepActive] = useState(2); // 1 & 2 done on load; 3 activates at 1s, 4 at 3s
  const [step4Complete, setStep4Complete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setFirstName(getFirstName());
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStepActive(3), 1000);
    const t2 = setTimeout(() => setStepActive(4), 3000);
    const t3 = setTimeout(() => setStep4Complete(true), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    const duration = 4000;
    const start = Date.now();
    let rafId: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      if (elapsed >= duration) {
        setProgress(100);
        router.push("/preview");
        return;
      }
      const t = elapsed / duration;
      const easeOut = 1 - (1 - t) * (1 - t);
      setProgress(easeOut * 95);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [router]);

  const starfieldShadows = [
    "5% 12% 0 0 rgba(255,255,255,0.25)",
    "28% 45% 0 0 rgba(255,255,255,0.35)",
    "55% 68% 0 0 rgba(255,255,255,0.3)",
    "72% 15% 0 0 rgba(255,255,255,0.18)",
    "12% 78% 0 0 rgba(255,255,255,0.12)",
    "85% 55% 0 0 rgba(255,255,255,0.22)",
    "42% 22% 0 0 rgba(255,255,255,0.2)",
    "68% 82% 0 0 rgba(255,255,255,0.2)",
    "18% 38% 0 0 rgba(255,255,255,0.32)",
    "92% 35% 0 0 rgba(255,255,255,0.15)",
    "48% 5% 0 0 rgba(255,255,255,0.1)",
    "78% 42% 0 0 rgba(255,255,255,0.25)",
    "22% 62% 0 0 rgba(255,255,255,0.32)",
    "95% 72% 0 0 rgba(255,255,255,0.22)",
    "38% 75% 0 0 rgba(255,255,255,0.15)",
  ].join(", ");
  const starfieldShadowsDim = [
    "7% 25% 0 0 rgba(255,255,255,0.08)",
    "35% 62% 0 0 rgba(255,255,255,0.1)",
    "66% 75% 0 0 rgba(255,255,255,0.09)",
    "14% 52% 0 0 rgba(255,255,255,0.08)",
    "58% 42% 0 0 rgba(255,255,255,0.09)",
    "28% 38% 0 0 rgba(255,255,255,0.08)",
    "88% 65% 0 0 rgba(255,255,255,0.06)",
    "42% 95% 0 0 rgba(255,255,255,0.08)",
  ].join(", ");

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative preview-bg-base overflow-hidden">
      {/* Background — same as preview */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute w-[600px] h-[600px] rounded-full preview-blob-1"
          style={{
            top: -200,
            left: -100,
            background: "radial-gradient(circle, rgba(193, 68, 14, 0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full preview-blob-2"
          style={{
            top: 200,
            right: -150,
            background: "radial-gradient(circle, rgba(27, 58, 107, 0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute w-[700px] h-[400px] rounded-full preview-blob-3"
          style={{
            bottom: 100,
            left: "30%",
            background: "radial-gradient(ellipse, rgba(139, 69, 19, 0.1) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full preview-blob-4"
          style={{
            top: "calc(40% - 200px)",
            left: "calc(50% - 200px)",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 preview-starfield"
          style={{ boxShadow: starfieldShadows }}
        />
        <div
          className="absolute inset-0 preview-starfield-dim"
          style={{ boxShadow: starfieldShadowsDim }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-lg">
        {/* Headline — fade-in + animated ellipsis */}
        <p
          className="loading-headline-enter font-heading text-white text-[26px] sm:text-[28px] text-center mb-8 sm:mb-10 tracking-tight flex flex-wrap justify-center items-baseline gap-0.5"
          style={{ textShadow: "0 0 40px rgba(193, 68, 14, 0.2), 0 2px 24px rgba(0,0,0,0.4)" }}
        >
          <span>Analyzing your origins{firstName ? `, ${firstName}` : ""}</span>
          <span className="loading-ellipsis inline-flex">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </p>

        {/* Center visual — concentric rings + scanner */}
        <div className="relative flex items-center justify-center w-full max-w-[440px] aspect-square mb-6 sm:mb-8">
          {/* 3 concentric rings — 72.7%, 86.4%, 100% of 440 */}
          <div
            className="absolute rounded-full border border-white/[0.05] loading-ring-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "72.7%",
              height: "72.7%",
              boxShadow: "inset 0 0 60px rgba(255,255,255,0.02)",
            }}
          />
          <div
            className="absolute rounded-full border border-white/[0.1] loading-ring-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "86.4%",
              height: "86.4%",
              boxShadow: "inset 0 0 80px rgba(255,255,255,0.02)",
            }}
          />
          <div
            className="absolute rounded-full border border-white/[0.03] loading-ring-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Main circle + face + orbiting dots — 63.6% = 280/440 */}
          <div className="relative w-[63.6%] aspect-square max-w-[280px] flex items-center justify-center shrink-0">
            {/* Radial ping — subtle sonar pulse (two rings for continuity) */}
            <div
              className="absolute inset-0 rounded-full border-2 border-[#C1440E]/25 pointer-events-none"
              style={{ animation: "loading-sonar-ping 2s ease-out infinite" }}
              aria-hidden
            />
            <div
              className="absolute inset-0 rounded-full border-2 border-[#C1440E]/20 pointer-events-none"
              style={{ animation: "loading-sonar-ping 2s ease-out 1s infinite" }}
              aria-hidden
            />
            {/* Second orbit — 3 dots, reverse direction; ray places dot at 53% from center */}
            <div
              className="loading-orbit-dots-wrap-rev absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[106%] h-[106%]"
              style={{ maxWidth: 298, maxHeight: 298 }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={`rev-${i}`}
                  className="absolute left-0 top-1/2 w-[53%] h-0 -mt-0.5 origin-left"
                  style={{ transform: `rotate(${i * 120}deg)` }}
                >
                  <div
                    className="loading-orbit-dot absolute right-0 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"
                    style={{ boxShadow: "0 0 6px rgba(245, 158, 11, 0.6)" }}
                  />
                </div>
              ))}
            </div>
            {/* 6 orbiting dots — terracotta with glow + stagger pulse */}
            <div
              className="loading-orbit-dots-wrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[106%] h-[106%]"
              style={{ maxWidth: 296, maxHeight: 296 }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute left-0 top-1/2 w-[53%] h-0 -mt-1 origin-left"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                >
                  <div
                    className="loading-orbit-dot absolute right-0 w-2 h-2 rounded-full bg-[#C1440E]"
                    style={{
                      boxShadow: "0 0 10px rgba(193, 68, 14, 0.6)",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Main circle — rotating dashed border + pulsing glow */}
            <div
              className="loading-dash-circle loading-circle-glow absolute rounded-full border-2 border-dashed border-[#C1440E] inset-0 w-full h-full"
              style={{
                boxShadow: "0 0 30px rgba(193, 68, 14, 0.25), 0 0 60px rgba(193, 68, 14, 0.08), inset 0 0 40px rgba(193, 68, 14, 0.06)",
              }}
            />
            {/* Scan line — vertical sweep */}
            <div
              className="loading-scan-line absolute inset-0 w-full pointer-events-none overflow-hidden rounded-full"
              aria-hidden
            >
              <div
                className="absolute left-0 right-0 h-[15%]"
                style={{
                  background: "linear-gradient(to bottom, transparent, rgba(193, 68, 14, 0.2), transparent)",
                }}
              />
            </div>
            {/* Face silhouette — subtle breathe */}
            <svg
              className="loading-face-silhouette absolute pointer-events-none w-[43%] max-w-[120px] h-auto"
              viewBox="0 0 120 140"
              fill="none"
              aria-hidden
            >
              <ellipse cx="60" cy="70" rx="45" ry="55" stroke="white" strokeWidth="2" />
              <circle cx="45" cy="58" r="4" stroke="white" strokeWidth="2" />
              <circle cx="75" cy="58" r="4" stroke="white" strokeWidth="2" />
              <path d="M 50 88 Q 60 98 70 88" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Rotating message — crossfade with subtle max-width */}
        <div className="min-h-[3.5rem] flex items-center justify-center mb-6 relative px-2 loading-reveal-2">
          <p
            key={messageIndex}
            className="loading-message-enter text-white/95 text-center text-[15px] sm:text-lg font-medium absolute inset-0 flex items-center justify-center max-w-[320px] sm:max-w-none mx-auto"
          >
            {ROTATING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Step indicators — staggered reveal + enter animation */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
          {STEPS.map((step) => {
            const completed =
              (step.id <= 2) ||
              (step.id === 3 && stepActive >= 4) ||
              (step.id === 4 && step4Complete);
            const active = step.id === stepActive && !(step.id === 4 && step4Complete);
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${active || completed ? "loading-step-enter" : ""} ${step.id <= 2 ? `loading-reveal-${step.id}` : ""}`}
              >
                {completed ? (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                    ✓
                  </span>
                ) : active ? (
                  <span
                    className="flex-shrink-0 w-3 h-3 rounded-full bg-[#C1440E] animate-pulse"
                    style={{ boxShadow: "0 0 12px rgba(193, 68, 14, 0.8)" }}
                  />
                ) : (
                  <span className="flex-shrink-0 w-3 h-3 rounded-full border-2 border-white/30" />
                )}
                <span
                  className={`text-xs sm:text-sm transition-colors duration-300 ${
                    completed
                      ? "text-white/60 line-through"
                      : active
                        ? "text-white font-medium"
                        : "text-white/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar — glow + traveling shine */}
        <div className="w-full max-w-md overflow-visible mb-10 sm:mb-12 loading-reveal-3">
          <div className="h-[6px] rounded-[3px] bg-white/10 overflow-hidden relative border border-white/5">
            <div
              className="h-full rounded-[3px] transition-[width] duration-200 ease-out relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #C1440E 0%, #E55A1A 45%, #F59E0B 100%)",
                boxShadow: progress > 0 ? "0 0 20px rgba(193, 68, 14, 0.35), 0 0 40px rgba(193, 68, 14, 0.1)" : "none",
              }}
            >
              {progress > 5 && progress < 100 && (
                <div
                  className="absolute top-0 bottom-0 w-[25%] min-w-[40px] pointer-events-none"
                  style={{
                    left: 0,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                    animation: "loading-progress-shine 1.8s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom reassurance — delayed fade-in */}
        <p className="loading-footer-in text-white/40 text-xs sm:text-[13px] text-center tracking-wide">
          <span className="inline-block mr-1.5" aria-hidden>🔒</span>
          Your photo is analyzed securely and never stored.
        </p>
      </div>
    </main>
  );
}
