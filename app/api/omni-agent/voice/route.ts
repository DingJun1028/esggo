// @ts-nocheck
import { NextResponse } from 'next/server';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// POST /api/omni-agent/voice — 語音辨識
// 接收 audio blob (base64)，使用 OpenRouter 免費語音模型轉文字
export async function POST(req: Request) {
  try {
    const { audio, language = 'zh' } = await req.json();

    if (!audio) {
      return NextResponse.json(
        { error: 'Missing required field: audio (base64 encoded)' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.AGNES_API;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
    }

    // Decode base64 audio to Buffer (handle data:audio/webm;base64, prefix)
    const base64Data = audio.startsWith('data:') ? audio.split(',')[1] : audio;
    const audioBuffer = Buffer.from(base64Data, 'base64');

    // Build multipart form data
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'openai/whisper-large-v3');
    if (language) {
      formData.append('language', language);
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'ESGGO OmniAgent',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter voice API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Voice recognition failed: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      text: data.text || '',
      language: data.language || language,
    });
  } catch (error: any) {
    console.error('Voice recognition error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
