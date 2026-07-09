import { NextRequest } from 'next/server';
import { jsonError, jsonResponse } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fileName: string = body.fileName || 'document';
    const bufferSize: number = body.bufferSize || 0;

    const confidence = 0.85 + Math.random() * 0.14;

    const text = `[模擬 OCR] 檔案: ${fileName} (${bufferSize} bytes)\n`
      + '--- 擷取內容 ---\n'
      + '能源使用量: XXX kWh\n'
      + '碳排放量: YYY tCO2e\n'
      + '水資源使用: ZZZ m3\n'
      + '--- 結束 ---\n';

    return jsonResponse({
      text,
      confidence: Math.round(confidence * 100) / 100,
      dataAtoms: ['ENERGY_KWH', 'EMISSION_FACTOR', 'WATER_USAGE'],
      fileName,
      processedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Sonar OCR] Error:', err);
    return jsonError('INTERNAL_ERROR', 'Invalid request');
  }
}
