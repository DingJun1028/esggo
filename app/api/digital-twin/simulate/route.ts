import { NextResponse } from 'next/server';
import { digitalTwinEngine } from '@/lib/digital-twin-engine';
import { ncbClient } from '@/lib/ncbdb';
import { createClient } from '@supabase/supabase-js';
import { generateHashLock } from '@/lib/hash-lock';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const { scenarioId, parameters } = await request.json();
    const authHeader = request.headers.get('Authorization');
    
    let token = '';
    let companyId = 'default';
    let userId = 'anonymous';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        companyId = payload.app_metadata?.company_id || 'default';
        userId = payload.sub || 'anonymous';
      } catch (e) {
        console.warn('Failed to parse JWT payload', e);
      }
    }

    // 建立帶有 User Token 的 Supabase Client，強制套用 RLS
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // 1. 從 NCBDB 獲取真實基線數據 (若無 Token，NCBDBClient 會回傳 fallback)
    const ncbResponse = await ncbClient.listRecords<any>('BaselineEmissions');
    
    // 設定基線數據
    let baseline = { carbonEmissions: 12000, energyUsage: 350000, waterUsage: 5000, wasteGenerated: 1200 };
    if (ncbResponse.success && ncbResponse.data && ncbResponse.data.length > 0) {
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

    // 4. 計算合規性
    const isGriValid = parameters.greenEnergy >= 20;
    result.complianceProjections['GRI 302-1'] = {
      isValid: isGriValid,
      score: Math.min(99, 50 + parameters.greenEnergy * 2),
      violations: isGriValid ? [] : ['再生能源佔比未達 20% 綠電門檻安全線'],
      recommendations: isGriValid ? [] : ['增加綠電採購比例至 20% 以上']
    };
    
    result.complianceProjections['carbonEmissions'] = {
      ...result.complianceProjections['carbonEmissions'],
      score: Math.min(99, 82 + reduction),
      violations: [],
      recommendations: []
    };

    // 5. ZKP Hash Lock 與 Audit Log 寫入 (T3 Trackable & T5 Trustworthy)
    if (token) {
      const auditPayload = {
        company_id: companyId,
        action: 'DIGITAL_TWIN_SIMULATE',
        resource: `scenario_${scenarioId}`,
        user_name: userId,
        department: 'System',
        t5_tag: 'Trustworthy',
        details: JSON.stringify({ parameters }),
        created_at: new Date().toISOString()
      };
      
      const { hash } = generateHashLock(auditPayload);
      
      const { error: auditError } = await supabase.from('audit_logs').insert([{
        ...auditPayload,
        hash_lock: hash
      }]);
      
      if (auditError) {
        console.error('[Audit Log] Failed to insert:', auditError.message);
      }
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[Digital Twin API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
