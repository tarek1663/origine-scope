"use client";

import { getEthnicGroupsForRegions } from "@/data/ethnicGroups";

export default function EthnicGroups({ isPaid, detectedRegions }: { isPaid: boolean; detectedRegions: string[] }) {
  const groups = getEthnicGroupsForRegions(detectedRegions);

  if (groups.length === 0) return null;

  return (
    <section className="relative w-full rounded-2xl overflow-hidden mt-8 p-8 md:p-10 frosted-glass preview-card">
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(193,68,14,0.4) 20%, rgba(193,68,14,0.6) 50%, rgba(245,158,11,0.3) 80%, transparent 100%)",
        }}
        aria-hidden
      />

      <header className="mb-8">
        <p className="preview-section-label mb-2">Ethnic heritage</p>
        <h2 className="preview-section-title text-2xl md:text-[28px] mb-2">
          Your ethnic group breakdown
        </h2>
        <p className="text-white/60 text-sm md:text-[15px] max-w-xl leading-relaxed">
          Based on your detected origins, here are the specific ethnic groups in your ancestry.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {groups.map((group, index) => (
          <div
            key={`${group.region}-${group.name}-${index}`}
            className={`ethnic-group-card ${!isPaid && index > 1 ? "pointer-events-none" : ""}`}
            style={{
              filter: !isPaid && index > 1 ? "blur(5px)" : "none",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <span
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                aria-hidden
              >
                {group.flag}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-[15px] leading-tight mb-0.5">
                  {group.name}
                </h3>
                <p className="text-[#C1440E] text-xs font-medium">{group.region}</p>
              </div>
              {!isPaid && index > 1 && (
                <span className="flex-shrink-0 text-base opacity-80" aria-hidden>🔒</span>
              )}
            </div>

            <p className="text-white/60 text-[13px] leading-relaxed mb-4">
              {group.description}
            </p>

            <div className="space-y-3">
              <div>
                <p className="ethnic-group-card-label">Subgroups</p>
                <div className="flex flex-wrap gap-2">
                  {group.subgroups.map((sub, i) => (
                    <span key={i} className="ethnic-group-pill-subgroup">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="ethnic-group-card-label">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {group.languages.map((lang, i) => (
                    <span key={i} className="ethnic-group-pill-lang">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isPaid && groups.length > 2 && (
        <div className="ethnic-groups-unlock-footer">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden>🔒</span>
            <span>{groups.length - 2} more ethnic groups detected — unlock to reveal all</span>
          </span>
        </div>
      )}
    </section>
  );
}
