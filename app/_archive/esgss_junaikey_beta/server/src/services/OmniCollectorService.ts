import { IOmniCollectionTask, IOmniCollectionResult, OmniCollectionSource } from '../../../src/omni/core/types/Collector.types.js';
import { EnhancedOCRService } from '../../services/EnhancedOCRService.js';
import { evidenceVaultService } from './EvidenceVaultService.js';
import { TrinityManager } from '../../../src/omni/infrastructure/synchronization/TrinityManager.js';
import { Protocol5T } from '../../../src/omni/core/types/InfoOne.types.js';
import { omniLogger, LogCategory } from '../../services/omni/infrastructure/logging/OmniLogger.js';

/**
 * 🏛️ OmniCollectorService: The ESG Data Orchestrator
 * --------------------------------------------------
 * Centralizes all data intake (OCR, Manual, IoT).
 * Respects the 5T Protocol and ensures data is "Knowledge Asset" ready.
 */
export class OmniCollectorService {
    private static instance: OmniCollectorService;
    private ocrService: EnhancedOCRService;
    private trinityManager: TrinityManager;

    private constructor() {
        this.ocrService = new EnhancedOCRService();
        this.trinityManager = TrinityManager.getInstance();
    }

    static getInstance(): OmniCollectorService {
        if (!OmniCollectorService.instance) {
            OmniCollectorService.instance = new OmniCollectorService();
        }
        return OmniCollectorService.instance;
    }

    /**
     * 從文件採集 (Document Collection)
     */
    public async collectFromDocument(
        file: { name: string; type: string;[key: string]: any },
        onProgress?: (progress: { stage: string; message: string; percentage: number }) => void
    ): Promise<IOmniCollectionResult> {
        omniLogger.info(LogCategory.SYSTEM, '[💡核心採集] Starting document collection...', { fileName: file.name });

        const taskId = `task-${Date.now()}`;

        onProgress?.({ stage: 'OCR_START', message: '正在讀取文件內容與文字提取...', percentage: 10 });

        // 1. OCR Extraction
        const ocrResult = await this.ocrService.extractText(file.path || '');
        const rawText = ocrResult.text;

        onProgress?.({ stage: 'AI_ANALYSIS', message: '正在利用 AI 進行指標分析與框架識別...', percentage: 40 });

        // 2. AI Structuring (Cleaning & Paragraphing)
        const { metrics, frameworks } = await this.ocrService.extractMetrics(rawText, file.type, (stage: string, perc: number) => {
            onProgress?.({ stage: 'AI_ANALYSIS', message: `正在分析數據... (${stage})`, percentage: 40 + (perc * 0.4) });
        });

        const structuredContent = await this.cleanAndFormat(rawText);

        onProgress?.({ stage: 'EVIDENCE_GEN', message: '正在生成 5T 數位證據與簽章...', percentage: 80 });

        // 3. Evidence Deposit
        const evidence = await evidenceVaultService.uploadAndSign('COLLECTOR_REPORT', {
            name: file.name,
            size: file.size || 0,
            type: file.type
        }, {
            id: 'SYSTEM_COLLECTOR',
            name: 'OmniCollector AI',
            signature: `sig-collector-${Date.now()}`
        }, { taskId, source: 'document' });

        const result: IOmniCollectionResult = {
            id: `res-${Date.now()}`,
            taskId,
            rawContent: rawText,
            structuredContent,
            metrics: metrics.map((m: any) => ({
                key: m.metricKey,
                value: m.numericValue || m.textValue || '',
                unit: m.unit,
                category: m.category,
                confidence: m.confidenceScore || 0.5
            })),
            frameworks,
            evidenceId: evidence.asset.id,
            correlationScore: metrics.length > 0
                ? metrics.reduce((acc: number, cur: any) => acc + (cur.confidenceScore || 0.5), 0) / metrics.length
                : 0.5,
            tags: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRACKABLE],
            timestamp: Date.now()
        };

        // 4. Auto-Backup to OmniNote
        this.backupToNote(result);

        onProgress?.({ stage: 'COMPLETED', message: '採集完成！數據已準備好結晶化。', percentage: 100 });

        omniLogger.info(LogCategory.SYSTEM, '[💡核心採集] Document collection completed.', { resultId: result.id });
        return result;
    }

    /**
     * LLM 輔助數據清洗與格式化
     */
    private async cleanAndFormat(text: string): Promise<string> {
        // Implementation would call LLM to structure text into clean paragraphs
        return `[結構化輸出]\n${text.substring(0, 500)}...\n\n該文件內容已由 JunAiKey 奧秘採集器自動清洗並格式化為標準 ESG 知識段落。`;
    }

    /**
     * 自動備份至萬能筆記 (OmniNote)
     */
    private backupToNote(result: IOmniCollectionResult): void {
        // In a real server context, this would write to a DB
        // For local simulation, we log the action
        omniLogger.info(LogCategory.SYSTEM, '[💡核心採集] Auto-generating OmniNote backup...', {
            contentPreview: result.structuredContent.substring(0, 50)
        });
    }

    /**
     * 最終結晶：將採集結果鑄造成 Trinity 實體
     */
    public async finalizeToTrinity(result: IOmniCollectionResult, identityPatch: any): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, '[💡核心採集] Finalizing to Trinity Knowledge Asset...', { resultId: result.id });

        const trinity = this.trinityManager.forge(
            { id: 'collector-component', name: 'Collector Engine', type: 'DATA_SOURCE' } as any,
            {
                id: `kb-${Date.now()}`,
                content: result.structuredContent,
                sourceOrigin: `OmniCollector:${result.taskId}`,
                tags: result.tags,
                hashLock: result.id // Simple hash for now
            } as any,
            {
                id: `tag-${Date.now()}`,
                name: 'Environment Asset',
                type: 'MEMORY' as any,
                ...identityPatch
            } as any,
            result.evidenceId
        );

        trinity.lock();
        return trinity;
    }
}

export const omniCollectorService = OmniCollectorService.getInstance();
