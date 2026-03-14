"use client";

import WorldMapSimple from "@/components/WorldMapSimple";
import type { RegionKey } from "@/components/WorldMap";

export interface PremiumWorldMapProps {
  regionPercentages: Partial<Record<RegionKey, number>>;
  shares?: Array<{ region: string }>;
  className?: string;
  /** Show unlock overlay at bottom when false */
  isPaid?: boolean;
}

export function PremiumWorldMap({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  regionPercentages,
  shares = [],
  className = "",
  isPaid = true,
}: PremiumWorldMapProps) {
  const detectedRegions = shares.map((s) => s.region);

  return (
    <WorldMapSimple
      className={className}
      detectedRegions={detectedRegions.length > 0 ? detectedRegions : undefined}
      isPaid={isPaid}
      height={380}
    />
  );
}
