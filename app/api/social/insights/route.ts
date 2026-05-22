import { NextRequest, NextResponse } from 'next/server';
import { ai as genkitInstance } from '@/lib/agents/genkit';
import { getSocialMetrics } from '@/lib/db';

// Ensure this runs as an Edge Function
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    // Fetch the metrics dynamically (this hits Supabase or mock)
    const metrics = await getSocialMetrics(category);

    const prompt = `
You are Hermes AI, an expert in ESG (Environmental, Social, and Governance) analytics and GRI standards.
Analyze the following Social Impact (共榮普惠) metrics and provide 3 key actionable insights.
Focus on diversity, occupational safety, training, supply chain, community, and human rights.

Metrics Data:
${JSON.stringify(metrics, null, 2)}

Provide your response in a structured, professional tone using Markdown format. 
Make sure the insights highlight achievements and point out areas needing improvement.
Use Traditional Chinese (zh-TW).
    `;

    // Attempt to use Genkit instance, fallback to direct fetch if Genkit is misconfigured in Edge
    try {
      const { gemini15Flash } = require('@genkit-ai/googleai');
      const response = await genkitInstance.generate({
        model: gemini15Flash,
        prompt: prompt,
        config: { temperature: 0.3 }
      });
      return NextResponse.json({ insights: response.text, metrics_analyzed: metrics.length });
    } catch (genkitError) {
      console.warn('Genkit failed in Edge runtime, falling back to direct API call.', genkitError);
      
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

      if (!geminiRes.ok) throw new Error('Fallback API failed');
      const data = await geminiRes.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '無法生成洞察報告。';
      
      return NextResponse.json({ insights: text, metrics_analyzed: metrics.length });
    }
  } catch (error: any) {
    console.error('Social Insights API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
