import { sha256 } from '../crypto-proof.ts';
export class IntegrityModule {
    constructor(repository) {
        this.repository = repository;
    }
    async sealData(id, dataPayload) {
        const hash = await this.generateHash(dataPayload);
        const record = {
            id,
            hash,
            timestamp: new Date().toISOString(),
            status: 'verified',
        };
        await this.repository.saveRecord(record);
        return record;
    }
    async checkIntegrity(id, dataPayload) {
        const currentHash = await this.generateHash(dataPayload);
        return await this.repository.verifyHash(id, currentHash);
    }
    // 5T Compliance: Use crypto-proof SHA-256 for hardened hashing
    async generateHash(data) {
        return await sha256(data);
    }
}
//# sourceMappingURL=IntegrityModule.js.map