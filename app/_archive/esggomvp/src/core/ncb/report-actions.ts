'use server';

import { IReportMetadata } from '@/core/types/omni-types';
// import { createHash } from 'crypto'; // Removed for browser compatibility

/**
 * 🔗 Report Actions (永續智庫資料通訊層)
 * 負責與 NCB Server 進行永續報告的增刪查改。
 * 實作 Server Actions 標準。
 */

// 模擬 NCB 資料存儲 (後續會介接實際 NCB API)
let mockReports: IReportMetadata[] = [];

export async function getAllReports(): Promise<IReportMetadata[]> {
    return mockReports;
}

export async function getReportById(id: string): Promise<IReportMetadata | null> {
    return mockReports.find(r => r.uuid === id) || null;
}

/**
 * 💾 儲存或更新報告
 */
export async function saveReport(report: IReportMetadata): Promise<{ success: boolean; data?: IReportMetadata }> {
    try {
        const existingIndex = mockReports.findIndex(r => r.uuid === report.uuid);

        // 🛡️ [Epic 3] 不可篡改檢查：如果資產已封印，拒絕任何修改
        if (existingIndex >= 0 && mockReports[existingIndex].status === 'Published') {
            throw new Error('[5T:Trustworthy] Cannot modify a sealed asset.');
        }

        if (existingIndex >= 0) {
            mockReports[existingIndex] = report;
        } else {
            mockReports.push(report);
        }

        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, data: report };
    } catch (error) {
        console.error('Failed to save report to NCB:', error);
        return { success: false };
    }
}

import { createHash } from 'crypto';

/**
 * 🔒 [Epic 3] Seal Report (執行 Hash Lock 封印)
 * 將資產狀態轉為 Published，並鎖定 SHA-256 雜湊值。
 */
export async function sealReport(id: string): Promise<{ success: boolean; hash?: string }> {
    const report = mockReports.find(r => r.uuid === id);
    if (!report) return { success: false };

    // 🧬 真實 SHA-256 Hash Lock
    const payload = JSON.stringify({
        uuid: report.uuid,
        timestamp: report.timestamp,
        name: report.name,
        domain: report.domain
    });

    const hash = createHash('sha256').update(payload).digest('hex');

    report.status = 'Published';
    // 在元資料中增加封印標記 (假設 meta 具備此欄位或作為證據標記)
    if (!report.evidence) report.evidence = [];

    // 清除舊有的 mock hash 並加入真實 hash
    report.evidence = report.evidence.filter(e => !e.startsWith('hash-lock:'));
    report.evidence.push(`hash-lock:SHA256:${hash}`);

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[5T:Trustworthy] Asset ${id} permanently sealed with SHA-256: ${hash}`);

    return { success: true, hash };
}

export async function deleteReport(id: string): Promise<boolean> {
    const report = mockReports.find(r => r.uuid === id);
    if (report?.status === 'Published') return false; // 封印後禁止刪除 (視政策而定)

    mockReports = mockReports.filter(r => r.uuid !== id);
    return true;
}
