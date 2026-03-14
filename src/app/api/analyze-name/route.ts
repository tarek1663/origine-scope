import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { lastName, firstName, fatherCountry, motherCountry } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a genealogy and etymology expert. Analyze the last name "${lastName}" combined with family origins from ${fatherCountry} and ${motherCountry}.

Return ONLY a valid JSON object with absolutely no other text, no markdown, no backticks, no explanation. Just the raw JSON.

{
  "originRegion": "primary geographic region of origin",
  "language": "language family this name comes from",
  "firstRecordedYear": "approximate year like ~800 AD",
  "firstRecordedPlace": "specific real place name where first recorded",
  "spreadYear": "approximate year the name spread like ~1200 AD",
  "spreadPlace": "real place the name spread to",
  "migrationDestination1": "real place name for ~1600 AD migration",
  "migrationDestination2": "real place name for ~1900 AD modern presence",
  "meaning": "literal meaning of the name in 3-6 words",
  "migrationRoute": "brief real migration route in 5-8 words",
  "estimatedCarriers": "estimated number worldwide like 45,000 or 2.3 million",
  "historyParagraph": "three sentences about the REAL history of this specific last name, factual and accurate",
  "notableAncestors": ["Real historical figure 1 sharing this surname or origin", "Real historical figure 2", "Real historical figure 3"],
  "culturalTraits": ["trait 1 based on origin culture", "trait 2", "trait 3", "trait 4", "trait 5"],
  "ethnicGroups": ["primary ethnic group", "secondary ethnic group"],
  "rarityScore": 73
}`
          }
        ]
      }),
    });

    const data = await response.json();

    if (!data.content || !data.content[0]) {
      return NextResponse.json({ error: 'No response from Claude' }, { status: 500 });
    }

    const text = data.content[0].text.trim();

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Name analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
