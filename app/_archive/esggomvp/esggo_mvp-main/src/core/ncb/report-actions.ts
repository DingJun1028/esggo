'use server';

import { IReportMetadata, ReportStatus } from '@/core/types/omni-types';
import { OmniNcbService } from '@/core/omni-ncb-service';
import { createHash } from 'crypto';

/**
 * 🔗 Report Actions (永續智庫資料通訊層)
 * 負責與 NCB Server 進行永續報告的增刪查改。
 * 實作 Server Actions 標準。
 */

export async function getAllReports(): Promise<IReportMetadata[]> {
    try {
        const items = (await OmniNcbService.listReports()) as any[];
        return items.map((item) => ({
            uuid: item.uuid || item.id?.toString() || Math.random().toString(),
            name: item.title || 'Untitled Report',
            description: item.description || '',
            domain: 'Governance',
            timestamp: item.published_at ? new Date(item.published_at).getTime() : Date.now(),
            status: (item.status === 'Published' ? 'Published' : 'Draft') as ReportStatus,
            ownerId: 'DingJun',
            tags: [],
            version: item.version?.toString() || 'v1.0.0',
            evidence: [],
            hash_lock: item.hash_lock || '',
            isFrozen: item.status === 'Published',
            complianceScore: item.complianceScore || 0
        }));
    } catch (err) {
        console.error("Failed to fetch reports from NCB:", err);
        return [];
    }
}

export async function getReportById(id: string): Promise<IReportMetadata | null> {
    const all = await getAllReports();
    return all.find(r => r.uuid === id) || null;
}

/**
 * 💾 儲存或更新報告
 */
export async function saveReport(report: IReportMetadata): Promise<{ success: boolean; data?: IReportMetadata }> {
    try {
        const result = await OmniNcbService.saveReport({
            title: report.name,
            reporting_year: new Date(report.timestamp).getFullYear(),
            status: report.status === 'Published' ? 'Published' : 'draft',
            payload: report,
            complianceScore: report.complianceScore || 0
        });

        if (result.error) throw new Error(result.message);
        return { success: true, data: report };
    } catch (error) {
        console.error('Failed to save report to NCB:', error);
        return { success: false };
    }
}

/**
 * 🔒 [Epic 3] Seal Report (執行 Hash Lock 封印)
 */
export async function sealReport(id: string): Promise<{ success: boolean; hash?: string }> {
    try {
        const report = await getReportById(id);
        if (!report) return { success: false };

        const payload = JSON.stringify({
            uuid: report.uuid,
            timestamp: report.timestamp,
            name: report.name,
            domain: report.domain
        });

        const hash = createHash('sha256').update(payload).digest('hex');
        
        const updatedReport: IReportMetadata = {
            ...report,
            status: 'Published' as ReportStatus,
            hash_lock: hash,
            isFrozen: true,
            evidence: [...(report.evidence || []), `hash-lock:SHA256:${hash}`]
        };

        const result = await saveReport(updatedReport);
        if (!result.success) return { success: false };

        console.log(`[5T:Trustworthy] Asset ${id} permanently sealed with SHA-256: ${hash}`);
        return { success: true, hash };
    } catch (err) {
        console.error("Seal failed:", err);
        return { success: false };
    }
}

export async function deleteReport(id: string): Promise<boolean> {
    const report = await getReportById(id);
    if (report?.status === 'Published') return false;
    
    return true; 
}
