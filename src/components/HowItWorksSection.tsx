"use client";

import { useRef, useEffect, useState } from "react";

function useBandVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Divider() {
  return (
    <div
      className="w-full h-px"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent 100%)",
      }}
    />
  );
}

export function HowItWorksSection() {
  const band1 = useBandVisible();
  const band2 = useBandVisible();
  const band3 = useBandVisible();

  const show = "translate-y-0 opacity-100";
  const hide = "translate-y-5 opacity-0";
  const transition = "transition-all duration-[600ms] ease-out";

  return (
    <section
      className="relative min-h-0 overflow-hidden"
      style={{ backgroundColor: "#0d1117" }}
    >
      <div className="relative max-w-6xl mx-auto px-6 md:px-20">
        {/* Step 1 — content left, visual right */}
        <div
          ref={band1.ref}
          className="flex flex-col md:flex-row md:items-center md:gap-16 gap-12 py-[100px] min-h-[400px]"
        >
          <div
            className={`flex-1 md:pl-0 ${transition} ${
              band1.visible ? show : hide
            }`}
          >
            <p
              className="text-[16px] font-semibold mb-[12px] tabular-nums"
              style={{ color: "#C1440E", letterSpacing: "0.05em" }}
            >
              01
            </p>
            <h2 className="font-heading text-white text-[38px] md:text-[46px] leading-tight mb-4">
              Upload your photo
            </h2>
            <p
              className="text-[18px] max-w-[420px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              A selfie is all we need. Our AI reads what your face and name carry
              in their history.
            </p>
          </div>
          <div
            className={`flex-1 flex justify-center md:justify-end ${transition} ${
              band1.visible ? show : hide
            }`}
          >
            <div
              className="w-[220px] h-[380px] rounded-[32px] flex flex-col items-center justify-center gap-6 relative transition-transform duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div className="relative w-[72px] h-[72px]">
                <div className="absolute inset-0 rounded-full border border-white/30" />
                <div
                  className="absolute -left-0.5 -top-0.5 w-2.5 h-2.5 border-l-2 border-t-2 rounded-tl"
                  style={{ borderColor: "#C1440E" }}
                />
                <div
                  className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 border-r-2 border-t-2 rounded-tr"
                  style={{ borderColor: "#C1440E" }}
                />
                <div
                  className="absolute -left-0.5 -bottom-0.5 w-2.5 h-2.5 border-l-2 border-b-2 rounded-bl"
                  style={{ borderColor: "#C1440E" }}
                />
                <div
                  className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 border-r-2 border-b-2 rounded-br"
                  style={{ borderColor: "#C1440E" }}
                />
              </div>
              <p
                className="text-[11px] flex items-center gap-0.5"
                style={{ color: "#C1440E" }}
              >
                Analyzing origins...
                <span
                  className="inline-block w-px h-3 bg-current animate-pulse"
                  style={{ animationDuration: "1s" }}
                />
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Step 2 — visual left, content right */}
        <div
          ref={band2.ref}
          className="flex flex-col md:flex-row-reverse md:items-center md:gap-16 gap-12 py-[100px] min-h-[400px]"
        >
          <div
            className={`flex-1 md:pr-0 ${transition} ${
              band2.visible ? show : hide
            }`}
          >
            <p
              className="text-[16px] font-semibold mb-[12px] tabular-nums"
              style={{ color: "#C1440E", letterSpacing: "0.05em" }}
            >
              02
            </p>
            <h2 className="font-heading text-white text-[38px] md:text-[46px] leading-tight mb-4">
              Enter your name
            </h2>
            <p
              className="text-[18px] max-w-[420px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Your surname is a map. Martinez, Chen, Dubois — each carries
              centuries of geographic history.
            </p>
          </div>
          <div
            className={`flex-1 flex flex-col items-center justify-center md:items-start ${transition} ${
              band2.visible ? show : hide
            }`}
          >
            <p
              className="text-white text-[42px] md:text-[52px] font-medium mb-8 text-center md:text-left tracking-[0.2em]"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.08)" }}
            >
              MARTINEZ
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span
                className="text-[15px] text-white/90 px-3 py-1.5 rounded-full border-l-2 bg-white/5 transition-colors duration-200 hover:bg-white/10"
                style={{ borderLeftColor: "#C1440E" }}
              >
                Iberian Peninsula
              </span>
              <span
                className="text-[15px] text-white/90 px-3 py-1.5 rounded-full border-l-2 bg-white/5 transition-colors duration-200 hover:bg-white/10"
                style={{ borderLeftColor: "#F59E0B" }}
              >
                Latin Roots
              </span>
              <span
                className="text-[15px] text-white/90 px-3 py-1.5 rounded-full border-l-2 bg-white/5 transition-colors duration-200 hover:bg-white/10"
                style={{ borderLeftColor: "#3B82F6" }}
              >
                Moorish Influence
              </span>
            </div>
          </div>
        </div>

        <Divider />

        {/* Step 3 — content left, visual right */}
        <div
          ref={band3.ref}
          className="flex flex-col md:flex-row md:items-center md:gap-16 gap-12 py-[100px] min-h-[400px]"
        >
          <div
            className={`flex-1 md:pl-0 ${transition} ${
              band3.visible ? show : hide
            }`}
          >
            <p
              className="text-[16px] font-semibold mb-[12px] tabular-nums"
              style={{ color: "#C1440E", letterSpacing: "0.05em" }}
            >
              03
            </p>
            <h2 className="font-heading text-white text-[38px] md:text-[46px] leading-tight mb-4">
              Discover your origins
            </h2>
            <p
              className="text-[18px] max-w-[420px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              A beautiful origin profile, ready to share. No lab, no waiting.
              Just your story.
            </p>
          </div>
          <div
            className={`flex-1 flex justify-center md:justify-end ${transition} ${
              band3.visible ? show : hide
            }`}
          >
            <div
              className="w-full max-w-[340px] bg-white rounded-2xl p-7 transition-transform duration-300 hover:scale-[1.02]"
              style={{
                boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 1px 0 rgba(0,0,0,0.05)",
              }}
            >
              <p
                className="text-[13px] font-medium uppercase tracking-wider mb-5"
                style={{ color: "#1B3A6B" }}
              >
                Your origin profile
              </p>
              <div className="space-y-3">
                {[
                  { label: "Southern Europe", pct: 47, color: "#C1440E" },
                  { label: "North Africa", pct: 31, color: "#F59E0B" },
                  { label: "Middle East", pct: 14, color: "#3B82F6" },
                  { label: "Other", pct: 8, color: "#9CA3AF" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 rounded-lg py-1 px-1 -mx-1 transition-colors duration-150 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-[15px] text-gray-600 truncate">
                        {row.label}
                      </span>
                    </div>
                    <span
                      className="text-[15px] font-bold flex-shrink-0"
                      style={{ color: "#1B3A6B" }}
                    >
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full mt-6 py-3 rounded-xl text-[15px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "#C1440E" }}
              >
                Share my results →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
