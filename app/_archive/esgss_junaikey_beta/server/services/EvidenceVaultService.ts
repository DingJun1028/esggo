/**
 * 📦 Evidence Vault Service
 * Sprint 2: Evidence Management with 5T Protocol
 * --------------------------------------------------
 * 負責證據上傳、Hash Lock、以及完整性驗證
 */

import crypto from 'crypto';
import type {
    EvidenceMetadata,
    EvidenceLockResult,
    EvidenceRecord // hypothetical interface, checking definition below
} from '../../src/types/esg-go/evidence-vault.types.js';

// Simple in-memory storage for Phase 114
interface StoredEvidence {
    id: string;
    fileBuffer: Buffer;
    metadata: EvidenceMetadata;
    lockResult?: EvidenceLockResult;
    hash?: string;
}

export class EvidenceVaultService {
    private static evidenceStore = new Map<string, StoredEvidence>();

    /**
     * Get evidence by ID
     */
    static getEvidence(evidenceId: string): StoredEvidence | undefined {
        return this.evidenceStore.get(evidenceId);
    }

    /**
     * Store evidence (called by upload handler)
     */
    static storeEvidence(id: string, fileBuffer: Buffer, metadata: EvidenceMetadata): void {
        const hash = this.calculateFileHash(fileBuffer);
        this.evidenceStore.set(id, {
            id,
            fileBuffer,
            metadata,
            hash
        });
    }

    /**
     * 計算文件的 SHA-256 Hash
     */
    static calculateFileHash(fileBuffer: Buffer): string {
        return crypto
            .createHash('sha256')
            .update(fileBuffer)
            .digest('hex');
    }

    /**
     * 計算 Metadata Hash (包含所有非 Hash 欄位)
     */
    static calculateMetadataHash(metadata: any): string {
        const metadataString = JSON.stringify({
            fileName: metadata.fileName || '',
            fileType: metadata.fileType || '',
            fileSizeBytes: metadata.fileSizeBytes || 0,
            category: metadata.category || 'other',
            subType: metadata.subType || '',
            tags: metadata.tags?.sort() || [],
            description: metadata.description || '',
            uploadedBy: metadata.uploadedBy || '',
            department: metadata.department || ''
        });

        return crypto
            .createHash('sha256')
            .update(metadataString)
            .digest('hex');
    }

    /**
     * 驗證文件類型是否允許
     */
    static validateFileType(fileType: string): boolean {
        const allowedTypes = [
            'pdf', 'jpg', 'jpeg', 'png',
            'xlsx', 'xls', 'docx', 'doc',
            'csv', 'txt'
        ];
        return allowedTypes.includes(fileType.toLowerCase());
    }

    /**
     * 驗證文件大小 (最大 50MB)
     */
    static validateFileSize(sizeBytes: number): boolean {
        const MAX_SIZE = 50 * 1024 * 1024; // 50MB
        return sizeBytes > 0 && sizeBytes <= MAX_SIZE;
    }

    /**
     * 執行 Hash Lock (不可逆操作)
     * @returns Lock 結果與時間戳
     */
    static performHashLock(
        evidenceId: string,
        fileHash: string,
        metadataHash: string
    ): EvidenceLockResult {
        const lockedAt = new Date();

        // 生成 Lock Proof (結合 evidenceId + fileHash + metadataHash + timestamp)
        const lockProof = crypto
            .createHash('sha256')
            .update(`${evidenceId}:${fileHash}:${metadataHash}:${lockedAt.toISOString()}`)
            .digest('hex');

        const result: EvidenceLockResult = {
            evidenceId,
            isLocked: true,
            lockedAt,
            lockProof,
            message: '✅ Evidence has been permanently locked (5T: Trustworthy)'
        };

        // Update store if exists
        const evidence = this.evidenceStore.get(evidenceId);
        if (evidence) {
            evidence.lockResult = result;
            this.evidenceStore.set(evidenceId, evidence);
        }

        return result;
    }

    /**
     * 驗證 Evidence 完整性
     */
    static verifyIntegrity(
        fileBuffer: Buffer,
        metadata: EvidenceMetadata,
        storedFileHash: string,
        storedMetadataHash: string
    ): { valid: boolean; details: string } {
        // 1. 驗證文件 Hash
        const calculatedFileHash = this.calculateFileHash(fileBuffer);
        if (calculatedFileHash !== storedFileHash) {
            return {
                valid: false,
                details: '❌ File hash mismatch - file has been tampered'
            };
        }

        // 2. 驗證 Metadata Hash
        const calculatedMetadataHash = this.calculateMetadataHash(metadata);
        if (calculatedMetadataHash !== storedMetadataHash) {
            return {
                valid: false,
                details: '❌ Metadata hash mismatch - metadata has been modified'
            };
        }

        return {
            valid: true,
            details: '✅ Evidence integrity verified (5T Protocol)'
        };
    }

    /**
     * 生成證據上傳的建議標籤
     */
    static suggestTags(
        category: string,
        fileName: string
    ): string[] {
        const suggestions: string[] = [category];

        // 基於文件名推測
        const lowerFileName = fileName.toLowerCase();

        if (lowerFileName.includes('board')) suggestions.push('board_meeting');
        if (lowerFileName.includes('carbon')) suggestions.push('carbon_emission');
        if (lowerFileName.includes('energy')) suggestions.push('energy_usage');
        if (lowerFileName.includes('waste')) suggestions.push('waste_management');
        if (lowerFileName.includes('employee')) suggestions.push('employee_welfare');
        if (lowerFileName.includes('diversity')) suggestions.push('diversity_inclusion');
        if (lowerFileName.includes('audit')) suggestions.push('audit_report');
        if (lowerFileName.includes('certificate')) suggestions.push('certification');

        return [...new Set(suggestions)]; // 去重
    }

    /**
     * 檢查證據是否過期
     */
    static isExpired(expiresAt?: Date): boolean {
        if (!expiresAt) return false;
        return new Date() > new Date(expiresAt);
    }

    /**
     * 計算證據對 QA Score 的貢獻度
     */
    static calculateQAContribution(
        category: string,
        verificationStatus: string,
        isLocked: boolean
    ): number {
        let score = 0;

        // 1. Category weight (治理最重要)
        const categoryWeights: Record<string, number> = {
            governance: 30,
            environmental: 25,
            social: 25,
            financial: 15,
            operational: 10,
            certification: 20,
            other: 5
        };
        score += categoryWeights[category] || 0;

        // 2. Verification bonus
        if (verificationStatus === 'verified') score += 20;
        if (verificationStatus === 'pending') score += 5;

        // 3. Hash Lock bonus (5T: Trustworthy)
        if (isLocked) score += 15;

        return Math.min(score, 100); // 最高 100 分
    }
}
