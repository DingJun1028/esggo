import { NextRequest, NextResponse } from 'next/server';
import { getGovernanceMetrics } from '@/lib/db';

// Ensure this runs as an Edge Function
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    // Fetch the metrics dynamically (this hits Supabase or mock)
    const metrics = await getGovernanceMetrics(category);

    const prompt = `
You are Hermes AI, an expert in ESG (Environmental, Social, and Governance) analytics and corporate governance standards.
Analyze the following Governance (公司治理) metrics and provide 3 key actionable insights.
Focus on board diversity, ethical guidelines, risk management, data privacy, and executive compensation.

Metrics Data:
${JSON.stringify(metrics, null, 2)}

Provide your response in a structured, professional tone using Markdown format. 
Make sure the insights highlight achievements and point out areas needing improvement.
Use Traditional Chinese (zh-TW).
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
    console.error('Governance Insights API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
