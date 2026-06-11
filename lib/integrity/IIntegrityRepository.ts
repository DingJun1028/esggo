export interface IntegrityRecord {
    id: string;
    hash: string;
    timestamp: string;
    status: 'verified' | 'tampered' | 'pending';
}

export interface IntegrityRepository {
    saveRecord(record: IntegrityRecord): Promise<void>;
    getRecord(id: string): Promise<IntegrityRecord | null>;
    verifyHash(id: string, currentHash: string): Promise<boolean>;
}

// Legacy alias for backward compatibility
export type IIntegrityRepository = IntegrityRepository;