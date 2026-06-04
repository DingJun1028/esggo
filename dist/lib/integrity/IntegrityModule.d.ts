import type { IntegrityRepository, IntegrityRecord } from './IIntegrityRepository';
export declare class IntegrityModule {
    private readonly repository;
    constructor(repository: IntegrityRepository);
    sealData(id: string, dataPayload: string): Promise<IntegrityRecord>;
    checkIntegrity(id: string, dataPayload: string): Promise<boolean>;
    private generateHash;
}
//# sourceMappingURL=IntegrityModule.d.ts.map