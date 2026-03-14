"use client";

import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/** Rayon des entourages en unités SVG projetées (gros cercles par région) */
const ENTOURAGE_RADIUS = 55;

const REGION_HIGHLIGHTS: Record<string, { coordinates: [number, number]; color: string; label: string }> = {
  southernEurope: { coordinates: [15, 42], color: "#C1440E", label: "Southern Europe" },
  northAfrica: { coordinates: [20, 28], color: "#EF9F27", label: "North Africa" },
  middleEast: { coordinates: [45, 28], color: "#3B8BD4", label: "Middle East" },
  westernEurope: { coordinates: [5, 50], color: "#8B5CF6", label: "Western Europe" },
  easternEurope: { coordinates: [25, 52], color: "#1B3A6B", label: "Eastern Europe" },
  other: { coordinates: [0, 20], color: "#9A8C7E", label: "Other regions" },
};

export interface WorldMapSimpleProps {
  /** Display names of detected regions (e.g. "Southern Europe") — only these get markers; if empty, all highlights show */
  detectedRegions?: string[];
  /** If false, shows unlock overlay at bottom */
  isPaid?: boolean;
  className?: string;
  /** Height in px (default 380) */
  height?: number;
}

export default function WorldMapSimple({
  detectedRegions = [],
  isPaid = true,
  className = "",
  height = 380,
}: WorldMapSimpleProps) {
  const entries = Object.entries(REGION_HIGHLIGHTS);
  const markersToShow =
    detectedRegions.length > 0
      ? entries.filter(([, region]) => detectedRegions.includes(region.label))
      : entries;

  return (
    <div
      className={className}
      style={{ background: "#0a1628", borderRadius: 16, overflow: "hidden", position: "relative" }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 200, center: [22, 38] }}
        style={{ width: "100%", height: `${height}px` }}
      >
        <ZoomableGroup center={[22, 38]} zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "rgba(255,255,255,0.1)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {markersToShow.map(([key, region]) => (
            <Marker key={key} coordinates={region.coordinates}>
              {/* Gros entourages : grands cercles autour des régions */}
              <circle
                r={ENTOURAGE_RADIUS}
                fill={region.color}
                fillOpacity={0.1}
                stroke={region.color}
                strokeWidth={1.8}
                strokeOpacity={0.85}
              />
              <circle
                r={ENTOURAGE_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={0.8}
                strokeOpacity={0.7}
              />
              <text
                textAnchor="middle"
                y={-ENTOURAGE_RADIUS - 6}
                style={{ fontSize: 10, fill: "white", opacity: 0.9, fontFamily: "Inter", fontWeight: 500 }}
              >
                {region.label}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      {!isPaid && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to bottom, transparent, rgba(10,22,40,0.95))",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
            <div style={{ color: "white", fontSize: 13, opacity: 0.7 }}>
              Unlock to see your full migration route
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
