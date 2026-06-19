/**
 * 🚀 OmniPush Genesis — 5T Service Registry & Assetization Engine
 * Responsibility: Register the 24 MECE services as Knowledge Assets in the OmniOne Registry.
 * Status: TRANSCENDED ♾️
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables before ANY other imports to ensure static fields in classes are populated
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { OmniNcbService } from './core/omni-ncb-service';
import { omniLogger, LogCategory } from './core/omniLogger';

const SERVICES_TO_REGISTER = [
    // 1. Cognitive (可感知)
    { id: 'cog-dashboard', title: '個人 ESG 儀表板', category: 'Cognitive', status: 'Online', weight: 1.0 },
    { id: 'cog-strategy', title: 'AI 策略中心', category: 'Cognitive', status: 'Online', weight: 1.0 },
    { id: 'cog-briefing', title: '每日 ESG 簡報', category: 'Cognitive', status: 'Online', weight: 1.0 },
    { id: 'cog-assistant', title: 'ESG 智能助手 (Dr. Thoth)', category: 'Cognitive', status: 'Online', weight: 1.0 },
    { id: 'cog-predict', title: '趨勢預測引擎', category: 'Cognitive', status: 'Beta', weight: 0.8 },

    // 2. Excellence (可驗算)
    { id: 'exc-checkup', title: '企業健康檢查', category: 'Excellence', status: 'Online', weight: 1.0 },
    { id: 'exc-carbon', title: '碳盤存管理 (Scope 1-3)', category: 'Excellence', status: 'Online', weight: 1.0 },
    { id: 'exc-repair', title: '影響修復實驗室', category: 'Excellence', status: 'Online', weight: 1.0 },
    { id: 'exc-转型', title: '永續轉型顧問', category: 'Excellence', status: 'Beta', weight: 0.5 },
    { id: 'exc-finance', title: '綠色融資助手', category: 'Excellence', status: 'Beta', weight: 0.5 },

    // 3. Governance (不可篡改)
    { id: 'gov-report', title: '自動化報告生成 (GRI/SASB)', category: 'Governance', status: 'Online', weight: 1.0 },
    { id: 'gov-vault', title: '不可篡改證據庫', category: 'Governance', status: 'Online', weight: 1.0 },
    { id: 'gov-passport', title: '誠信護照', category: 'Governance', status: 'Online', weight: 1.0 },
    { id: 'gov-risk', title: '合規風險監控', category: 'Governance', status: 'Beta', weight: 0.7 },
    { id: 'gov-board', title: '董事會儀表板', category: 'Governance', status: 'Planned', weight: 0.1 },

    // 4. Agency (可追蹤)
    { id: 'age-forge', title: 'AI 代理鍛造廠 (王道阿丹)', category: 'Agency', status: 'Online', weight: 1.0 },
    { id: 'age-matrix', title: '任務矩陣', category: 'Agency', status: 'Online', weight: 1.0 },
    { id: 'age-workflow', title: '智能工作流', category: 'Agency', status: 'Online', weight: 1.0 },
    { id: 'age-notify', title: '智能通知系統', category: 'Agency', status: 'Online', weight: 1.0 },
];

async function runGenesisRegistry() {
    omniLogger.info(LogCategory.SYSTEM, '🛡️ [OmniPush Genesis] Initiating 5T Service Registration Protocol...');

    for (const service of SERVICES_TO_REGISTER) {
        process.stdout.write(`📡 Registering [${service.id}] ${service.title}... `);

        try {
            // Mapping internal status to allowed database enum values: 'draft', 'published'
            // 'Online' maps to 'published', all others ('Beta', 'Planned') map to 'draft'
            const dbStatus = (service.status === 'Online') ? 'published' : 'draft';

            const result = await OmniNcbService.saveReport({
                uuid: service.id,
                title: service.title,
                status: dbStatus as 'published' | 'draft',
                complianceScore: service.weight * 100,
                // These will be stored inside the 'report_data' JSONB column by OmniNcbService
                payload: {
                    serviceId: service.id,
                    domain: service.category,
                    isRegistry: true, // Mark as registry entry for easy filtering
                    awaken: true,
                    lastPush: new Date().toISOString(),
                    weight: service.weight,
                    category: service.category
                }
            });

            if (result.error) {
                console.log(`❌ FAIL: ${result.error}`);
            } else {
                console.log('✅ OK');
            }
        } catch (err: any) {
            console.log(`❌ ERROR: ${err.message || err}`);
        }
    }

    console.log('\n🌐 [OmniDomain] Registration complete — Sovereignty confirmed.');
    console.log('🚀 [Status] TRANSCENDED ♾️');
}

runGenesisRegistry().catch(err => {
    console.error('\n💥 Genesis Registry Fatal Error:');
    console.error(err);
    process.exit(1);
});
