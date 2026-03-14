"use client";

import WorldMapSimple from "@/components/WorldMapSimple";

export const WORLD_MAP_VIEWBOX = "0 0 800 420";

/** Contours réalistes des continents (simplifiés, viewBox 800×420) */
export const WORLD_MAP_PATHS = {
  northAmerica:
    "M 180 80 L 160 85 L 140 95 L 125 110 L 120 130 L 125 150 L 135 165 L 145 175 L 150 190 L 145 205 L 135 215 L 125 220 L 120 230 L 125 240 L 135 245 L 150 240 L 165 230 L 175 215 L 185 200 L 195 185 L 205 170 L 215 155 L 220 140 L 218 125 L 210 110 L 200 95 L 190 85 Z",
  southAmerica:
    "M 215 245 L 205 250 L 195 260 L 188 275 L 185 295 L 188 315 L 195 335 L 205 350 L 215 360 L 225 365 L 235 360 L 242 345 L 245 325 L 242 305 L 238 285 L 232 265 L 225 250 Z",
  europe:
    "M 440 75 L 430 80 L 420 85 L 415 95 L 418 105 L 425 112 L 435 115 L 445 112 L 452 105 L 455 95 L 452 85 Z",
  africa:
    "M 440 125 L 425 130 L 415 145 L 410 165 L 412 185 L 418 205 L 428 225 L 440 240 L 452 245 L 462 240 L 470 225 L 474 205 L 472 185 L 468 165 L 460 145 L 452 130 Z",
  asia:
    "M 465 70 L 480 65 L 520 60 L 560 65 L 595 75 L 620 90 L 635 110 L 630 130 L 615 145 L 595 155 L 570 160 L 545 158 L 520 152 L 498 145 L 480 135 L 465 120 L 458 105 L 460 88 Z",
  oceania:
    "M 580 245 L 570 250 L 565 262 L 568 274 L 578 280 L 590 278 L 598 268 L 596 256 L 588 248 Z",
  antarctica:
    "M 200 370 L 280 365 L 360 368 L 440 365 L 520 368 L 580 365 L 580 380 L 200 380 Z",
};


export type RegionKey =
  | "southernEurope"
  | "easternEurope"
  | "westernEurope"
  | "northAfrica"
  | "other";

export interface RegionShare {
  region: string;
  percentage: number;
}

const REGION_IDS: RegionKey[] = [
  "southernEurope",
  "easternEurope",
  "westernEurope",
  "northAfrica",
  "other",
];

export const REGION_COLORS: Record<RegionKey, string> = {
  southernEurope: "#C1440E",
  easternEurope: "#1B3A6B",
  westernEurope: "#2D6A4F",
  northAfrica: "#B5832C",
  other: "#9A8C7E",
};

// Region highlights on the real map (viewBox 0 0 800 420)
const REGION_HIGHLIGHTS = [
  { id: "southernEurope", cx: 450, cy: 100, r: 40, color: "#C1440E", opacity: 0.4, delay: "0s" },
  { id: "northAfrica", cx: 450, cy: 145, r: 45, color: "#F59E0B", opacity: 0.35, delay: "0.4s" },
  { id: "middleEast", cx: 530, cy: 120, r: 38, color: "#3B82F6", opacity: 0.3, delay: "0.8s" },
  { id: "westernEurope", cx: 430, cy: 88, r: 35, color: "#8B5CF6", opacity: 0.25, delay: "1.2s" },
] as const;

/** "dark" = fond navy, "light" = style MyHeritage (océan gris-bleu, continents clairs, contours gris) */
export type WorldMapVariant = "dark" | "light";

export interface WorldMapBaseProps {
  className?: string;
  showHighlights?: boolean;
  showPings?: boolean;
  showGrid?: boolean;
  background?: string;
  variant?: WorldMapVariant;
  /** For origin map: which regions to highlight (by display name). Pings shown on same. */
  activeRegions?: string[];
}

// Style MyHeritage : couleurs pastel pour les zones (comme sur la référence)
const LIGHT_HIGHLIGHTS = [
  { id: "southernEurope", cx: 450, cy: 100, r: 40, color: "#E07C54", opacity: 0.55, delay: "0s" },
  { id: "northAfrica", cx: 450, cy: 145, r: 45, color: "#D4A574", opacity: 0.5, delay: "0.4s" },
  { id: "middleEast", cx: 530, cy: 120, r: 38, color: "#7EB8DA", opacity: 0.45, delay: "0.8s" },
  { id: "westernEurope", cx: 430, cy: 88, r: 35, color: "#9B8EC9", opacity: 0.45, delay: "1.2s" },
] as const;

export function WorldMapBase({
  className = "",
  showHighlights = true,
  showPings = true,
  showGrid = true,
  background,
  variant = "dark",
  activeRegions,
}: WorldMapBaseProps) {
  const isLight = variant === "light";
  const bg = background ?? (isLight ? "#eef3f7" : "#0a1628");
  const highlights = isLight ? LIGHT_HIGHLIGHTS : REGION_HIGHLIGHTS;

  const showHighlight = (id: string) => {
    if (!activeRegions || activeRegions.length === 0) return true;
    const map: Record<string, boolean> = {
      southernEurope: activeRegions.some((r) => r === "Southern Europe"),
      northAfrica: activeRegions.some((r) => r === "North Africa"),
      middleEast: true,
      westernEurope: activeRegions.some((r) => r === "Western Europe"),
    };
    return map[id] ?? false;
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${className}`} style={{ background: bg }}>
      <svg
        viewBox={WORLD_MAP_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block"
      >
        <defs>
          {highlights.map((h) => (
            <radialGradient key={h.id} id={`worldmap-glow-${h.id}-${variant}`}>
              <stop offset="0%" stopColor={h.color} stopOpacity={h.opacity} />
              <stop offset="65%" stopColor={h.color} stopOpacity={isLight ? h.opacity * 0.5 : h.opacity * 0.4} />
              <stop offset="100%" stopColor={h.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Grille : très discrète en mode light, blanche en dark */}
        {showGrid && (
          <g
            stroke={isLight ? "#cbd5e0" : "white"}
            strokeOpacity={isLight ? 0.08 : 0.03}
            strokeWidth="0.5"
            fill="none"
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((p) => (
              <line key={`h-${p}`} x1={0} y1={(p / 100) * 420} x2={800} y2={(p / 100) * 420} />
            ))}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((p) => (
              <line key={`v-${p}`} x1={(p / 100) * 800} y1={0} x2={(p / 100) * 800} y2={420} />
            ))}
          </g>
        )}

        {/* Contours des continents */}
        <g
          fill={isLight ? "#f5f7fa" : "white"}
          fillOpacity={isLight ? 1 : 0.12}
          stroke={isLight ? "#4a5568" : "white"}
          strokeOpacity={isLight ? 0.35 : 0.06}
          strokeWidth={isLight ? 0.6 : 0.5}
        >
          {(Object.entries(WORLD_MAP_PATHS) as [keyof typeof WORLD_MAP_PATHS, string][]).map(
            ([key, d]) => (
              <path key={key} d={d} />
            )
          )}
        </g>

        {/* Zones régionales (blobs colorés type MyHeritage) */}
        {showHighlights &&
          highlights.filter((h) => showHighlight(h.id)).map((h) => (
            <circle
              key={h.id}
              cx={h.cx}
              cy={h.cy}
              r={h.r}
              fill={`url(#worldmap-glow-${h.id}-${variant})`}
              className={isLight ? "" : "worldmap-highlight-pulse"}
              style={isLight ? {} : { animationDelay: h.delay }}
            />
          ))}

        {/* Points de repère (discrets en light) */}
        {showPings &&
          highlights.filter((h) => showHighlight(h.id)).map((h, i) => (
            <g key={`ping-${h.id}`}>
              <circle
                cx={h.cx}
                cy={h.cy}
                r={isLight ? "1.5" : "2"}
                fill={isLight ? "#4a5568" : h.color}
                className={isLight ? "" : "worldmap-ping-dot"}
                style={isLight ? {} : { animationDelay: `${i * 0.5}s` }}
              />
            </g>
          ))}
      </svg>
    </div>
  );
}

/** For results page: real map (react-simple-maps) with markers for detected regions */
export interface WorldMapProps {
  regionPercentages: Partial<Record<RegionKey, number>>;
  className?: string;
}

const REGION_KEY_TO_NAME: Record<RegionKey, string> = {
  southernEurope: "Southern Europe",
  easternEurope: "Eastern Europe",
  westernEurope: "Western Europe",
  northAfrica: "North Africa",
  other: "Other regions",
};

export function WorldMap({ regionPercentages, className = "" }: WorldMapProps) {
  const detectedRegions = (REGION_IDS.filter((key) => (regionPercentages[key] ?? 0) > 0) as RegionKey[]).map(
    (key) => REGION_KEY_TO_NAME[key]
  );
  return (
    <WorldMapSimple
      className={className}
      detectedRegions={detectedRegions.length > 0 ? detectedRegions : undefined}
      isPaid={true}
      height={380}
    />
  );
}

export { REGION_IDS };
