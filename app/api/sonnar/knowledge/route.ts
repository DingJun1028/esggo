import { NextRequest } from 'next/server';
import { jsonError, jsonResponse } from '@/lib/api-utils';

function analyzeContext(context: string): { why: string; what: string; how: string; tags: string[] } {
  const lower = context.toLowerCase();

  if (lower.includes('energy') || lower.includes('kwh') || lower.includes('electric')) {
    return {
      why: '能源使用數據是碳足跡盤查的核心輸入，直接影響範疇二排放計算。',
      what: '此單據包含用電量、費率與計費期間，可用於計算組織型碳足跡。',
      how: '建議將此數據與台電帳單交叉比對，並導入能源管理系統(EMS)以自動化蒐集。',
      tags: ['Energy', 'Scope2', 'EMS'],
    };
  }

  if (lower.includes('water') || lower.includes('m3')) {
    return {
      why: '水資源使用是環境面(GRI 303)與CDP水安全問卷的重要揭露項目。',
      what: '單據內含取水量、排水量與水質檢測數據。',
      how: '建議建立水資源平衡表，並評估製程節水機會(目標減量10-15%)。',
      tags: ['Water', 'GRI303', 'CDP'],
    };
  }

  if (lower.includes('waste') || lower.includes('recycl')) {
    return {
      why: '廢棄物管理(範疇三)是循環經濟與零廢棄目標的關鍵指標。',
      what: '此單據記錄了廢棄物種類、數量與處理方式(焚化/掩埋/回收)。',
      how: '建議推動源頭減量與分類回收，目標達成90%以上回收率。',
      tags: ['Waste', 'CircularEconomy', 'Scope3'],
    };
  }

  if (lower.includes('emission') || lower.includes('carbon') || lower.includes('ghg')) {
    return {
      why: '碳排放數據是ESG評級(RBA、DJSI、MSCI)的核心評分指標。',
      what: '單據包含組織型碳盤查(ISO 14064-1)的排放係數與活動數據。',
      how: '建議採用科學基礎減量目標(SBTi)，並定期進行第三方查證。',
      tags: ['Carbon', 'SBTi', 'ISO14064'],
    };
  }

  return {
    why: '此單據為ESG資料蒐集流程的一部分，需確認其完整性與正確性。',
    what: '擷取了原始單據中的關鍵數據欄位與時間戳記。',
    how: '建議將此資料輸入ESG管理平台，並設定自動化資料品質檢查規則。',
    tags: ['General', 'DataQuality'],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const context: string = body.context || body.text || '';

    const result = analyzeContext(context);

    return jsonResponse(result);
  } catch (err) {
    console.error('[Sonar Knowledge] Error:', err);
    return jsonError('INTERNAL_ERROR', 'Invalid request');
  }
}
