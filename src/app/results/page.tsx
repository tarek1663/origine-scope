"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { WorldMap } from "@/components/WorldMap";
import { MigrationMap } from "@/components/MigrationMap";
import EthnicGroups from "@/components/EthnicGroups";
import { LandingNavbar } from "@/components/LandingNavbar";
import type { RegionKey } from "@/components/WorldMap";
import { estimateOrigins, getRegionParagraph } from "@/lib/estimateOrigins";

const PAID_FLAG_KEY = "origine-scope-paid";
const FORM_STORAGE_KEY = "origine-scope-form";

function loadFormData(): { lastName: string; fatherCountry: string; motherCountry: string } {
  if (typeof window === "undefined")
    return { lastName: "", fatherCountry: "", motherCountry: "" };
  try {
    const s = localStorage.getItem(FORM_STORAGE_KEY);
    if (s) {
      const d = JSON.parse(s);
      return {
        lastName: d.lastName || "",
        fatherCountry: d.fatherCountry || "",
        motherCountry: d.motherCountry || "",
      };
    }
  } catch {}
  return { lastName: "", fatherCountry: "", motherCountry: "" };
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [shares, setShares] = useState<ReturnType<typeof estimateOrigins> | null>(null);
  const [regionPercentages, setRegionPercentages] = useState<Partial<Record<RegionKey, number>>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const devBypass = searchParams.get("dev") === "true";
    if (devBypass) {
      setAllowed(true);
      const form = loadFormData();
      const result = estimateOrigins(form.lastName, form.fatherCountry, form.motherCountry);
      setShares(result);
      const pct: Partial<Record<RegionKey, number>> = {};
      result.forEach((s) => {
        pct[s.key] = s.percentage;
      });
      setRegionPercentages(pct);
      return;
    }

    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const alreadyPaid = typeof window !== "undefined" && localStorage.getItem(PAID_FLAG_KEY) === "true";

    if (alreadyPaid) {
      setAllowed(true);
      const form = loadFormData();
      const result = estimateOrigins(form.lastName, form.fatherCountry, form.motherCountry);
      setShares(result);
      const pct: Partial<Record<RegionKey, number>> = {};
      result.forEach((s) => {
        pct[s.key] = s.percentage;
      });
      setRegionPercentages(pct);
      return;
    }

    if (success === "true" && sessionId) {
      fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paid) {
            localStorage.setItem(PAID_FLAG_KEY, "true");
            setAllowed(true);
            const form = loadFormData();
            const result = estimateOrigins(form.lastName, form.fatherCountry, form.motherCountry);
            setShares(result);
            const pct: Partial<Record<RegionKey, number>> = {};
            result.forEach((s) => {
              pct[s.key] = s.percentage;
            });
            setRegionPercentages(pct);
          } else {
            router.replace("/preview");
          }
        })
        .catch(() => router.replace("/preview"));
      return;
    }

    setAllowed(false);
  }, [searchParams, router]);

  const handleShare = useCallback(async () => {
    if (!shares || shares.length === 0) return;
    const text = `My origins according to OrigineScope: ${shares.map((s) => `${s.region} ${s.percentage}%`).join(", ")}. Discover yours!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My origins — OrigineScope",
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
  }, [shares]);

  const handleDownloadImage = useCallback(() => {
    if (!shares || shares.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = 800;
    const h = 500;
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = "#F5E6D0";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2C1810";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("My origins — OrigineScope", w / 2, 50);
    ctx.font = "18px system-ui, sans-serif";
    const list = shares.map((s) => `${s.region}: ${s.percentage}%`).join("  ·  ");
    ctx.fillText(list, w / 2, 90);
    const topRegion = shares[0];
    const paragraph = getRegionParagraph(topRegion.region);
    ctx.font = "16px system-ui, sans-serif";
    const lines = paragraph.match(/.{1,60}(\s|$)/g) || [paragraph];
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), w / 2, 140 + i * 24);
    });
    const link = document.createElement("a");
    link.download = "origine-scope-results.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [shares]);

  if (allowed === null) {
    return (
      <main className="min-h-screen flex items-center justify-center preview-bg-base">
        <p className="text-white/80 font-medium">Verifying...</p>
      </main>
    );
  }

  if (allowed === false) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center preview-bg-base px-4">
        <p className="text-white/90 font-medium mb-4">Access denied. Please complete your purchase first.</p>
        <Link href="/preview" className="text-[#C1440E] font-semibold hover:underline">
          Unlock my results
        </Link>
      </main>
    );
  }

  const topRegion = shares && shares[0];
  const paragraph = topRegion ? getRegionParagraph(topRegion.region) : "";

  return (
    <main className="min-h-screen preview-bg-base px-4 py-10 pb-20 relative overflow-hidden">
      <LandingNavbar />
      <div className="max-w-2xl mx-auto relative z-10">
        <header className="text-center mb-10">
          <p className="preview-section-label mb-2">Full results</p>
          <h1 className="preview-section-title text-2xl md:text-3xl text-white mb-2">
            Your origin profile
          </h1>
          <p className="text-white/60 text-sm">
            Your complete ancestry breakdown and ethnic heritage
          </p>
        </header>

        <div className="relative rounded-2xl overflow-hidden frosted-glass preview-card mb-6">
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl z-10 bg-gradient-to-r from-transparent via-[#C1440E]/50 to-transparent" aria-hidden />
          <div className="aspect-video w-full">
            <WorldMap
              regionPercentages={regionPercentages}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="mb-6">
          <MigrationMap isPaid={true} />
        </div>

        {shares && shares.length > 0 && (
          <>
            <div className="mb-6">
              <EthnicGroups isPaid={true} detectedRegions={shares.map((s) => s.region)} />
            </div>
            <div className="rounded-2xl frosted-glass preview-card p-6 mb-6">
              <p className="preview-section-label mb-3">Breakdown</p>
              <ul className="flex flex-wrap gap-3">
                {shares.map((s) => (
                  <li
                    key={s.region}
                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white font-medium text-sm"
                  >
                    {s.region}: {s.percentage}%
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl frosted-glass preview-card p-6 mb-8">
              <p className="preview-body text-[15px] leading-relaxed text-white/80">
                {paragraph}
              </p>
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <button
            onClick={handleShare}
            className="preview-btn-primary rounded-xl bg-[#C1440E] text-white font-semibold py-3 px-6 hover:bg-[#a63a0c] hover:shadow-lg hover:shadow-[#C1440E]/25 transition-all"
          >
            Share my origins
          </button>
          <button
            onClick={handleDownloadImage}
            className="rounded-xl border border-white/20 text-white font-semibold py-3 px-6 hover:bg-white/10 transition-colors"
          >
            Download image
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <p className="text-sm text-white/50 text-center leading-relaxed">
          OrigineScope provides estimated results for entertainment purposes based on name analysis and declared family origins. This is not a DNA test.
        </p>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center preview-bg-base">
          <p className="text-white/80 font-medium">Loading...</p>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
