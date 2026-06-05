import { z } from 'zod';
/**
 * BestPracticeRegistry: 最佳實踐精選智庫
 * 儲存經過驗證、高品質且符合 5T 標準的 ESG 治理策略。
 */
export const BestPracticeSchema = z.object({
    id: z.string().uuid(),
    category: z.enum(['E', 'S', 'G']),
    industry: z.string().describe('適用產業'),
    title: z.string().min(1),
    strategy: z.string().describe('策略詳情'),
    benchmark_source: z.string().describe('標竿來源 (如台積電, RE100)'),
    t5_compliance: z.object({
        traceable: z.boolean(),
        transparent: z.boolean(),
        tangible: z.boolean(),
        trackable: z.boolean(),
        trustworthy: z.boolean(),
    }),
    impact_score: z.number().min(0).max(100),
    tags: z.array(z.string()),
    last_verified: z.string(),
});
export const BEST_PRACTICE_REGISTRY = [
    {
        id: 'bp-001',
        category: 'E',
        industry: 'High-Tech Manufacturing',
        title: '自動化能源即時鏈路 (RE100 Standard)',
        strategy: '導入 API 層級的電費單自動化對接，取代人工填報，實現 T1 級別溯源。',
        benchmark_source: 'Apple / TSMC Supply Chain Requirements',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 95,
        tags: ['Energy', 'RE100', 'Automation'],
        last_verified: '2026-05-20',
    },
    {
        id: 'bp-002',
        category: 'S',
        industry: 'Software / Services',
        title: 'ZKP 薪資公平性審計 (Privacy-First DEI)',
        strategy: '利用零知識證明 (ZKP) 展示薪資中位數差異符合公平性要求，而不揭露個別員工薪資敏感數據。',
        benchmark_source: 'Google DEI Report Model',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 92,
        tags: ['DEI', 'Privacy', 'ZKP'],
        last_verified: '2026-05-22',
    },
    {
        id: 'bp-003',
        category: 'G',
        industry: 'General Corporate',
        title: '氣候風險連動薪酬 (SBTi-Linked LTI)',
        strategy: '將高階主管長期激勵計畫 (LTI) 與 SBTi 減碳達標率直接連動，確保治理目標具備實質約束力。',
        benchmark_source: 'SBTi Financial Institution Guide',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 88,
        tags: ['Governance', 'LTI', 'SBTi'],
        last_verified: '2026-05-25',
    }
];
export function getBestPractices(category, industry) {
    return BEST_PRACTICE_REGISTRY.filter(bp => {
        const catMatch = !category || bp.category === category;
        const indMatch = !industry || bp.industry.includes(industry) || bp.industry === 'General Corporate';
        return catMatch && indMatch;
    }).sort((a, b) => b.impact_score - a.impact_score);
}
/**
 * Auto-Evolution Best Practices - OmniAgent Enhancement Layer
 * 新增自主進化相關策略
 */
export const AUTO_EVOLUTION_BEST_PRACTICES = [
    {
        id: 'bp-ae-001',
        category: 'G',
        industry: 'General Corporate',
        title: '自主演化治理框架 (OmniAgent Evolution Protocol)',
        strategy: '建立自我演化閉環：從資料採集→模型推理→結果驗證→知識沉澱→治理升級，實現 AI 系統持續自優化。',
        benchmark_source: 'Google Agent Platform Autonomous Loop',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 98,
        tags: ['Evolution', 'Governance', 'Agent', 'Self-Optimization'],
        last_verified: '2026-05-29',
    },
    {
        id: 'bp-ae-002',
        category: 'E',
        industry: 'High-Tech Manufacturing',
        title: '量子進化能源優化 (Quantum Energy Evolution)',
        strategy: '採用量子式迭代演算法，持續優化能源消耗模型，達成每年 15% 減耗目標。',
        benchmark_source: 'Microsoft Quantum Sustainability Lab',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 89,
        tags: ['Energy', 'Quantum', 'Optimization', 'AI-Evolution'],
        last_verified: '2026-05-28',
    },
    {
        id: 'bp-ae-003',
        category: 'S',
        industry: 'Software / Services',
        title: 'ZKP 治癒循環 (ZKP Healing Loop)',
        strategy: '被動天賦自動觸發：偵測數據偏差→觸發萬能修復→重新封印→治理升級，保持系統誠信穩定。',
        benchmark_source: 'ENS Autonomous Recovery Protocol',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 94,
        tags: ['ZKP', 'Healing', 'Recovery', 'Autonomous'],
        last_verified: '2026-05-27',
    }
];
export function getAutoEvolutionPractices(industry) {
    return AUTO_EVOLUTION_BEST_PRACTICES.filter(bp => !industry || bp.industry.includes(industry) || bp.industry === 'General Corporate').sort((a, b) => b.impact_score - a.impact_score);
}
/**
 * OmniBlueTable Best Practices - Data Sovereignty & Multi-Cloud ESG Orchestration
 * 2026-05-31 新增區段：收錄 OmniBlue × OmniTable 整合治理策略
 */
export const OMNIBLUETABLE_BEST_PRACTICES = [
    {
        id: 'bp-ot-001',
        category: 'G',
        industry: 'High-Tech Manufacturing',
        title: '多雲 ESG 治理主權橋接 (OmniBlueTable Hybrid Control)',
        strategy: '建立 OmniBlue 多雲控制平面與 OmniTable 企業資料表的雙向同步橋接層，實現跨雲 ESG 指標自動部署與 Logic Node 治理追蹤，確保數據 Sovereignty 與合規一致性。',
        benchmark_source: 'ESGGO OmniAgent Architecture v8.5',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 96,
        tags: ['OmniBlueTable', 'DataSovereignty', 'MultiCloud', 'HybridControlPlane', 'ESG'],
        last_verified: '2026-05-31',
    },
    {
        id: 'bp-ot-002',
        category: 'E',
        industry: 'General Corporate',
        title: 'API Key 安全隔離模式 (Server-side Proxy Pattern)',
        strategy: '所有 OmniTable 操作經由 Next.js API Route (`/api/omni-table`) Server-side Proxy 轉發，確保存放於環境變數的 `OMNITABLE_API_KEY` 永不暴露於 Client Bundle，符合零信任安全架構。',
        benchmark_source: 'OWASP API Security Top 10 / ESGGO Engineering Principles',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 94,
        tags: ['Security', 'APIKey', 'ServerSideProxy', 'ZeroTrust', 'OmniTable'],
        last_verified: '2026-05-31',
    },
    {
        id: 'bp-ot-003',
        category: 'G',
        industry: 'High-Tech Manufacturing',
        title: 'EventBus 驅動的即時治理儀表板 (Real-time Mission Control)',
        strategy: '透過 `omniAgentBus` EventBus 廣播 OmniBlue ↔ OmniTable 同步任務的全生命週期事件 (MISSION_START → AGENT_TASK → MISSION_COMPLETE / AGENT_ERROR)，前端 Think Tank Dashboard 經由 `useOmniAgentStream` Hook 即時接收並視覺化，實現治理透明度。',
        benchmark_source: 'ESGGO Think Tank Dashboard v8.5',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 91,
        tags: ['EventBus', 'SSE', 'ThinkTank', 'RealTime', 'Governance', 'Dashboard'],
        last_verified: '2026-05-31',
    },
    {
        id: 'bp-ot-004',
        category: 'G',
        industry: 'General Corporate',
        title: 'Exponential Backoff 自動重試與批次處理 (Resilient Data Pipeline)',
        strategy: '在 `syncLogicNodesToOmniTable` 中實施 exponential backoff retry (3 次，1s → 2s → 4s) 與 chunk-based batch processing (size=10)，提升跨雲數據同步的可靠度與 API 限流耐受性。',
        benchmark_source: 'AWS Architecture Blog: Exponential Backoff And Jitter',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 87,
        tags: ['Resilience', 'Retry', 'BatchProcessing', 'RateLimit', 'DataPipeline'],
        last_verified: '2026-05-31',
    },
    // Render Workflows Examples
    {
        id: 'bp-rw-hw', // Render Workflow - Hello World
        category: 'G', // Governance, as it demonstrates core workflow concepts
        industry: 'General Corporate',
        title: 'Render Workflow: Hello World Task Definitions',
        strategy: '定義並註冊基礎 Render 工作流程任務 (如計算平方、鏈接任務、錯誤重試)，用於驗證平台連通性與基本功能。',
        benchmark_source: 'Render Workflows SDK Examples',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true }, // Assuming basic compliance
        impact_score: 50, // Low impact as it's a demo
        tags: ['RenderWorkflow', 'TaskDefinition', 'HelloWorld', 'SDK'],
        last_verified: '2026-06-04',
    },
    {
        id: 'bp-rw-etl', // Render Workflow - ETL Job
        category: 'G', // Data Processing Governance
        industry: 'General Corporate',
        title: 'Render Workflow: ETL Data Pipeline',
        strategy: '實作 Render 工作流程驅動的 ETL 數據處理管道，自動執行數據提取、轉換與載入任務，確保數據準確性與及時性。',
        benchmark_source: 'Render Workflows SDK Examples',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 75,
        tags: ['RenderWorkflow', 'ETL', 'DataPipeline', 'Automation'],
        last_verified: '2026-06-04',
    },
    {
        id: 'bp-rw-dp', // Render Workflow - Data Pipeline
        category: 'G', // Data Processing Governance
        industry: 'General Corporate',
        title: 'Render Workflow: Multi-Source Data Pipeline',
        strategy: '建立多源數據整合與分析的 Render 工作流程，實現數據清洗、富化及分段，支持複雜的數據治理與決策。',
        benchmark_source: 'Render Workflows SDK Examples',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 80,
        tags: ['RenderWorkflow', 'DataPipeline', 'MultiSource', 'Analytics'],
        last_verified: '2026-06-04',
    },
    {
        id: 'bp-rw-fp', // Render Workflow - File Processing
        category: 'G', // File Processing Governance
        industry: 'General Corporate',
        title: 'Render Workflow: File Processing & Analysis',
        strategy: '設計 Render 工作流程用於文件上傳、解析與批次處理，包含文件驗證、數據提取與轉換，適用於大規模數據文件管理。',
        benchmark_source: 'Render Workflows SDK Examples',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 70,
        tags: ['RenderWorkflow', 'FileProcessing', 'BatchProcessing', 'DataManagement'],
        last_verified: '2026-06-04',
    },
    {
        id: 'bp-rw-oai', // Render Workflow - OpenAI Agent
        category: 'S', // Social (AI for customer support, DEI) or G (AI Governance)
        industry: 'General Corporate',
        title: 'Render Workflow: OpenAI Agent for Text Analysis',
        strategy: '整合 OpenAI 代理於 Render 工作流程，實現 AI 驅動的文本分析、語義理解與自動響應，提升客戶服務或數據洞察能力。',
        benchmark_source: 'Render Workflows SDK Examples / OpenAI API',
        t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
        impact_score: 85,
        tags: ['RenderWorkflow', 'OpenAI', 'AI', 'TextAnalysis', 'Agent'],
        last_verified: '2026-06-04',
    },
];
export function getOmniBlueTablePractices(industry) {
    return OMNIBLUETABLE_BEST_PRACTICES.filter(bp => !industry || bp.industry.includes(industry) || bp.industry === 'General Corporate').sort((a, b) => b.impact_score - a.impact_score);
}
export const THINK_TANK_REGISTRY = [
    {
        id: 'ttr-001',
        component: 'wiki/omniblue-table.md',
        category: 'Document',
        tags: ['OmniBlueTable', 'DataSovereignty', 'Architecture'],
        t5_tag: 'T5',
        registered_at: '2026-05-31',
        cross_refs: ['wiki/evidence.create.md', 'wiki/cli.vault.seal.md', 'wiki/integrity.service.seal-content.md'],
    },
    {
        id: 'ttr-002',
        component: 'lib/services/omni-blue.ts',
        category: 'Service',
        tags: ['OmniBlueClient', 'MultiCloud', 'AgentDeployment'],
        t5_tag: 'T2',
        registered_at: '2026-05-31',
        cross_refs: ['lib/services/omni-table-blue-bridge.ts'],
    },
    {
        id: 'ttr-003',
        component: 'lib/services/omni-table-blue-bridge.ts',
        category: 'Service',
        tags: ['OmniTableBlueBridge', 'Sync', 'ESG'],
        t5_tag: 'T4',
        registered_at: '2026-05-31',
        cross_refs: ['server/src/integrations/omni-table-client.ts', 'lib/agents/omni-commander.ts'],
    },
    {
        id: 'ttr-004',
        component: 'lib/agent/best-practice-registry.ts::OMNIBLUETABLE_BEST_PRACTICES',
        category: 'BestPractice',
        tags: ['BestPractice', 'DataSovereignty', 'Security', 'RealTime', 'Resilience'],
        t5_tag: 'T5',
        registered_at: '2026-05-31',
        cross_refs: ['lib/agent/best-practice-registry.ts::BEST_PRACTICE_REGISTRY'],
    },
    {
        id: 'ttr-005',
        component: 'OMNI_GUIDE.md::0.5.5 OmniBlueTable',
        category: 'Principle',
        tags: ['Principle', 'DataSovereignty', 'Architecture'],
        t5_tag: 'T3',
        registered_at: '2026-05-31',
        cross_refs: ['OMNI_GUIDE.md::0.5 Engineering Safety'],
    },
];
export function getThinkTankRegistrations(category) {
    return THINK_TANK_REGISTRY.filter(tr => !category || tr.category === category);
}
//# sourceMappingURL=best-practice-registry.js.map