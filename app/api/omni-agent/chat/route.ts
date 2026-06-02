import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    // 這是一個為了展示「圓通無礙」而實作的 Edge Streaming 模擬
    // 實務上這裡會呼叫 Google Gemini API 或 LangChain
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const responseText = `OmniAgent 收到指示：「${lastMessage}」。\n\n系統已啟動【無作妙德】協議，正在自主排程並呼叫對應的 Atomic Functions... \n[5T Protocol] 驗證通過，執行完畢。`;
        
        // 模擬串流打字效果
        for (let i = 0; i < responseText.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 30)); // 30ms delay per char
          controller.enqueue(encoder.encode(responseText[i]));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
