/**
 * 單據檢核服務
 * ==============
 * 處理單據上傳、驗證、檢核邏輯
 */

import {
    DocumentChecklist,
    DocumentInstance,
    DocumentUploadRequest,
    ValidationResult,
    BatchValidationResult,
    ChecklistSummary,
    DocumentStatus
} from '../../src/types/DocumentChecklist.js';
import { ALL_DOCUMENTS, getRequiredDocuments, getCriticalDocuments } from '../../src/config/DocumentRegistry.js';

export class DocumentChecklistService {

    /**
     * 創建新的檢核清單
     */
    async createChecklist(companyId: string, reportYear: number): Promise<DocumentChecklist> {
        const checklist: DocumentChecklist = {
            companyId,
            reportYear,
            reportType: 'ESG Annual Report',
            createdAt: new Date(),
            updatedAt: new Date(),
            documents: [],
            summary: this.calculateSummary([])
        };

        return checklist;
    }

    /**
     * 上傳單據
     */
    async uploadDocument(
        checklistId: string,
        request: DocumentUploadRequest
    ): Promise<DocumentInstance> {

        const docDef = ALL_DOCUMENTS.find(d => d.id === request.documentDefId);
        if (!docDef) {
            throw new Error(`Document definition not found: ${request.documentDefId}`);
        }

        // 驗證文件
        const validationResult = await this.validateDocument(request.file, docDef);

        // 創建單據實例
        const instance: DocumentInstance = {
            id: this.generateId(),
            documentDefId: request.documentDefId,
            fileName: request.file.name,
            fileUrl: `/uploads/${checklistId}/${request.file.name}`,
            fileSize: request.file.size,
            uploadedAt: new Date(),
            uploadedBy: 'current-user', // TODO: 從 session 獲取
            status: validationResult.valid ? 'uploaded' : 'rejected',
            validationResult,
            metadata: request.metadata
        };

        return instance;
    }

    /**
     * 驗證單一文件
     */
    async validateDocument(file: File, docDef: any): Promise<ValidationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];
        let score = 100;

        // 1. 檢查文件格式
        const fileExt = this.getFileExtension(file.name);
        if (!docDef.acceptedFormats.includes(fileExt)) {
            errors.push(`不支援的文件格式：${fileExt}。允許格式：${docDef.acceptedFormats.join(', ')}`);
            score -= 30;
        }

        // 2. 檢查文件大小
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > docDef.maxSizeMB) {
            errors.push(`文件過大：${fileSizeMB.toFixed(2)}MB。上限：${docDef.maxSizeMB}MB`);
            score -= 20;
        }

        // 3. 檢查文件命名
        if (!this.isValidFileName(file.name)) {
            warnings.push('建議使用有意義的文件名，避免中文特殊字符');
            score -= 5;
        }

        // 4. 內容檢查（簡化版）
        // 實際應用中應該解析 Excel/PDF 內容
        if (file.size < 1024) {
            warnings.push('文件過小，可能內容不完整');
            score -= 10;
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            score: Math.max(0, score)
        };
    }

    /**
     * 批次驗證所有文件
     */
    async batchValidate(checklist: DocumentChecklist): Promise<BatchValidationResult> {
        const requiredDocs = getRequiredDocuments();
        const results = new Map<string, ValidationResult>();

        let totalScore = 0;
        let validCount = 0;

        for (const doc of checklist.documents) {
            if (doc.validationResult) {
                results.set(doc.id, doc.validationResult);
                totalScore += doc.validationResult.score;
                if (doc.validationResult.valid) {
                    validCount++;
                }
            }
        }

        const overallScore = checklist.documents.length > 0
            ? totalScore / checklist.documents.length
            : 0;

        // 檢查是否可以繼續生成報告
        const uploadedDocIds = checklist.documents
            .filter((d: DocumentInstance) => d.status === 'uploaded' || d.status === 'verified')
            .map((d: DocumentInstance) => d.documentDefId);

        const missingCritical = getCriticalDocuments().filter(
            d => !uploadedDocIds.includes(d.id)
        );

        const canProceed = missingCritical.length === 0 && overallScore >= 70;

        return {
            totalDocuments: checklist.documents.length,
            validDocuments: validCount,
            invalidDocuments: checklist.documents.length - validCount,
            results,
            overallScore,
            canProceed
        };
    }

    /**
     * 計算檢核摘要
     */
    calculateSummary(documents: DocumentInstance[]): ChecklistSummary {
        const requiredDocs = getRequiredDocuments();
        const criticalDocs = getCriticalDocuments();

        const uploaded = documents.filter(d =>
            d.status === 'uploaded' || d.status === 'verified'
        ).length;

        const verified = documents.filter(d => d.status === 'verified').length;
        const pending = documents.filter(d => d.status === 'pending').length;
        const rejected = documents.filter(d => d.status === 'rejected').length;

        const uploadedDocIds = documents
            .filter(d => d.status === 'uploaded' || d.status === 'verified')
            .map(d => d.documentDefId);

        const missing = requiredDocs.filter(
            d => !uploadedDocIds.includes(d.id)
        ).length;

        const completeness = requiredDocs.length > 0
            ? (uploaded / requiredDocs.length) * 100
            : 0;

        // 檢查關鍵問題
        const criticalIssues: string[] = [];
        const warnings: string[] = [];

        const missingCritical = criticalDocs.filter(
            d => !uploadedDocIds.includes(d.id)
        );

        if (missingCritical.length > 0) {
            criticalIssues.push(`缺少 ${missingCritical.length} 份關鍵單據：${missingCritical.map(d => d.name).join('、')}`);
        }

        if (rejected > 0) {
            warnings.push(`${rejected} 份單據被拒絕，請重新上傳`);
        }

        if (completeness < 80) {
            warnings.push(`完整度僅 ${completeness.toFixed(0)}%，建議達到 80% 以上`);
        }

        const readyForReport = criticalIssues.length === 0 && completeness >= 80;

        return {
            totalRequired: requiredDocs.length,
            uploaded,
            verified,
            pending,
            missing,
            rejected,
            completeness,
            readyForReport,
            criticalIssues,
            warnings
        };
    }

    /**
     * 更新單據狀態
     */
    async updateDocumentStatus(
        documentId: string,
        newStatus: DocumentStatus,
        notes?: string
    ): Promise<void> {
        // TODO: 實作資料庫更新
        console.log(`Updated document ${documentId} to ${newStatus}`);
    }

    /**
     * 生成缺失報告
     */
    generateMissingReport(checklist: DocumentChecklist): {
        missing: any[];
        recommendations: string[];
    } {
        const uploadedDocIds = checklist.documents
            .filter(d => d.status === 'uploaded' || d.status === 'verified')
            .map(d => d.documentDefId);

        const missing = ALL_DOCUMENTS
            .filter(d => !uploadedDocIds.includes(d.id))
            .map(d => ({
                id: d.id,
                name: d.name,
                category: d.category,
                urgency: d.urgency,
                required: d.required,
                frameworks: d.requiredBy
            }));

        const recommendations: string[] = [];

        const criticalMissing = missing.filter(d => d.urgency === 'critical');
        if (criticalMissing.length > 0) {
            recommendations.push(`⚠️ 優先上傳 ${criticalMissing.length} 份關鍵單據`);
        }

        const envMissing = missing.filter(d => d.category === 'Environment');
        if (envMissing.length > 0) {
            recommendations.push(`🌱 環境類缺少 ${envMissing.length} 份單據`);
        }

        const socMissing = missing.filter(d => d.category === 'Social');
        if (socMissing.length > 0) {
            recommendations.push(`👥 社會類缺少 ${socMissing.length} 份單據`);
        }

        const govMissing = missing.filter(d => d.category === 'Governance');
        if (govMissing.length > 0) {
            recommendations.push(`📊 治理類缺少 ${govMissing.length} 份單據`);
        }

        return { missing, recommendations };
    }

    // ==================== Helper Methods ====================

    private generateId(): string {
        return `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getFileExtension(filename: string): string {
        const parts = filename.split('.');
        return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
    }

    private isValidFileName(filename: string): boolean {
        // 檢查文件名是否包含特殊字符或過長
        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
        return !invalidChars.test(filename) && filename.length < 200;
    }
}

// 單例模式
export const documentChecklistService = new DocumentChecklistService();
