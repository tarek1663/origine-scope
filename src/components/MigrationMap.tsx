"use client";

import WorldMapSimple from "@/components/WorldMapSimple";

const TERRACOTTA = "#C1440E";

export interface MigrationMapProps {
  isPaid: boolean;
}

export function MigrationMap({ isPaid }: MigrationMapProps) {
  return (
    <section className="w-full rounded-2xl overflow-hidden frosted-glass p-8 pb-6">
      <p className="preview-section-label mb-1">Route</p>
      <h2 className="preview-section-title text-2xl md:text-[28px] mb-1">
        Your ancestral migration route
      </h2>
      <p className="preview-section-subtitle mb-2">
        Tracing your family&apos;s journey across centuries.
      </p>
      {!isPaid && (
        <p
          className="italic mb-6"
          style={{ color: TERRACOTTA, fontSize: 14 }}
        >
          Your ancestors traveled further than you think — unlock to see the full journey.
        </p>
      )}

      <WorldMapSimple
        isPaid={isPaid}
        height={480}
        className="w-full rounded-xl overflow-hidden mt-4"
      />
    </section>
  );
}
