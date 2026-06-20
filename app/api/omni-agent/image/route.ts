// @ts-nocheck
import { NextResponse } from 'next/server';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// POST /api/omni-agent/image — 圖片生成
// 接收 { prompt: "描述" }，使用 OpenRouter 免費圖片模型
export async function POST(req: Request) {
  try {
    const { prompt, model, width = 512, height = 512 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing required field: prompt' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.AGNES_API;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
    }

    const imageModel = model || 'stabilityai/stable-diffusion-3.5-large';

    const response = await fetch(`${OPENROUTER_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'ESGGO OmniAgent',
      },
      body: JSON.stringify({
        model: imageModel,
        prompt,
        n: 1,
        size: `${width}x${height}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter image API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Image generation failed: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response formats
    let imageUrl = '';
    if (data.data && data.data[0]) {
      imageUrl =
        data.data[0].url || data.data[0].b64_json
          ? `data:image/png;base64,${data.data[0].b64_json}`
          : data.data[0].url;
    } else if (data.images && data.images[0]) {
      imageUrl = data.images[0].url || data.images[0];
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image returned from the model', raw: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl,
      model: imageModel,
      prompt,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
