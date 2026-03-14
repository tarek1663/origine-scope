import type { RegionKey } from "@/components/WorldMap";

export interface RegionShare {
  region: string;
  percentage: number;
  key: RegionKey;
}

const REGION_NAMES: Record<RegionKey, string> = {
  southernEurope: "Southern Europe",
  easternEurope: "Eastern Europe",
  westernEurope: "Western Europe",
  northAfrica: "North Africa",
  other: "Other regions",
};

function randomVariation(max = 5): number {
  return (Math.random() - 0.5) * 2 * max;
}

function normalizeTo100(weights: Record<RegionKey, number>): Record<RegionKey, number> {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (total <= 0) return weights;
  const result = {} as Record<RegionKey, number>;
  for (const k of Object.keys(weights) as RegionKey[]) {
    result[k] = Math.max(0, (weights[k] / total) * 100 + randomVariation(5));
  }
  const sum = Object.values(result).reduce((a, b) => a + b, 0);
  const scale = 100 / sum;
  for (const k of Object.keys(result) as RegionKey[]) {
    result[k] = Math.round(Math.max(0, result[k] * scale) * 10) / 10;
  }
  const remainder = 100 - Object.values(result).reduce((a, b) => a + b, 0);
  const firstKey = Object.keys(result)[0] as RegionKey;
  result[firstKey] = Math.round((result[firstKey] + remainder) * 10) / 10;
  return result;
}

export function estimateOrigins(
  lastName: string,
  fatherCountry: string,
  motherCountry: string
): RegionShare[] {
  const lower = lastName.toLowerCase().trim();
  const weights: Record<RegionKey, number> = {
    southernEurope: 0,
    easternEurope: 0,
    westernEurope: 0,
    northAfrica: 0,
    other: 0,
  };

  const southernPatterns = [/i$/, /o$/, /ez$/, /as$/, /es$/, /ou$/];
  const northAfricanPatterns = [/ben/, /bel/, /ait/, /ould/];
  const easternPatterns = [/ski$/i, /ov$/i, /ev$/i, /ic$/i, /vic$/i];

  if (southernPatterns.some((p) => p.test(lower))) {
    weights.southernEurope = 50;
    weights.westernEurope = 20;
    weights.easternEurope = 10;
    weights.northAfrica = 10;
    weights.other = 10;
  } else if (northAfricanPatterns.some((p) => p.test(lower))) {
    weights.northAfrica = 50;
    weights.southernEurope = 20;
    weights.westernEurope = 15;
    weights.easternEurope = 5;
    weights.other = 10;
  } else if (easternPatterns.some((p) => p.test(lower))) {
    weights.easternEurope = 50;
    weights.westernEurope = 20;
    weights.southernEurope = 15;
    weights.northAfrica = 5;
    weights.other = 10;
  } else {
    weights.westernEurope = 35;
    weights.southernEurope = 25;
    weights.easternEurope = 20;
    weights.northAfrica = 10;
    weights.other = 10;
  }

  const countryToRegion: Record<string, RegionKey> = {
    Spain: "southernEurope",
    Italy: "southernEurope",
    Greece: "southernEurope",
    Portugal: "southernEurope",
    France: "westernEurope",
    Germany: "westernEurope",
    "United Kingdom": "westernEurope",
    Belgium: "westernEurope",
    Netherlands: "westernEurope",
    Poland: "easternEurope",
    Ukraine: "easternEurope",
    Russia: "easternEurope",
    Romania: "easternEurope",
    "Czech Republic": "easternEurope",
    Hungary: "easternEurope",
    Morocco: "northAfrica",
    Algeria: "northAfrica",
    Tunisia: "northAfrica",
    Libya: "northAfrica",
    Egypt: "northAfrica",
  };

  const addFromCountry = (country: string) => {
    const region = countryToRegion[country];
    if (region) {
      weights[region] = (weights[region] || 0) + 15;
    }
  };

  addFromCountry(fatherCountry);
  addFromCountry(motherCountry);

  const normalized = normalizeTo100(weights);

  const shares: RegionShare[] = (
    Object.entries(normalized) as [RegionKey, number][]
  )
    .filter(([, pct]) => pct > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([key, percentage]) => ({
      region: REGION_NAMES[key],
      percentage,
      key,
    }));

  const sum = shares.reduce((a, s) => a + s.percentage, 0);
  if (shares.length > 0 && Math.abs(sum - 100) > 0.1) {
    shares[0].percentage = Math.round((shares[0].percentage + (100 - sum)) * 10) / 10;
  }
  return shares;
}

export function getRegionParagraph(regionName: string): string {
  const paragraphs: Record<string, string> = {
    "Southern Europe":
      "Your roots run deep in the Mediterranean basin, a cradle of ancient civilizations where history, art and passion have always intertwined.",
    "Eastern Europe":
      "Your heritage echoes the vast landscapes and resilient spirit of Eastern Europe, where tradition and strength have shaped generations.",
    "Western Europe":
      "Your origins connect you to the heart of Western Europe, where culture, innovation and diversity have flourished for centuries.",
    "North Africa":
      "Your ancestry is woven into the rich tapestry of North Africa, where Mediterranean and African influences have met for millennia.",
    "Other regions":
      "Your origins span diverse horizons, reflecting the beautiful complexity of human migration and connection across the world.",
  };
  return paragraphs[regionName] ?? paragraphs["Other regions"];
}
