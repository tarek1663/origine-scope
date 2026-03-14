/** Fun facts about genetic / ancestral heritage per country — shown on analyze step 3 */
export const COUNTRY_FUN_FACTS: Record<string, string> = {
  Algeria: "🧬 Algeria has one of the highest concentrations of Berber genetic markers in the world.",
  France: "🧬 France shows remarkable genetic diversity from Celtic, Germanic and Mediterranean migrations.",
  Germany: "🧬 German ancestry reflects centuries of Germanic, Slavic and Celtic mixing in Central Europe.",
  Italy: "🧬 Italian genetics vary strongly by region — from Nordic influences in the north to Greek and North African in the south.",
  Spain: "🧬 Spain's gene pool carries Iberian, Celtic, Roman, Moorish and Jewish diaspora heritage.",
  "United Kingdom": "🧬 British DNA often blends Celtic, Anglo-Saxon, Norse and Norman ancestry.",
  Morocco: "🧬 Moroccan genetics combine Berber, Arab, Sub-Saharan and European influences.",
  Tunisia: "🧬 Tunisia sits at a genetic crossroads of Berber, Phoenician, Roman and Arab heritage.",
  Egypt: "🧬 Egyptian ancestry reflects ancient Nile civilizations, Arab expansion and Mediterranean trade.",
  Turkey: "🧬 Turkey has one of the world's most diverse genetic landscapes from centuries of migration.",
  Greece: "🧬 Greek DNA carries continuity from ancient Hellenic, Slavic and Mediterranean populations.",
  Poland: "🧬 Polish genetics show strong Slavic roots with Germanic and Jewish historical admixture.",
  Russia: "🧬 Russian ancestry spans Slavic, Finno-Ugric, Turkic and Caucasian genetic influences.",
  Ukraine: "🧬 Ukrainian genetics reflect Slavic, Steppe and Carpathian heritage.",
  Portugal: "🧬 Portuguese DNA blends Iberian, Celtic, Roman, Germanic and North African ancestry.",
  Netherlands: "🧬 Dutch genetics reflect Germanic, Frisian and historical trade-era diversity.",
  Ireland: "🧬 Irish ancestry is predominantly Celtic with Norse and Norman contributions.",
  Romania: "🧬 Romanian genetics combine Dacian, Roman, Slavic and Ottoman influences.",
  Lebanon: "🧬 Lebanon has exceptional diversity — Phoenician, Arab, Armenian and Mediterranean heritage.",
  Syria: "🧬 Syrian genetics reflect ancient Levantine, Arab and Armenian heritage.",
  Iran: "🧬 Iranian ancestry spans Persian, Turkic, Kurdish and ancient Mesopotamian roots.",
  India: "🧬 India has vast genetic diversity from Indo-Aryan, Dravidian and regional admixtures.",
  China: "🧬 Chinese genetics show strong regional variation from Han, Turkic and southern ethnic groups.",
  Japan: "🧬 Japanese ancestry is predominantly Yamato with Ainu and Ryukyuan contributions.",
  "South Korea": "🧬 Korean genetics are among the most homogeneous in East Asia.",
  Nigeria: "🧬 Nigerian ancestry is highly diverse across hundreds of ethnic groups and languages.",
  "South Africa": "🧬 South African genetics reflect Bantu, Khoisan, European and Asian heritage.",
  Ethiopia: "🧬 Ethiopia has unique genetic diversity from ancient Cushitic, Semitic and Nilotic populations.",
  "United States": "🧬 American ancestry is a mosaic of Indigenous, European, African and global diasporas.",
  Brazil: "🧬 Brazilian genetics blend Indigenous, Portuguese, African and global migration heritage.",
  Mexico: "🧬 Mexican ancestry combines Indigenous Mesoamerican, Spanish and other global influences.",
  Argentina: "🧬 Argentine genetics reflect strong European immigration plus Indigenous and other roots.",
};

export function getCountryFunFact(country: string): string | undefined {
  return COUNTRY_FUN_FACTS[country];
}
