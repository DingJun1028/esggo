import { T5Validator } from './T5Protocol';
import { IComponentCore, IEvidence } from '../../lib/core-types';
import { COLLECTIONS, Contract, AuditLog, EvidenceRecord } from '../lib/firestore-types';
import { db } from '../../lib/firebase'; // Firebase client
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { UIRenderer, RenderParams } from './UIRenderer';
import { useThemeStore } from '../../lib/theme-store';

// ============================================
// 1. Integrated Evidence Service (Global Layer)
// ============================================
export class GlobalEvidenceService {
  static async createEvidenceRecord(
    record: Omit<EvidenceRecord, 'id' | 'timestamp'> & { evidence: IEvidence[] }
  ): Promise<EvidenceRecord> {
    const evidenceId = crypto.randomUUID();
    const evidenceRecord: EvidenceRecord = {
      id: evidenceId,
      timestamp: Date.now(),
      ...record,
    } as EvidenceRecord;

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
    } as IComponentCore);
    
    if (!isValid) throw new Error('Evidence failed 5T validation');
    
    await setDoc(doc(db, COLLECTIONS.EVIDENCE_RECORDS, evidenceId), evidenceRecord);
    return evidenceRecord;
  }
  
  static async logAudit(audit: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
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
  static async createContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) {
    const newContract: Contract = {
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
  renderWithTheme(params: RenderParams): string {
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
  private static instance: GlobalStateManager;
  private renderer = new IntegratedUIRenderer();
  
  static getInstance(): GlobalStateManager {
    if (!GlobalStateManager.instance) {
      GlobalStateManager.instance = new GlobalStateManager();
    }
    return GlobalStateManager.instance;
  }
  
  render(resonance: number): string {
    return this.renderer.render({
      resonanceValue: resonance,
      style: 'LiquidGlass',
      action: 'DiffusionRipple',
    });
  }
}