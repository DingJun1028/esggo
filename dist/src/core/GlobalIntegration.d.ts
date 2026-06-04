import { IEvidence } from '../../lib/core-types';
import { Contract, AuditLog, EvidenceRecord } from '../lib/firestore-types';
import { UIRenderer, RenderParams } from './UIRenderer';
export declare class GlobalEvidenceService {
    static createEvidenceRecord(record: Omit<EvidenceRecord, 'id' | 'timestamp'> & {
        evidence: IEvidence[];
    }): Promise<EvidenceRecord>;
    static logAudit(audit: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void>;
}
export declare class ContractService {
    static createContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>): Promise<Contract>;
}
export declare class IntegratedUIRenderer extends UIRenderer {
    renderWithTheme(params: RenderParams): string;
}
export declare class GlobalStateManager {
    private static instance;
    private renderer;
    static getInstance(): GlobalStateManager;
    render(resonance: number): string;
}
//# sourceMappingURL=GlobalIntegration.d.ts.map