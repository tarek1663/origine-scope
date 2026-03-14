export const ETHNIC_GROUPS_BY_REGION: Record<string, {
  name: string;
  percentage: number;
  description: string;
  region: string;
  subgroups: string[];
  languages: string[];
  flag: string;
}[]> = {
  northAfrica: [
    {
      name: "Berber / Amazigh",
      percentage: 0,
      description: "Indigenous people of North Africa, predating Arab conquest by thousands of years",
      region: "North Africa",
      subgroups: ["Kabyle", "Chaoui", "Tuareg", "Rif", "Chleuh", "Mozabite"],
      languages: ["Tamazight", "Kabyle", "Tachelhit"],
      flag: "🏔️"
    },
    {
      name: "Arab-Maghrebi",
      percentage: 0,
      description: "Arabic-speaking populations of North Africa with mixed Berber and Arab heritage",
      region: "North Africa",
      subgroups: ["Algerian Arab", "Moroccan Arab", "Tunisian Arab", "Libyan Arab"],
      languages: ["Darija", "Maghrebi Arabic"],
      flag: "🌙"
    },
    {
      name: "Moor / Moorish",
      percentage: 0,
      description: "Historical term for Muslim populations of North Africa and Iberian Peninsula",
      region: "North Africa / Southern Europe",
      subgroups: ["Andalusian Moor", "Mauritanian"],
      languages: ["Arabic", "Tamazight"],
      flag: "⭐"
    }
  ],
  southernEurope: [
    {
      name: "Iberian",
      percentage: 0,
      description: "Indigenous pre-Roman peoples of the Iberian Peninsula",
      region: "Southern Europe",
      subgroups: ["Castilian", "Catalan", "Andalusian", "Galician", "Basque"],
      languages: ["Spanish", "Catalan", "Basque", "Galician"],
      flag: "🇪🇸"
    },
    {
      name: "Italian / Roman",
      percentage: 0,
      description: "Descendants of the ancient Roman civilization and pre-Roman Italic peoples",
      region: "Southern Europe",
      subgroups: ["Sicilian", "Neapolitan", "Sardinian", "Northern Italian"],
      languages: ["Italian", "Sardinian", "Sicilian dialect"],
      flag: "🇮🇹"
    },
    {
      name: "Greek / Hellenic",
      percentage: 0,
      description: "One of the oldest continuous civilizations in Europe",
      region: "Southern Europe",
      subgroups: ["Macedonian Greek", "Cretan", "Peloponnesian"],
      languages: ["Greek"],
      flag: "🇬🇷"
    }
  ],
  middleEast: [
    {
      name: "Levantine Arab",
      percentage: 0,
      description: "Arab populations of the Eastern Mediterranean coast",
      region: "Middle East",
      subgroups: ["Syrian", "Lebanese", "Palestinian", "Jordanian"],
      languages: ["Levantine Arabic"],
      flag: "🌿"
    },
    {
      name: "Persian / Iranian",
      percentage: 0,
      description: "Indo-European peoples with one of the world's oldest continuous civilizations",
      region: "Middle East",
      subgroups: ["Fars", "Azeri Iranian", "Kurdish"],
      languages: ["Farsi", "Kurdish", "Azeri"],
      flag: "🏺"
    },
    {
      name: "Phoenician / Canaanite",
      percentage: 0,
      description: "Ancient Semitic peoples who founded Mediterranean trade civilizations",
      region: "Middle East",
      subgroups: ["Lebanese", "Carthaginian descent"],
      languages: ["Arabic", "Aramaic heritage"],
      flag: "⚓"
    }
  ],
  westernEurope: [
    {
      name: "Celtic",
      percentage: 0,
      description: "Ancient Indo-European peoples who spread across much of Europe",
      region: "Western Europe",
      subgroups: ["Irish", "Scottish", "Welsh", "Breton", "Cornish"],
      languages: ["Irish Gaelic", "Scottish Gaelic", "Welsh", "Breton"],
      flag: "🍀"
    },
    {
      name: "Germanic",
      percentage: 0,
      description: "North European peoples including Anglo-Saxons, Franks and Normans",
      region: "Western Europe",
      subgroups: ["Anglo-Saxon", "Frankish", "Norman", "Flemish"],
      languages: ["English", "German", "Dutch", "Flemish"],
      flag: "🦅"
    },
    {
      name: "Gallic / French",
      percentage: 0,
      description: "Celtic and Latin mixed populations of ancient Gaul",
      region: "Western Europe",
      subgroups: ["Normand", "Breton", "Alsatian", "Occitan"],
      languages: ["French", "Occitan", "Alsatian"],
      flag: "🇫🇷"
    }
  ],
  easternEurope: [
    {
      name: "Slavic",
      percentage: 0,
      description: "The largest Indo-European ethnolinguistic group in Europe",
      region: "Eastern Europe",
      subgroups: ["Polish", "Ukrainian", "Russian", "Czech", "Slovak", "Serbian", "Croatian"],
      languages: ["Polish", "Ukrainian", "Russian", "Czech"],
      flag: "❄️"
    },
    {
      name: "Ashkenazi Jewish",
      percentage: 0,
      description: "Jewish diaspora communities with Central and Eastern European heritage",
      region: "Eastern Europe",
      subgroups: ["Polish Jewish", "Russian Jewish", "German Jewish"],
      languages: ["Yiddish", "Hebrew"],
      flag: "✡️"
    },
    {
      name: "Romani",
      percentage: 0,
      description: "Originally from Northwestern India, spread across Europe over centuries",
      region: "Eastern Europe / South Asia",
      subgroups: ["Sinti", "Vlax Romani", "Balkan Romani"],
      languages: ["Romani"],
      flag: "🎭"
    }
  ],
  subSaharanAfrica: [
    {
      name: "West African",
      percentage: 0,
      description: "Diverse group of peoples from the culturally rich West African region",
      region: "Sub-Saharan Africa",
      subgroups: ["Wolof", "Mandinka", "Fulani", "Ashanti", "Yoruba", "Igbo", "Hausa"],
      languages: ["Wolof", "Mandinka", "Fulfulde", "Twi", "Yoruba"],
      flag: "🥁"
    },
    {
      name: "Bantu",
      percentage: 0,
      description: "Large group of peoples sharing common linguistic and cultural heritage",
      region: "Central and Southern Africa",
      subgroups: ["Zulu", "Xhosa", "Shona", "Kikuyu", "Kongo"],
      languages: ["Swahili", "Zulu", "Xhosa", "Lingala"],
      flag: "🌍"
    }
  ],
  eastAsia: [
    {
      name: "Han Chinese",
      percentage: 0,
      description: "The world's largest ethnic group with over 5,000 years of continuous civilization",
      region: "East Asia",
      subgroups: ["Cantonese", "Mandarin", "Hokkien", "Hakka", "Shanghainese"],
      languages: ["Mandarin", "Cantonese", "Hokkien"],
      flag: "🇨🇳"
    },
    {
      name: "Japanese / Yamato",
      percentage: 0,
      description: "Island nation people with unique cultural and genetic heritage",
      region: "East Asia",
      subgroups: ["Yamato", "Ainu", "Ryukyuan"],
      languages: ["Japanese"],
      flag: "🇯🇵"
    },
    {
      name: "Korean",
      percentage: 0,
      description: "One of the most ethnically homogeneous peoples in the world",
      region: "East Asia",
      subgroups: ["North Korean", "South Korean", "Korean diaspora"],
      languages: ["Korean"],
      flag: "🇰🇷"
    }
  ],
  southAsia: [
    {
      name: "Indo-Aryan",
      percentage: 0,
      description: "Largest ethnolinguistic group in South Asia descended from ancient Aryan migrations",
      region: "South Asia",
      subgroups: ["Bengali", "Punjabi", "Gujarati", "Marathi", "Hindi-speaking"],
      languages: ["Hindi", "Bengali", "Punjabi", "Gujarati"],
      flag: "🇮🇳"
    },
    {
      name: "Dravidian",
      percentage: 0,
      description: "Indigenous peoples of South India with pre-Aryan heritage",
      region: "South Asia",
      subgroups: ["Tamil", "Telugu", "Kannada", "Malayalam"],
      languages: ["Tamil", "Telugu", "Kannada", "Malayalam"],
      flag: "🌺"
    }
  ]
};

export type EthnicGroupItem = typeof ETHNIC_GROUPS_BY_REGION[keyof typeof ETHNIC_GROUPS_BY_REGION][number];

export function getEthnicGroupsForRegions(regions: string[]): EthnicGroupItem[] {
  const result: EthnicGroupItem[] = [];
  const regionMap: Record<string, keyof typeof ETHNIC_GROUPS_BY_REGION> = {
    "North Africa": "northAfrica",
    "Southern Europe": "southernEurope",
    "Middle East": "middleEast",
    "Western Europe": "westernEurope",
    "Eastern Europe": "easternEurope",
    "Sub-Saharan Africa": "subSaharanAfrica",
    "East Asia": "eastAsia",
    "South Asia": "southAsia",
  };
  regions.forEach(region => {
    const key = regionMap[region];
    if (key && ETHNIC_GROUPS_BY_REGION[key]) {
      result.push(...ETHNIC_GROUPS_BY_REGION[key].slice(0, 2));
    }
  });
  return result;
}
