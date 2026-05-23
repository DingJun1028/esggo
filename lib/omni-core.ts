import { createHash } from 'crypto';
import type {
  IComponentCore,
  IEvidence,
  T5GateState,
  EternalMemory,
  EternalMemoryType,
} from '../types/omni-core';

// ============================================================
// 萬能心核引擎 - 5T Logic Gate Implementation
// ============================================================

async function sha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Secure Node.js fallback
  return createHash('sha256').update(text).digest('hex');
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class OmniCore {
  private static instance: OmniCore;
  private memoryStore: EternalMemory[] = [];

  static getInstance(): OmniCore {
    if (!OmniCore.instance) {
      OmniCore.instance = new OmniCore();
    }
    return OmniCore.instance;
  }

  // 5T Gate Validation
  validateT5Gate(evidence: IEvidence): T5GateState {
    return {
      tangible: Boolean(evidence.tangible_metric && evidence.tangible_metric.length > 0),
      traceable: Boolean(evidence.source_origin && evidence.source_origin.startsWith('/')),
      trackable: Boolean(evidence.lifecycle_hooks && evidence.lifecycle_hooks.length > 0),
      transparent: Boolean(evidence.formula_ref && evidence.formula_ref.includes('[')),
      trustworthy: false, // Only set after Hash Lock
    };
  }

  // Seal Data with Hash Lock (Trustworthy)
  async sealComponent(
    metric: string,
    source: string,
    formula: string
  ): Promise<IComponentCore> {
    const uuid = generateUUID();
    const timestamp = Date.now();

    const evidence: IEvidence = {
      tangible_metric: metric,
      source_origin: source,
      lifecycle_hooks: [`hook_${timestamp}_created`, `hook_${timestamp}_validated`],
      formula_ref: formula,
    };

    const payload = JSON.stringify({ uuid, timestamp, evidence });
    const hash_lock = await sha256(payload);

    const component: IComponentCore = Object.freeze({
      uuid,
      timestamp,
      version: '1.0.0',
      evidence,
      status: 'Trustworthy' as const,
      hash_lock,
    });

    return component;
  }

  // Verify Hash Lock
  async verifyComponent(component: IComponentCore): Promise<boolean> {
    const payload = JSON.stringify({
      uuid: component.uuid,
      timestamp: component.timestamp,
      evidence: component.evidence,
    });
    const computedHash = await sha256(payload);
    return computedHash === component.hash_lock;
  }

  // Store Eternal Memory
  async storeMemory(
    content: string,
    type: EternalMemoryType,
    tags: string[] = []
  ): Promise<EternalMemory> {
    const id = generateUUID();
    const timestamp = Date.now();
    const hash_lock = await sha256(`${id}:${content}:${timestamp}`);

    const memory: EternalMemory = {
      id,
      type,
      content,
      tags,
      timestamp,
      hash_lock,
      consolidated: false,
    };

    this.memoryStore.push(memory);
    return memory;
  }

  getMemories(): EternalMemory[] {
    return [...this.memoryStore];
  }

  // Consolidate memories (Simulated AI Aggregation)
  async consolidateMemories(type: EternalMemoryType): Promise<EternalMemory | null> {
    const targets = this.memoryStore.filter(m => m.type === type && !m.consolidated);
    
    if (targets.length < 2) return null;

    const combinedContent = targets.map(m => m.content).join('\n---\n');
    const summary = `[Consolidated Summary of ${targets.length} ${type} records]: ${combinedContent.substring(0, 100)}...`;
    
    const consolidatedRecord = await this.storeMemory(
      summary,
      type,
      ['consolidated', ...targets.flatMap(t => t.tags)]
    );

    // Mark originals as consolidated
    targets.forEach(t => {
      t.consolidated = true;
    });

    return consolidatedRecord;
  }

  // Quick hash for display
  async quickHash(text: string): Promise<string> {
    const full = await sha256(text);
    return `sha256:${full.substring(0, 16)}...`;
  }
}

export const omniCore = OmniCore.getInstance();