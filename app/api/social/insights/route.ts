
import { NextRequest, NextResponse } from 'next/server';
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
You are OmniAgent, an advanced AI specializing in ESG (Environmental, Social, and Governance) analytics, GRI standards, and 5T audit protocols.
Analyze the following Social Impact (共榮普惠) metrics data.

Metrics Data:
${JSON.stringify(metrics, null, 2)}

Your task is to provide a highly structured, actionable insight report in Markdown format.
Please include the following sections:
1. **數據總覽與成就 (Executive Summary)**: Briefly summarize the current state and highlight any verified achievements. Focus on diversity, occupational safety, training, supply chain, community, and human rights.
2. **缺口與風險分析 (Gap & Risk Analysis)**: Identify any missing data (partial data gaps), anomalies, or unverified metrics that could pose a compliance risk (e.g., missing GRI coverage).
3. **具體行動建議 (Actionable Steps)**: Provide 2-3 concrete, prioritized recommendations for the ESG team to fill data gaps or improve metrics.

Guidelines:
- Maintain a highly professional, authoritative tone.
- If data is sparse or completely missing, emphasize the immediate need for data collection and 5T verification to ensure compliance.
- Use Traditional Chinese (zh-TW).
    `;

    // Edge runtime doesn't support dynamic require() well, using standard fetch API
    
    const AGNES_API_KEY = process.env.AGNES_API || process.env.AGNES_API_KEY;
    if (!AGNES_API_KEY) throw new Error('Agnes API Key missing');

    const agnesRes = await fetch(`https://apihub.agnes-ai.com/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      })
    });

    if (!agnesRes.ok) {
      const errData = await agnesRes.text();
      console.error('Agnes API failed:', errData);
      throw new Error('Agnes API failed');
    }
    const data = await agnesRes.json();
    const text = data.choices?.[0]?.message?.content || '無法生成內容。';
return NextResponse.json({ insights: text, metrics_analyzed: metrics.length });
  } catch (error: any) {
    console.error('Social Insights API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
