/**
 * 📜 manifest_report.ts
 * Epic 10: 典範轉移 ♾️ 永續報告顯化引擎
 * 功能：掃描已學習的 Atoms，聚合並調用 Jules API 生成報告草稿。
 */

import { OmniOne } from './omni-one';
import { omniNexusTrinity } from './omni-nexus-trinity';
import { IReportManifest } from './omni-types';
import { v4 as uuidv4 } from 'uuid';

export class ReportManifestEngine {
    private static instance: ReportManifestEngine;

    public static getInstance() {
        if (!ReportManifestEngine.instance) {
            ReportManifestEngine.instance = new ReportManifestEngine();
        }
        return ReportManifestEngine.instance;
    }

    /**
     * 🌀 顯化報告：將多個 Atoms 聚合為一份報告資產
     */
    async manifest(config: {
        domain: 'E' | 'S' | 'G' | 'OMNI';
        atomUuids: string[];
        standards: string[];
    }): Promise<IReportManifest> {
        console.log(`[ManifestEngine] 啟動顯化程序: Domain=${config.domain}, Atoms count=${config.atomUuids.length}`);

        // 1. 建立顯化意圖
        const intent = `顯化 ${config.domain} 領域永續報告: 涵蓋 ${config.atomUuids.length} 項核心知識。`;

        // 2. 透過 OmniNexus 調用報告生成工具
        const prompt = `您是 ESG 報告專家。請根據以下 ${config.atomUuids.length} 項已驗證的知識點，
        撰寫一份符合 ${config.standards.join('/')} 標準的報告草稿提要。
        領域: ${config.domain}
         Atoms: ${config.atomUuids.join(', ')}
        
        請以「服務即教學」的口吻，指導企業如何落實這些指標。`;

        const response = await omniNexusTrinity.dispatch('ask_jules', { prompt });

        const manifest: IReportManifest = {
            reportId: `REP-${uuidv4().substring(0, 8).toUpperCase()}`,
            standards: config.standards,
            targetDomain: config.domain,
            atomsIncluded: config.atomUuids,
            generatedDraft: response.success ? response.data : '生成失敗',
            manifestDate: Date.now(),
        };

        // 3. 封印為新資產 Atom
        await OmniOne.manifest({
            intent,
            type: 'Accomplishment',
            payload: manifest as any,
            tags: ['REPORT', 'MANIFESTATION', config.domain],
            domainRef: 'OMNI-REPORTING-HUB'
        });

        return manifest;
    }
}

export const reportManifestEngine = ReportManifestEngine.getInstance();
