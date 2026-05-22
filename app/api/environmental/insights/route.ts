import { NextRequest, NextResponse } from 'next/server';
import { getEnvironmentalData } from '@/lib/db';

// Ensure this runs as an Edge Function
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    // Fetch the metrics dynamically (this hits Supabase or mock)
    const metrics = await getEnvironmentalData(category as any);

    const prompt = `
You are OmniHermes, an advanced AI specializing in ESG (Environmental, Social, and Governance) analytics, ISO 14064 GHG standards, and 5T audit protocols.
Analyze the following Environmental (環境保護) metrics data.

Metrics Data:
${JSON.stringify(metrics, null, 2)}

Your task is to provide a highly structured, actionable insight report in Markdown format.
Please include the following sections:
1. **數據總覽與成就 (Executive Summary)**: Briefly summarize the current state and highlight any verified achievements. Focus on carbon emissions, energy usage, water consumption, waste management, and CBAM compliance.
2. **缺口與風險分析 (Gap & Risk Analysis)**: Identify any missing data (partial data gaps), anomalies, or unverified metrics that could pose a compliance risk.
3. **具體行動建議 (Actionable Steps)**: Provide 2-3 concrete, prioritized recommendations for the ESG team to fill data gaps or improve metrics.

Guidelines:
- Maintain a highly professional, authoritative tone.
- If data is sparse or completely missing, emphasize the immediate need for data collection and 5T verification to ensure compliance.
- Use Traditional Chinese (zh-TW).
    `;

    // Edge runtime doesn't support dynamic require() well, using standard fetch API
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!GEMINI_API_KEY) throw new Error('API Key missing');

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.text();
      console.error('Gemini API failed:', errData);
      throw new Error('Gemini API failed');
    }
    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '無法生成洞察報告。';
    
    return NextResponse.json({ insights: text, metrics_analyzed: metrics.length });
  } catch (error: any) {
    console.error('Environmental Insights API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
