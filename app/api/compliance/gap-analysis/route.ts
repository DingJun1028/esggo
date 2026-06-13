import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { agnes } from '@/lib/ai/agnes';
import { createHash } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { matrix, tenant_id } = await req.json();

    const lowCompleteness = matrix.filter((n: any) => n.completeness < 70);
    const sealedCount = matrix.filter((n: any) => n.isSealed).length;
    
    // OmniAgent Swarm Prompt (ESG_Auditor & ESG_Consultant Persona)
    const prompt = `你現在是 OmniCore 治理矩陣中的雙核心代理：
[ESG_Auditor] 負責嚴謹的數據稽核與缺口分析。
[ESG_Consultant] 負責提出具體的改善計畫 (CAP)。

任務：執行「企業體檢 (Enterprise Health Check)」。
給定以下企業的 GRI 合規矩陣數據：
1. 總指標數：${matrix.length}，已完成封印 (5T Sealed)：${sealedCount} 項。
2. 高風險低完成度指標：${lowCompleteness.map((n: any) => `${n.code} (${n.completeness}%)`).join(', ') || '無'}

請分析並回傳嚴格的 JSON 格式 (不可包含 markdown 標籤或反引號，純 JSON)，包含：
{
  "score_e": <0-100的數值，代表環境面預估分數>,
  "score_s": <0-100的數值，代表社會面預估分數>,
  "score_g": <0-100的數值，代表治理面預估分數>,
  "gaps": [
    { "code": "指標代碼", "severity": "HIGH|MEDIUM|LOW", "issue": "缺口描述" }
  ],
  "advice": "請給出具體、專業的 5T 治理改善計畫 (CAP) 描述，約200字"
}`;

    const { text: rawJsonText } = await generateText({
      model: agnes('agnes-2.0-flash'),
      prompt: prompt,
      temperature: 0.1, // 低溫確保 JSON 輸出穩定
    });

    // Parse JSON safely
    let aiResult;
    try {
      const cleanJson = rawJsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      aiResult = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("OmniAgent JSON Parse Error:", rawJsonText);
      throw new Error("Failed to parse OmniAgent Swarm output.");
    }

    // 5T Trustworthy Protocol: Generate Hash Lock for the result
    const payloadForHash = JSON.stringify({
      timestamp: Date.now(),
      tenant_id,
      scores: { e: aiResult.score_e, s: aiResult.score_s, g: aiResult.score_g },
      gaps: aiResult.gaps,
      advice: aiResult.advice
    });
    const hash_lock = createHash('sha256').update(payloadForHash).digest('hex');

    return NextResponse.json({ 
      success: true, 
      data: {
        ...aiResult,
        hash_lock,
        status: 'Trustworthy'
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}