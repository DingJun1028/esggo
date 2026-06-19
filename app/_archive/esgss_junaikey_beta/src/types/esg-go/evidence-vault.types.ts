/**
 * 📦 Evidence Vault TypeScript Types
 * Sprint 2: Evidence Management Module
 */

export interface EvidenceMetadata {
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    category: EvidenceCategory;
    subType?: string;
    tags?: string[];
    description?: string;
    uploadedBy?: string;
    department?: string;
}

export type EvidenceCategory =
    | 'governance'
    | 'environmental'
    | 'social'
    | 'financial'
    | 'operational'
    | 'certification'
    | 'other';

export type EvidenceVisibility =
    | 'private'
    | 'department'
    | 'company'
    | 'public';

export type VerificationStatus =
    | 'pending'
    | 'verified'
    | 'rejected'
    | 'expired';

export interface EvidenceRecord {
    id: string;
    userId: string;
    companyId?: string;
    l1AssessmentId?: string;

    // File Info
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    fileUrl: string;

    // Classification
    evidenceCategory: EvidenceCategory;
    evidenceSubType?: string;
    tags: string[];
    description?: string;

    // 5T Protocol
    fileHashSha256: string;
    metadataHash?: string;
    lockedAt?: Date;
    isLocked: boolean;

    // Traceability
    sourceOrigin: string;
    uploadedByName?: string;
    department?: string;

    // Access Control
    visibility: EvidenceVisibility;
    sharedWithUsers: string[];

    // QA Integration
    contributesToQaScore: boolean;
    qaScoreWeight: number;

    // Verification
    verificationStatus: VerificationStatus;
    verifiedBy?: string;
    verifiedAt?: Date;

    // Lifecycle
    status: 'active' | 'archived' | 'deleted';
    expiresAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

export interface EvidenceLockResult {
    evidenceId: string;
    isLocked: boolean;
    lockedAt: Date;
    lockProof: string;
    message: string;
}

export interface EvidenceUploadRequest {
    file: File | Buffer;
    metadata: EvidenceMetadata;
    l1AssessmentId?: string;
    visibility?: EvidenceVisibility;
    autoLock?: boolean; // 是否立即執行 Hash Lock
}

export interface EvidenceUploadResponse {
    success: boolean;
    evidenceId: string;
    fileUrl: string;
    fileHash: string;
    metadataHash: string;
    isLocked: boolean;
    lockResult?: EvidenceLockResult;
    suggestedTags?: string[];
    qaContribution: number;
}

export interface EvidenceListQuery {
    userId?: string;
    companyId?: string;
    category?: EvidenceCategory;
    verificationStatus?: VerificationStatus;
    isLocked?: boolean;
    tags?: string[];
    limit?: number;
    offset?: number;
}
