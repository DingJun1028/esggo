# 🌌 Supabase Edge Functions Implementation Guide

## 📁 檔案結構

```
supabase/
├── functions/
│   ├── learn/
│   │   └── index.ts
│   ├── manifest/
│   │   └── index.ts
│   ├── interact/
│   │   └── index.ts
│   ├── execute-skill/
│   │   └── index.ts
│   ├── swarm/
│   │   └── index.ts
│   └── _shared/
│       ├── cors.ts
│       ├── gemini.ts
│       └── types.ts
└── config.toml
```

## 🔧 共用模組

### functions/_shared/cors.ts
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}
```

### functions/_shared/types.ts
```typescript
export interface KnowledgeChunk {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  system_prompt: Record<string, any>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
```

### functions/_shared/gemini.ts
```typescript
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'embedding-001' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateResponse(messages: ChatMessage[], systemPrompt?: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const chat = model.startChat({ history: messages });
  const result = await chat.sendMessage(systemPrompt || 'Hello');
  return result.response.text();
}
```

## 🎯 Edge Functions 實現

### functions/learn/index.ts (知識注入)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { generateEmbedding } from '../_shared/gemini.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { text, kbId = 'default', source, payload } = await req.json();

    console.log(`[LEARN] Processing: ${text.substring(0, 50)}...`);

    // 生成向量嵌入
    const embedding = await generateEmbedding(text);

    // 將向量轉為PostgreSQL格式
    const embeddingStr = `[${embedding.join(',')}]`;

    const { error } = await supabase
      .from('knowledge_chunks')
      .insert({
        content: text,
        embedding: embeddingStr,
        metadata: { source, kbId, payload }
      });

    if (error) throw error;

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[LEARN] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

### functions/manifest/index.ts (Session初始化)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCors, corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // 簡單實現：返回固定Session ID
  // 完整版可以查詢agents表
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return new Response(JSON.stringify({ sessionId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

### functions/interact/index.ts (對話串流)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { generateEmbedding, generateResponse } from '../_shared/gemini.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const message = url.searchParams.get('message');

    if (!message) {
      return new Response('Message parameter required', { status: 400, headers: corsHeaders });
    }

    // RAG: 搜尋相關知識
    const embedding = await generateEmbedding(message);
    const embeddingStr = `[${embedding.join(',')}]`;

    const { data: chunks } = await supabase.rpc('match_chunks', {
      query_embedding: embeddingStr,
      match_threshold: 0.1,
      match_count: 3
    });

    const context = chunks?.map((c: any) => c.content).join('\n---\n') || '';

    // 建構系統提示
    const systemPrompt = `Context from knowledge base:\n${context}\n\nUser: ${message}`;

    // 生成回應
    const response = await generateResponse([], systemPrompt);

    return new Response(`data: ${JSON.stringify({ type: 'text', content: response })}\n\ndata: [DONE]\n\n`, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('[INTERACT] Error:', error);
    return new Response(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream'
      }
    });
  }
});
```

### functions/execute-skill/index.ts (技能執行)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { skill } = await req.json();

    // 這裡可以整合外部Redis或直接執行簡單技能
    // 對於複雜技能，可以調用外部Worker
    console.log(`[SKILL] Executing: ${skill.name}`);

    let result = 'Skill executed successfully';

    // Mock 技能執行邏輯
    if (skill.name === 'GoogleSearch') {
      result = `[SEARCH RESULT] Mock search for: ${skill.params?.query || 'unknown'}`;
    }

    return new Response(JSON.stringify({ status: 'success', result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[SKILL] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

### functions/swarm/index.ts (蜂巢任務)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { generateResponse } from '../_shared/gemini.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    // PM 階段
    const pmPrompt = `As a Tech Lead, break down this task: "${prompt}". Return JSON: {"files": [{"path": "example.js", "desc": "description"}]}`;
    const pmResponse = await generateResponse([], pmPrompt);
    const plan = JSON.parse(pmResponse.replace(/```json|```/g, ''));

    let output = `[SWARM REPORT]\nPlan: ${plan.files?.length || 0} files\n\n`;

    // 簡單實現：只生成一個檔案
    if (plan.files && plan.files.length > 0) {
      const file = plan.files[0];
      const codePrompt = `Write complete code for: ${file.path}\nDescription: ${file.desc}`;
      const code = await generateResponse([], codePrompt);
      output += `### FILE: ${file.path}\n${code}\n\n`;
    }

    return new Response(JSON.stringify({ status: 'success', result: output }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[SWARM] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

## 📋 部署步驟

1. 安裝Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. 初始化專案:
   ```bash
   supabase init
   ```

3. 部署函數:
   ```bash
   supabase functions deploy
   ```

4. 設定環境變數:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_key_here
   ```

5. 測試函數:
   ```bash
   supabase functions serve
   ```

這樣，您就有了一個完全雲端化的萬能智庫系統！