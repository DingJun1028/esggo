import { T5Validator } from './T5Protocol';
import { COLLECTIONS } from '../lib/firestore-types';
import { db } from '../../lib/firebase'; // Firebase client
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { UIRenderer } from './UIRenderer';
import { useThemeStore } from '../../lib/theme-store';
// ============================================
// 1. Integrated Evidence Service (Global Layer)
// ============================================
export class GlobalEvidenceService {
    static async createEvidenceRecord(record) {
        const evidenceId = crypto.randomUUID();
        const evidenceRecord = {
            id: evidenceId,
            timestamp: Date.now(),
            ...record,
        };
        // Validate with 5T Protocol
        const isValid = await T5Validator.validate({
            uuid: record.uuid,
            version: record.version,
            timestamp: Date.now(),
            evidence: record.evidence,
            formula: '', // optional placeholder
            impact_metric: '', // optional placeholder
            status: 'Trustworthy',
            hash_lock: 'temp-lock'
        });
        if (!isValid)
            throw new Error('Evidence failed 5T validation');
        await setDoc(doc(db, COLLECTIONS.EVIDENCE_RECORDS, evidenceId), evidenceRecord);
        return evidenceRecord;
    }
    static async logAudit(audit) {
        const log = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...audit,
        };
        await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), log);
    }
}
// ============================================
// 2. Integrated Contract Service
// ============================================
export class ContractService {
    static async createContract(contract) {
        const newContract = {
            id: crypto.randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
            ...contract,
        };
        await setDoc(doc(db, COLLECTIONS.CONTRACTS, newContract.id), newContract);
        return newContract;
    }
}
// ============================================
// 3. Integrated UI Renderer
// ============================================
export class IntegratedUIRenderer extends UIRenderer {
    renderWithTheme(params) {
        const { sidebarTheme } = useThemeStore.getState();
        const base = super.render(params);
        if (sidebarTheme === 'glass') {
            return `${base} [Glass Mode]`;
        }
        return base;
    }
}
// ============================================
// 4. Global State Manager
// ============================================
export class GlobalStateManager {
    constructor() {
        this.renderer = new IntegratedUIRenderer();
    }
    static getInstance() {
        if (!GlobalStateManager.instance) {
            GlobalStateManager.instance = new GlobalStateManager();
        }
        return GlobalStateManager.instance;
    }
    render(resonance) {
        return this.renderer.render({
            resonanceValue: resonance,
            style: 'LiquidGlass',
            action: 'DiffusionRipple',
        });
    }
}
//# sourceMappingURL=GlobalIntegration.js.map