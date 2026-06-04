import { IIntegrityRepository, IntegrityRecord } from './IIntegrityRepository';
export declare class SupabaseIntegrityRepository implements IIntegrityRepository {
    saveRecord(record: IntegrityRecord): Promise<void>;
    getRecord(id: string): Promise<IntegrityRecord | null>;
    verifyHash(id: string, currentHash: string): Promise<boolean>;
}
//# sourceMappingURL=SupabaseIntegrityRepository.d.ts.map