"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalStateManager = exports.IntegratedUIRenderer = exports.ContractService = exports.GlobalEvidenceService = void 0;
const T5Protocol_1 = require("./T5Protocol");
const firestore_types_1 = require("../lib/firestore-types");
const firebase_1 = require("../../lib/firebase"); // Firebase client
const firestore_1 = require("firebase/firestore");
const UIRenderer_1 = require("./UIRenderer");
const theme_store_1 = require("../../lib/theme-store");
// ============================================
// 1. Integrated Evidence Service (Global Layer)
// ============================================
class GlobalEvidenceService {
    static async createEvidenceRecord(record) {
        const evidenceId = crypto.randomUUID();
        const evidenceRecord = {
            id: evidenceId,
            timestamp: Date.now(),
            ...record,
        };
        // Validate with 5T Protocol
        const isValid = await T5Protocol_1.T5Validator.validate({
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
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, firestore_types_1.COLLECTIONS.EVIDENCE_RECORDS, evidenceId), evidenceRecord);
        return evidenceRecord;
    }
    static async logAudit(audit) {
        const log = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...audit,
        };
        await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, firestore_types_1.COLLECTIONS.AUDIT_LOGS), log);
    }
}
exports.GlobalEvidenceService = GlobalEvidenceService;
// ============================================
// 2. Integrated Contract Service
// ============================================
class ContractService {
    static async createContract(contract) {
        const newContract = {
            id: crypto.randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
            ...contract,
        };
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, firestore_types_1.COLLECTIONS.CONTRACTS, newContract.id), newContract);
        return newContract;
    }
}
exports.ContractService = ContractService;
// ============================================
// 3. Integrated UI Renderer
// ============================================
class IntegratedUIRenderer extends UIRenderer_1.UIRenderer {
    renderWithTheme(params) {
        const { sidebarTheme } = theme_store_1.useThemeStore.getState();
        const base = super.render(params);
        if (sidebarTheme === 'glass') {
            return `${base} [Glass Mode]`;
        }
        return base;
    }
}
exports.IntegratedUIRenderer = IntegratedUIRenderer;
// ============================================
// 4. Global State Manager
// ============================================
class GlobalStateManager {
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
exports.GlobalStateManager = GlobalStateManager;
//# sourceMappingURL=GlobalIntegration.js.map