// ============================================================
// 筆記摘要 API - POST
// ============================================================

import { NextRequest } from 'next/server';
import { jsonResponse, jsonError } from '@/lib/api-utils';
import { getNCBClient } from '@/lib/ncb-client';
import type { SummaryOptions } from '@/types/notes';

// POST /api/ai-notes/[id]/summarize - 生成摘要
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { style, maxLength, focus } = body;

    if (!id) {
      return jsonError('INVALID_PARAMS', 'Note ID is required', 400);
    }

    const ncb = getNCBClient();
    const note = await ncb.getNote(id);

    // 生成摘要
    const summaryOptions: SummaryOptions = {
      style: style || 'brief',
      maxLength,
      focus,
    };

    const summary = await generateSummary(note.content, summaryOptions);

    // 更新筆記的摘要欄位
    await ncb.updateNote(id, { summary });

    return jsonResponse({
      note_id: id,
      summary,
      style: summaryOptions.style,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return jsonError('INTERNAL_ERROR', 'Failed to generate summary', 500);
  }
}

// 生成摘要
async function generateSummary(
  content: string,
  options: SummaryOptions
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }

  const prompts: Record<string, string> = {
    brief: `用 2-3 句話總結以下內容：\n\n${content}`,
    detailed: `提供以下內容的詳細摘要，包含主要觀點和支持細節：\n\n${content}`,
    bullet_points: `用要點列出以下內容的關鍵訊息：\n\n${content}`,
    action_items: `從以下內容提取所有行動項和待辦事項：\n\n${content}`,
  };

  const prompt = prompts[options.style] || prompts.brief;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一個專業的摘要助手，擅長提取關鍵訊息並生成簡潔的摘要。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: options.maxLength || 500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
