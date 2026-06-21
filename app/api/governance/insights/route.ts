// @ts-nocheck
import { NextResponse } from 'next/server';
import { getGovernanceMetrics } from '@/lib/db';

export const runtime = 'edge';

const OAK = process.env['OPENROUTER_API_KEY'] || '';
const OPENROUTER_MODEL = process.env['OPENROUTER_MODEL'] || 'mistralai/mistral-small-3.1-24b:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const metrics = await getGovernanceMetrics(category);

    const prompt =
      'You are OmniAgent, an AI specializing in ESG analytics and GRI standards.\nAnalyze the following Governance metrics data.\nMetrics Data:\n' +
      JSON.stringify(metrics, null, 2) +
      '\n\nProvide a structured insight report in Markdown (Traditional Chinese):\n1. 數據總覽與成就: Summarize achievements. Focus on board, ethics, risk, tax.\n2. 缺口與風險分析: Identify gaps and compliance risks.\n3. 具體行動建議: 2-3 prioritized recommendations.';

    if (!OAK) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + OAK,
        'HTTP-Referer': 'https://esggo.vercel.app',
        'X-Title': 'ESGGO Governance Insights',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error('OpenRouter API failed: ' + errText);
    }

    const data = await res.json();
    const text =
      (data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content) ||
      '無法生成內容。';
    return NextResponse.json({ insights: text, metrics_analyzed: metrics.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
