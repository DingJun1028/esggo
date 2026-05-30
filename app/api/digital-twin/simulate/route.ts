import { NextResponse } from 'next/server';
import { digitalTwinEngine } from '@/lib/digital-twin-engine';
import { ncbClient } from '@/lib/ncbdb';

export async function POST(request: Request) {
  try {
    const { scenarioId, parameters } = await request.json();

    // 1. 從 NCBDB 獲取真實基線數據 (若無 Token，NCBDBClient 會回傳 fallback)
    const ncbResponse = await ncbClient.listRecords<any>('BaselineEmissions');
    
    // 設定基線數據
    let baseline = { carbonEmissions: 12000, energyUsage: 350000, waterUsage: 5000, wasteGenerated: 1200 };
    if (ncbResponse.success && ncbResponse.data && ncbResponse.data.length > 0) {
      // 假設資料表內有對應的欄位，覆蓋預設值
      const realData = ncbResponse.data[0];
      baseline = {
        carbonEmissions: realData.carbonEmissions || baseline.carbonEmissions,
        energyUsage: realData.energyUsage || baseline.energyUsage,
        waterUsage: realData.waterUsage || baseline.waterUsage,
        wasteGenerated: realData.wasteGenerated || baseline.wasteGenerated
      };
    }

    // 2. 將前端送來的環境參數 (DNA Parameters) 轉換為引擎可讀的 modifiers
    const reduction = (parameters.greenEnergy * 0.5) + (parameters.supplyChainLocal * 0.2);
    
    const scenarioPayload = {
      id: scenarioId,
      name: `Scenario ${scenarioId}`,
      modifiers: [
        {
          targetField: 'carbonEmissions' as const,
          valueChange: -(reduction / 100)
        },
        {
          targetField: 'energyUsage' as const,
          valueChange: -((parameters.greenEnergy * 0.3) / 100)
        }
      ]
    };

    // 3. 執行推演引擎
    const result = await digitalTwinEngine.simulate(scenarioPayload, baseline);

    // 4. 計算 GRI 302-1 合規性 (附加在引擎結果中，或由引擎本身處理)
    const isGriValid = parameters.greenEnergy >= 20;
    result.complianceProjections['GRI 302-1'] = {
      isValid: isGriValid,
      score: Math.min(99, 50 + parameters.greenEnergy * 2),
      violations: isGriValid ? [] : ['再生能源佔比未達 20% 綠電門檻安全線'],
      recommendations: isGriValid ? [] : ['增加綠電採購比例至 20% 以上']
    };
    
    // 更新碳排的得分，讓它跟前端原本的邏輯一致 (測試用途)
    result.complianceProjections['carbonEmissions'] = {
      ...result.complianceProjections['carbonEmissions'],
      score: Math.min(99, 82 + reduction),
      violations: [],
      recommendations: []
    };

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[Digital Twin API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
