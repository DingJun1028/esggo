import os
import glob
import re

files_to_check = [
    "app/api/social/insights/route.ts",
    "app/api/omni-jules/route.ts",
    "app/api/omni-agent/chat/route.ts",
    "app/api/environmental/insights/route.ts",
    "app/api/compliance/gap-analysis/route.ts",
    "app/api/governance/insights/route.ts",
    "app/api/ai/stream/route.ts",
    "app/api/ai/expand/route.ts",
    "app/api/ai/generate/route.ts",
    "app/api/agent/memory-shards/extract-logs/route.ts",
]

fetch_template = """
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
"""

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content
    
    # 1. Replace streamText with ai-sdk/openai
    if "import { createGoogleGenerativeAI } from '@ai-sdk/google'" in content:
        content = content.replace("import { createGoogleGenerativeAI } from '@ai-sdk/google'", "import { createOpenAI } from '@ai-sdk/openai'")
        content = re.sub(r"const\s+google\s*=\s*createGoogleGenerativeAI\(\{.*?\}\);", "const agnes = createOpenAI({ baseURL: 'https://apihub.agnes-ai.com/v1', apiKey: process.env.AGNES_API || process.env.AGNES_API_KEY });", content, flags=re.DOTALL)
        content = content.replace("google('gemini-1.5-pro')", "agnes('agnes-2.0-flash')")
        content = content.replace("google('gemini-2.0-flash')", "agnes('agnes-2.0-flash')")
        content = content.replace("createGoogleGenerativeAI", "createOpenAI")
        content = content.replace("GEMINI_API_KEY", "AGNES_API")
    
    # 2. Replace raw fetch calls
    if "generativelanguage.googleapis.com" in content:
        content = re.sub(r"const\s+GEMINI_API_KEY\s*=.*?(?=return\s+NextResponse)", fetch_template, content, flags=re.DOTALL)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for f in files_to_check:
    process_file(f)
