"use client";

import { useState, useCallback, useEffect, useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/data/countries";
import { getCountryFlag } from "@/data/countryCodes";
import { getCountryFunFact } from "@/data/countryFunFacts";
import { LandingNavbar } from "@/components/LandingNavbar";

const STORAGE_KEY = "origine-scope-form";

export interface FormData {
  photoDataUrl: string;
  firstName: string;
  lastName: string;
  fatherCountry: string;
  motherCountry: string;
}

const defaultFormData: FormData = {
  photoDataUrl: "",
  firstName: "",
  lastName: "",
  fatherCountry: "",
  motherCountry: "",
};

function loadFormData(): FormData {
  if (typeof window === "undefined") return defaultFormData;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return { ...defaultFormData, ...JSON.parse(s) };
  } catch {}
  return defaultFormData;
}

function saveFormData(data: Partial<FormData>) {
  if (typeof window === "undefined") return;
  const current = loadFormData();
  const next = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function getPossibleOriginFromLastName(lastName: string): { flag: string; label: string } | null {
  const name = lastName.trim().toLowerCase();
  if (name.length < 2) return null;
  if (name.endsWith("ez") || name.endsWith("az") || name.endsWith("iz")) return { flag: "🇪🇸", label: "Iberian Peninsula" };
  if (/^(ben|bel|ait|bou)/.test(name)) return { flag: "🇲🇦", label: "North African / Berber" };
  if (name.endsWith("son") || name.endsWith("sen")) return { flag: "🇬🇧", label: "Northern European" };
  if (name.endsWith("ski") || name.endsWith("sky") || name.endsWith("wicz")) return { flag: "🇵🇱", label: "Eastern European / Slavic" };
  if (name.endsWith("ian") || name.endsWith("yan")) return { flag: "🇦🇲", label: "Armenian / Caucasian" };
  if (name.endsWith("ov") || name.endsWith("ev") || name.endsWith("off")) return { flag: "🇷🇺", label: "Eastern European / Russian" };
  if (name.endsWith("ini") || name.endsWith("etti")) return { flag: "🇮🇹", label: "Italian" };
  if (name.endsWith("opoulos") || name.endsWith("idis")) return { flag: "🇬🇷", label: "Greek" };
  return null;
}

function StepIndicator({ step }: { step: number }) {
  const steps = [
    { key: 1, label: "Photo" },
    { key: 2, label: "Name" },
    { key: 3, label: "Family" },
  ];
  return (
    <div className="flex flex-col items-center w-full mb-10">
      <div className="flex items-center justify-center w-full max-w-[360px]">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`analyze-step-circle ${s.key === step ? "active analyze-step-dot-active" : s.key < step ? "completed" : "pending"}`}
              >
                {s.key < step ? <span aria-hidden>✓</span> : s.key}
              </div>
              <span className="text-xs mt-2 font-medium text-white/40">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="analyze-step-connector mx-1 rounded-full"
                style={{
                  backgroundColor: s.key < step ? "#C1440E" : "rgba(255,255,255,0.12)",
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div
        className="w-full max-w-[200px] h-px mt-6 mx-auto rounded-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(193,68,14,0.2), transparent)" }}
        aria-hidden
      />
    </div>
  );
}

/** Stats SaaS affichées après le scan — engagement, confiance, sans spoiler les origines */
const PHOTO_ANALYSIS_ROWS = [
  { label: "Analyses today", value: "4,847 people discovered their origins", pct: 100, color: "#C1440E" },
  { label: "Avg. completion time", value: "Under 30 seconds", pct: 98, color: "#C1440E" },
  { label: "User satisfaction", value: "98% would recommend", pct: 98, color: "#C1440E" },
  { label: "Your analysis", value: "Ready for next step", pct: 100, color: "#22c55e" },
] as const;

function Step2Names({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: {
  firstName: string;
  lastName: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
}) {
  const [detectingOrigin, setDetectingOrigin] = useState(false);
  const [originResult, setOriginResult] = useState<{ flag: string; label: string } | null>(null);
  const [sparkleFirst, setSparkleFirst] = useState(false);
  const [sparkleLast, setSparkleLast] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detectDoneRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (detectDoneRef.current) clearTimeout(detectDoneRef.current);
    const name = lastName.trim();
    if (name.length < 2) {
      setDetectingOrigin(false);
      setOriginResult(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      setOriginResult(null);
      setDetectingOrigin(true);
      detectDoneRef.current = setTimeout(() => {
        detectDoneRef.current = null;
        setDetectingOrigin(false);
        setOriginResult(getPossibleOriginFromLastName(name) ?? null);
      }, 1000);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (detectDoneRef.current) clearTimeout(detectDoneRef.current);
    };
  }, [lastName]);

  const handleFirstChange = (v: string) => {
    if (v.length === 1 && !firstName) setSparkleFirst(true);
    onFirstNameChange(v);
  };
  const handleLastChange = (v: string) => {
    if (v.length === 1 && !lastName) setSparkleLast(true);
    onLastNameChange(v);
  };

  return (
    <div className="space-y-6 relative">
      <span className="analyze-step-number-bg" aria-hidden>02</span>
      <div className="text-center relative">
        <span className="analyze-title-dot inline-block w-2 h-2 rounded-full mb-3" style={{ backgroundColor: "rgba(193,68,14,0.5)" }} aria-hidden />
        <h2 className="font-heading text-[32px] font-semibold text-white">
          What is your name ?
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
        <div className="analyze-input-wrap relative">
          <label htmlFor="first-name" className={`analyze-floating-label ${firstName ? "filled" : ""}`}>
            First name
          </label>
          <input
            id="first-name"
            type="text"
            value={firstName}
            onChange={(e) => handleFirstChange(e.target.value)}
            required
            className="analyze-input-dark pt-5 h-[56px]"
            placeholder=" "
          />
          {sparkleFirst && (
            <>
              <span className="analyze-sparkle-dot" style={{ left: "50%", top: "50%", animationDelay: "0ms" }} />
              <span className="analyze-sparkle-dot" style={{ left: "40%", top: "45%", animationDelay: "80ms" }} />
              <span className="analyze-sparkle-dot" style={{ left: "60%", top: "55%", animationDelay: "160ms" }} />
            </>
          )}
        </div>
        <div className="analyze-input-wrap relative">
          <label htmlFor="last-name" className={`analyze-floating-label ${lastName ? "filled" : ""}`}>
            Last name
          </label>
          <input
            id="last-name"
            type="text"
            value={lastName}
            onChange={(e) => handleLastChange(e.target.value)}
            required
            className="analyze-input-dark pt-5 h-[56px]"
            placeholder=" "
          />
          {sparkleLast && (
            <>
              <span className="analyze-sparkle-dot" style={{ left: "50%", top: "50%", animationDelay: "0ms" }} />
              <span className="analyze-sparkle-dot" style={{ left: "40%", top: "45%", animationDelay: "80ms" }} />
              <span className="analyze-sparkle-dot" style={{ left: "60%", top: "55%", animationDelay: "160ms" }} />
            </>
          )}
          {(detectingOrigin || originResult) && (
            <p className="mt-2 text-[13px] text-white/70">
              {detectingOrigin ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 border border-white/10 animate-pulse">
                  🌍 Detecting origin...
                </span>
              ) : originResult ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C1440E]/20 px-3 py-2 border border-[#C1440E]/40">
                  📍 Possible origin: {originResult.flag} {originResult.label}
                </span>
              ) : null}
            </p>
          )}
        </div>
      </div>
      <p className="text-white/60 text-sm text-center relative">
        Your last name carries centuries of geographic history.
      </p>
    </div>
  );
}

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormDataState] = useState<FormData>(defaultFormData);
  const [leavingStep, setLeavingStep] = useState<number | null>(null);
  const [showBurst, setShowBurst] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const setFormData = useCallback((updates: Partial<FormData>) => {
    setFormDataState((prev) => {
      const next = { ...prev, ...updates };
      saveFormData(next);
      return next;
    });
  }, []);

  useEffect(() => {
    setFormDataState(loadFormData());
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setFormData({ photoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setFormData({ photoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!formData.photoDataUrl) return;
    const t = setTimeout(() => setScanComplete(true), 1500);
    return () => clearTimeout(t);
  }, [formData.photoDataUrl]);

  useEffect(() => {
    if (!formData.photoDataUrl) setScanComplete(false);
  }, [formData.photoDataUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setLeavingStep(step);
      setStep(step + 1);
      setTimeout(() => setLeavingStep(null), 400);
      return;
    }
    setShowBurst(true);
    setTimeout(() => router.push("/loading"), 600);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const isStepValid =
    (step === 1 && !!formData.photoDataUrl) ||
    (step === 2 &&
      formData.firstName.trim().length > 0 &&
      formData.lastName.trim().length > 0) ||
    (step === 3 &&
      !!formData.fatherCountry &&
      !!formData.motherCountry);

  const fatherId = useId();
  const motherId = useId();

  function renderStep1() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <span className="analyze-title-dot inline-block w-2 h-2 rounded-full mb-3" style={{ backgroundColor: "rgba(193,68,14,0.5)" }} aria-hidden />
          <h2 className="font-heading text-[32px] font-semibold text-white">Upload your photo</h2>
        </div>
        <p className="text-white/60 text-[15px] text-center max-w-[400px] mx-auto leading-relaxed">
          Our AI analyzes your facial features to estimate your geographic origins.
        </p>
        {formData.photoDataUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative w-[180px] h-[180px] flex-shrink-0">
              <div className="absolute inset-0 rounded-full overflow-hidden border-2 bg-[#1a1f2e]" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.photoDataUrl} alt="You" className="w-full h-full object-cover object-center" />
              </div>
              <div className="analyze-face-bracket top-left" aria-hidden />
              <div className="analyze-face-bracket top-right" aria-hidden />
              <div className="analyze-face-bracket bottom-left" aria-hidden />
              <div className="analyze-face-bracket bottom-right" aria-hidden />
              <div key={formData.photoDataUrl} className="analyze-scan-line" aria-hidden />
              <div className="absolute top-0 right-0 rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1" style={{ background: "rgba(34, 197, 94, 0.9)", color: "white" }}>
                <span aria-hidden>✓</span> Face detected
              </div>
            </div>
            <label className="mt-3 text-white/60 text-[12px] cursor-pointer hover:text-[#C1440E] transition-colors">
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              Change photo
            </label>
            {scanComplete && (
              <div className="mt-6 w-full max-w-[320px] rounded-xl bg-[#1a1f2e] border border-white/10 p-4 space-y-3">
                {PHOTO_ANALYSIS_ROWS.map((row, i) => (
                  <div key={row.label} className="analyze-ai-row" style={{ animationDelay: `${i * 300}ms` }}>
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="text-white/70 text-[13px] font-medium">{row.label}</span>
                      <span className="text-white text-[12px] font-semibold">{row.pct}%</span>
                    </div>
                    <p className="text-white/90 text-[12px] mb-1.5">{row.value}</p>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center w-full h-[200px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 hover:border-[#C1440E]/70 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#C1440E]/10"
            style={{ borderColor: "rgba(193, 68, 14, 0.5)" }}
          >
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#C1440E" }} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 13v2a2 2 0 01-2 2h-2" />
            </svg>
            <p className="text-white font-medium text-base">Drag your photo here</p>
            <p className="text-white/60 text-[13px] mt-0.5">or click to browse</p>
          </label>
        )}
        <p className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-white/40 text-xs rounded-full py-2 px-4 bg-white/5 border border-white/10">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-white/50" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your photo is analyzed locally and never stored on our servers.
          </span>
        </p>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <span className="analyze-title-dot inline-block w-2 h-2 rounded-full mb-3" style={{ backgroundColor: "rgba(193,68,14,0.5)" }} aria-hidden />
          <h2 className="font-heading text-[32px] font-semibold text-white">Where is your family from ?</h2>
        </div>
        <p className="text-white/60 text-[15px] text-center max-w-[400px] mx-auto">
          Select your parents&apos; countries of birth.
        </p>
        <div className="space-y-6">
          <div>
            <label htmlFor={fatherId} className="block text-[13px] font-medium text-white/40 mb-2">Father&apos;s country of birth</label>
            <div className="flex flex-col items-center gap-3">
              <span className="analyze-flag-emoji-lg" key={formData.fatherCountry || "f-none"}>
                {formData.fatherCountry ? getCountryFlag(formData.fatherCountry) : "🌐"}
              </span>
              <div className="relative w-full">
                <select
                  id={fatherId}
                  value={formData.fatherCountry}
                  onChange={(e) => setFormData({ fatherCountry: e.target.value })}
                  required
                  className="analyze-input-dark w-full h-[52px] pl-4 pr-10 appearance-none cursor-pointer focus:border-[#C1440E] focus:shadow-[0_0_0_3px_rgba(193,68,14,0.2)]"
                >
                  <option value="" disabled className="bg-[#1a1f2e] text-white/50">Select a country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#1a1f2e] text-white">{getCountryFlag(c)} {c}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </div>
              {formData.fatherCountry && getCountryFunFact(formData.fatherCountry) && (
                <p className="text-white/50 text-[13px] text-center leading-relaxed w-full">
                  {getCountryFunFact(formData.fatherCountry)}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor={motherId} className="block text-[13px] font-medium text-white/40 mb-2">Mother&apos;s country of birth</label>
            <div className="flex flex-col items-center gap-3">
              <span className="analyze-flag-emoji-lg" key={formData.motherCountry || "m-none"}>
                {formData.motherCountry ? getCountryFlag(formData.motherCountry) : "🌐"}
              </span>
              <div className="relative w-full">
                <select
                  id={motherId}
                  value={formData.motherCountry}
                  onChange={(e) => setFormData({ motherCountry: e.target.value })}
                  required
                  className="analyze-input-dark w-full h-[52px] pl-4 pr-10 appearance-none cursor-pointer focus:border-[#C1440E] focus:shadow-[0_0_0_3px_rgba(193,68,14,0.2)]"
                >
                  <option value="" disabled className="bg-[#1a1f2e] text-white/50">Select a country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#1a1f2e] text-white">{getCountryFlag(c)} {c}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </div>
              {formData.motherCountry && getCountryFunFact(formData.motherCountry) && (
                <p className="text-white/50 text-[13px] text-center leading-relaxed w-full">
                  {getCountryFunFact(formData.motherCountry)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const starfieldShadows = [
    "8% 15% 0 0 rgba(255,255,255,0.28)",
    "25% 40% 0 0 rgba(255,255,255,0.32)",
    "55% 65% 0 0 rgba(255,255,255,0.24)",
    "75% 20% 0 0 rgba(255,255,255,0.22)",
    "15% 75% 0 0 rgba(255,255,255,0.2)",
    "88% 50% 0 0 rgba(255,255,255,0.24)",
    "42% 8% 0 0 rgba(255,255,255,0.16)",
    "60% 85% 0 0 rgba(255,255,255,0.22)",
    "30% 55% 0 0 rgba(255,255,255,0.3)",
    "92% 32% 0 0 rgba(255,255,255,0.18)",
    "5% 45% 0 0 rgba(255,255,255,0.2)",
    "68% 75% 0 0 rgba(255,255,255,0.18)",
    "38% 22% 0 0 rgba(255,255,255,0.26)",
    "82% 62% 0 0 rgba(255,255,255,0.2)",
    "18% 90% 0 0 rgba(255,255,255,0.14)",
    "50% 12% 0 0 rgba(255,255,255,0.12)",
  ].join(", ");
  const starfieldDim = [
    "12% 28% 0 0 rgba(255,255,255,0.1)",
    "48% 62% 0 0 rgba(255,255,255,0.09)",
    "72% 35% 0 0 rgba(255,255,255,0.08)",
    "35% 80% 0 0 rgba(255,255,255,0.1)",
    "85% 18% 0 0 rgba(255,255,255,0.07)",
    "22% 50% 0 0 rgba(255,255,255,0.06)",
    "58% 88% 0 0 rgba(255,255,255,0.08)",
    "90% 70% 0 0 rgba(255,255,255,0.05)",
  ].join(", ");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative px-4 py-24 preview-bg-base overflow-hidden">
      <LandingNavbar variant="analyze" />

      {/* Background — terracotta top-left, deep blue bottom-right, starfield, drifting particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: -180,
            left: -120,
            background: "radial-gradient(circle, rgba(193, 68, 14, 0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute w-[550px] h-[550px] rounded-full"
          style={{
            bottom: -200,
            right: -150,
            background: "radial-gradient(circle, rgba(27, 58, 107, 0.2) 0%, transparent 65%)",
          }}
        />
        <div className="absolute inset-0 preview-starfield" style={{ boxShadow: starfieldShadows }} />
        <div className="absolute inset-0 preview-starfield-dim" style={{ boxShadow: starfieldDim }} />
        {/* Drifting particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="analyze-drift-particle"
            style={{
              left: `${10 + i * 12}%`,
              bottom: `${5 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 75% 65% at 50% 45%, transparent 40%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full analyze-card-border-wrap">
        <div className="absolute -inset-8 pointer-events-none overflow-hidden rounded-[32px]" aria-hidden>
          <div
            className="absolute w-[280px] h-[280px] rounded-full opacity-60"
            style={{
              top: -60,
              left: -40,
              background: "radial-gradient(circle, rgba(193, 68, 14, 0.25) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute w-[260px] h-[260px] rounded-full opacity-60"
            style={{
              bottom: -50,
              right: -30,
              background: "radial-gradient(circle, rgba(27, 58, 107, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        <div
          className="relative rounded-[24px] p-[64px] overflow-visible analyze-card analyze-card-in"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(193,68,14,0.08), 0 40px 80px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[24px] analyze-accent-shimmer"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(193,68,14,0.4) 20%, rgba(193,68,14,0.6) 50%, rgba(245,158,11,0.3) 80%, transparent 100%)",
            }}
            aria-hidden
          />

          <div
            className="absolute top-5 right-5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white/80 analyze-progress-pulse"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {step === 1 ? "33%" : step === 2 ? "66%" : "100%"}
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px]" aria-hidden>
            <div className="analyze-particle" />
            <div className="analyze-particle" />
            <div className="analyze-particle" />
            <div className="analyze-particle" />
            <div className="analyze-particle" />
          </div>

          <StepIndicator step={step} />

          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="relative min-h-[340px]">
              {leavingStep !== null && (
                <div className="absolute inset-0 analyze-step-transition-out">
                  {leavingStep === 1 && renderStep1()}
                  {leavingStep === 2 && (
                    <Step2Names
                      firstName={formData.firstName}
                      lastName={formData.lastName}
                      onFirstNameChange={(v) => setFormData({ firstName: v })}
                      onLastNameChange={(v) => setFormData({ lastName: v })}
                    />
                  )}
                  {leavingStep === 3 && renderStep3()}
                </div>
              )}
              <div className={leavingStep !== null ? "analyze-step-transition-in" : ""}>
                {step === 1 && renderStep1()}
                {step === 2 && (
                  <Step2Names
                    firstName={formData.firstName}
                    lastName={formData.lastName}
                    onFirstNameChange={(v) => setFormData({ firstName: v })}
                    onLastNameChange={(v) => setFormData({ lastName: v })}
                  />
                )}
                {step === 3 && renderStep3()}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border border-white/15 text-white/80 font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={!isStepValid}
                className={`flex-1 analyze-btn-continue rounded-xl font-semibold text-base text-white transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none hover:bg-[#a63a0c] hover:shadow-lg hover:shadow-[#C1440E]/25 hover:scale-[1.02] active:scale-[0.98] relative overflow-visible ${isStepValid ? "analyze-btn-shimmer analyze-btn-shimmer-3s" : ""}`}
                style={{ backgroundColor: "#C1440E" }}
              >
                {showBurst && (
                  <>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      const x = Math.round(50 * Math.cos(rad));
                      const y = Math.round(-50 * Math.sin(rad));
                      return (
                        <span
                          key={i}
                          className="analyze-burst-dot"
                          style={{ ["--burst-x" as string]: `${x}px`, ["--burst-y" as string]: `${y}px` }}
                          aria-hidden
                        />
                      );
                    })}
                  </>
                )}
                {step === 3 ? "Analyze my origins now →" : "Continue →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
