import type { IntegrityRepository, IntegrityRecord } from './IIntegrityRepository';
import { sha256 } from '../crypto-proof';

export class IntegrityModule {
    constructor(private readonly repository: IntegrityRepository) { }

    async sealData(id: string, dataPayload: string): Promise<IntegrityRecord> {
        const hash = await this.generateHash(dataPayload);
        const record: IntegrityRecord = {
            id,
            hash,
            timestamp: new Date().toISOString(),
            status: 'verified',
        };

        await this.repository.saveRecord(record);
        return record;
    }

    async checkIntegrity(id: string, dataPayload: string): Promise<boolean> {
        const currentHash = await this.generateHash(dataPayload);
        return await this.repository.verifyHash(id, currentHash);
    }

    // 5T Compliance: Use crypto-proof SHA-256 for hardened hashing
    private async generateHash(data: string): Promise<string> {
        return await sha256(data);
    }
}