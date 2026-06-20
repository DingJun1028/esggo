import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { answers, companyId = 'default' } = await request.json();

    if (!answers) {
      return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
    }

    // Calculate score
    const total = Object.values(answers).reduce((acc: number, val: any) => acc + Number(val), 0);
    // 15 questions, max 3 each = 45
    const score = Math.round((total / 45) * 100);

    // Provide dynamic AI-based (mocked for now) roadmap
    // In a real scenario, this would call OmniAgent or Genkit
    const roadmap = {
      score,
      level: score >= 80 ? '領先群標竿' : score >= 60 ? '穩健發展中' : '起步奠基期',
      findings: {
        strengths: score >= 60 ? '社會參與 (S) 與員工福利政策完善。已具備基本的治理結構基礎。' : '基礎的法規遵循尚可，但缺乏進階的永續作為。',
        weaknesses: score < 80 ? '缺乏系統化的溫室氣體盤查數據，數據收集仍依賴人工，有高度合規風險。' : '在範疇三碳盤查與供應商議合上仍有進步空間。',
      },
      actionPlan: [
        {
          month: 1,
          title: '啟動數位盤查與框架對齊',
          tasks: [
            '導入 ESGGO 數據中心，完成年度 ISO 14064-1 組織邊界設定。',
            '召開董事會永續委員會，確立年度減碳目標 (如 5% 減量)。'
          ]
        },
        {
          month: 2,
          title: '供應鏈與社會面強化',
          tasks: [
            '建立供應商 ESG 稽核表單與評鑑機制，發送首波問卷。',
            '完成內部人權盡職調查初步風險鑑別。'
          ]
        },
        {
          month: 3,
          title: '報告書編製與 5T 驗證',
          tasks: [
            '將盤查與社會面數據寫入區塊鏈 Hash Lock (5T 誠信協議)。',
            '啟動永續報告書第三方查證作業。'
          ]
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: roadmap,
      metadata: {
        timestamp: Date.now(),
        trustScore: 0.95,
        source: 'OmniAgent-HealthCheck',
        hashLock: `0x${Math.random().toString(16).substr(2, 14)}`
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
