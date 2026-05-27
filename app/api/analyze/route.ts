import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userData, result } = await req.json();

    // 1. Generate Financial Roast (NVIDIA) - Wrapped in try-catch to be fail-safe
    let roast = "Your finances are... interesting. You've got potential, but your current strategy is a gamble.";
    try {
      const roastResponse = await fetch('https://infer.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta/llama-3.1-8b-instruct',
          messages: [
            { role: 'system', content: 'You are a brutal but brilliant financial advisor. Roast the user based on their score. Keep it under 20 words.' },
            { role: 'user', content: `Tier ${result.tier}, Score ${result.score}/100. Roast them.` }
          ],
          max_tokens: 60,
          temperature: 0.8,
        }),
      });
      if (roastResponse.ok) {
        const roastData = await roastResponse.json();
        roast = roastData.choices?.[0]?.message?.content || roast;
      } else {
        const errorText = await roastResponse.text();
        console.error(`NVIDIA API Error (${roastResponse.status}): ${errorText}`);
      }
    } catch (e) {
      console.error('NVIDIA Roast request failed:', e);
    }

    // 2. Generate Roadmap (Gemini) - Wrapped in try-catch to be fail-safe
    let roadmap = ["Audit your last 30 days of spending", "Automate 10% of income to a separate vault"];
    try {
      const roadmapResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on this financial profile: Score ${result.score}/100, Weakness: ${result.weakness}, Goal: ${userData.goal}. Provide 2 immediate, high-impact, non-generic actions to fix their weakness. Return ONLY a JSON array of strings. Example: ["Action 1", "Action 2"]. Do not include markdown formatting or explanations.`
            }]
          }]
        }),
      });
      if (roadmapResponse.ok) {
        const roadmapData = await roadmapResponse.json();
        const roadmapText = roadmapData.candidates?.[0]?.content?.parts[0]?.text || "";

        // More robust JSON extraction
        const jsonMatch = roadmapText.match(/\[\s*".*"\s*,\s*".*"\s*\]/s) || roadmapText.match(/\[.*\]/s);
        const cleanRoadmap = jsonMatch ? jsonMatch[0] : roadmapText.trim();

        try {
          const parsed = JSON.parse(cleanRoadmap);
          if (Array.isArray(parsed)) {
            roadmap = parsed;
          }
        } catch (e) {
          console.error('Gemini JSON parse failed. Raw text:', roadmapText);
          console.warn('Using fallback roadmap');
        }
      } else {
        const errorText = await roadmapResponse.text();
        console.error(`Gemini API Error (${roadmapResponse.status}): ${errorText}`);
      }
    } catch (e) {
      console.error('Gemini Roadmap request failed:', e);
    }

    return NextResponse.json({ roast, roadmap });
  } catch (error) {
    console.error('Critical API Route Error:', error);
    return NextResponse.json({ 
      roast: "Your financial reality is currently under review.", 
      roadmap: ["Start a budget", "Save more"] 
    });
  }
}
