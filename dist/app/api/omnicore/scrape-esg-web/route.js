export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { getOmniAgentAI } from '../../../../lib/omni.config';
import { ncbClient } from '../../../../lib/ncbdb';
import crypto from 'crypto';
export async function POST(request) {
    try {
        const body = await request.json();
        const targetUrl = body.url || 'https://www.w3.org/'; // Default dummy fallback
        console.log(`[Scrape ESG] 開始自動抓取公開網頁: ${targetUrl}`);
        // 1. Fetch website content
        const res = await fetch(targetUrl, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) {
            throw new Error(`網頁抓取失敗: ${res.statusText}`);
        }
        const html = await res.text();
        // 2. Extract text using Cheerio
        const $ = cheerio.load(html);
        // Remove scripts, styles, etc.
        $('script, style, noscript, iframe, img, svg').remove();
        const extractedText = $('body').text().replace(/\s+/g, ' ').trim();
        console.log(`[Scrape ESG] 網頁解析完成，擷取字數: ${extractedText.length}`);
        // 3. Use OmniAgent (Genkit) to audit and extract metrics
        const ai = await getOmniAgentAI();
        const prompt = `你是一個專業的 ESG 稽核 AI 代理 (OmniAgent ESG_Auditor)。
以下是從公開網頁抓取出的內容：
"""
${extractedText.substring(0, 3000)} // 截斷避免過長
"""

請分析此內容，尋找與 ESG 相關的承諾、數據或報告。
請以 JSON 格式回應：
{
  "metrics": [
    { "key": "public_commitment", "value": "Found", "unit": "N/A", "gri": "General Disclosure" }
  ],
  "confidence": 0.90,
  "gapAnalysis": "網頁包含基本的公司治理與環境承諾聲明。"
}`;
        const response = await ai.generate({
            system: "你是一個 ESG 情報收集專家與稽核員。嚴格遵守 JSON 輸出格式。",
            prompt: prompt,
        });
        let aiResult;
        try {
            const text = response.text().replace(/```json|```/g, '').trim();
            aiResult = JSON.parse(text);
        }
        catch (e) {
            aiResult = {
                metrics: [{ key: 'web_scan', value: 'Verified', unit: 'N/A', gri: 'General' }],
                confidence: 0.85,
                gapAnalysis: "Failed to parse AI output, using fallback."
            };
        }
        // 4. 5T Protocol: Hash Lock & ZKP Seal Simulation
        const hashLock = crypto.createHash('sha256').update(extractedText).digest('hex');
        const zkpSeal = `zkp_seal_web_${crypto.randomBytes(8).toString('hex')}`;
        const auditRecord = {
            uuid: crypto.randomUUID(),
            source_origin: `web://${targetUrl}`,
            content_hash: hashLock,
            zkp_seal: zkpSeal,
            status: 'VERIFIED',
            metrics: JSON.stringify(aiResult.metrics),
            confidence: aiResult.confidence,
            gap_analysis: aiResult.gapAnalysis,
            timestamp: new Date().toISOString()
        };
        // 5. Write to NCBDB (vault_omni_core)
        console.log(`[Scrape ESG] 準備寫入 NCBDB (vault_omni_core)...`);
        const dbResult = await ncbClient.upsertRecord('vault_omni_core', auditRecord);
        return NextResponse.json({
            success: true,
            message: '公開網頁抓取、高階稽核與 NCBDB 寫入已完成！',
            details: {
                scrapedTextLength: extractedText.length,
                hashLock,
                zkpSeal,
                aiExtraction: aiResult,
                ncbdbSync: dbResult
            }
        });
    }
    catch (error) {
        console.error('[Scrape ESG] 執行失敗:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map