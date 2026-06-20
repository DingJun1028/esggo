// @ts-nocheck
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_OPENROUTER_MODEL = 'mistralai/mistral-small-3.1-24b:free';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getModel() {
  if (process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAI({
      baseURL: OPENROUTER_BASE_URL,
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return openrouter(process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL);
  }
  return null;
}

// POST /api/omni-agent/notes — 筆記整理
// 將聊天記錄整理成結構化筆記，存入 Supabase
export async function POST(req: Request) {
  try {
    const { messages, title } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: messages (non-empty array)' },
        { status: 400 }
      );
    }

    const model = getModel();
    if (!model) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Format messages for the AI
    const conversationText = messages
      .map((m: any) => `${m.role === 'user' ? '使用者' : 'AI'}: ${m.content}`)
      .join('\n');

    const result = await generateText({
      model,
      system: `你是 OmniAgent 的筆記整理專家。將以下對話整理成結構化筆記。

輸出格式（JSON）：
{
  "title": "筆記標題",
  "summary": "簡短摘要（100字以內）",
  "keyPoints": ["重點1", "重點2", "重點3"],
  "content": "完整筆記內容（Markdown格式）",
  "tags": ["標籤1", "標籤2"],
  "category": "分類（ESG數據/報告撰寫/合規檢查/系統操作/一般查詢）"
}

用繁體中文回答，只輸出 JSON，不要其他文字。`,
      prompt: `對話記錄：\n${conversationText}\n\n${title ? `建議標題：${title}\n` : ''}請整理成結構化筆記。`,
      maxTokens: 2000,
    });

    // Parse AI response
    let noteData;
    try {
      const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      noteData = JSON.parse(cleaned);
    } catch {
      // Fallback: use raw text as content
      noteData = {
        title: title || '未命名筆記',
        summary: result.text.substring(0, 100),
        keyPoints: [],
        content: result.text,
        tags: [],
        category: '一般查詢',
      };
    }

    // Save to Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { data: inserted, error: dbError } = await supabase
        .from('notes')
        .insert({
          title: noteData.title || title || '未命名筆記',
          summary: noteData.summary || '',
          key_points: noteData.keyPoints || [],
          content: noteData.content || result.text,
          tags: noteData.tags || [],
          category: noteData.category || '一般查詢',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        // Return the note data even if DB save fails
        return NextResponse.json({
          noteId: null,
          ...noteData,
          warning: `Note generated but not saved to database: ${dbError.message}`,
        });
      }

      return NextResponse.json({
        noteId: inserted.id,
        ...noteData,
      });
    }

    // No Supabase configured, return generated note
    return NextResponse.json({
      noteId: null,
      ...noteData,
      warning: 'Supabase not configured. Note generated but not persisted.',
    });
  } catch (error: any) {
    console.error('Notes creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/omni-agent/notes — 筆記列表
export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('notes')
      .select('id, title, summary, tags, category, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json(
        { error: `Failed to fetch notes: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      notes: data || [],
      total: data?.length || 0,
    });
  } catch (error: any) {
    console.error('Notes list error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
