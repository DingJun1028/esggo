import { createHash } from 'crypto';
import type {
  IComponentCore,
  IEvidence,
  T5GateState,
  EternalMemory,
  EternalMemoryType,
} from '../types/omni-core';
import { supabase } from './supabase';

// ============================================================
// 萬能心核引擎 - 5T Logic Gate Implementation (Persistent)
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

  static getInstance(): OmniCore {
    if (!OmniCore.instance) {
      OmniCore.instance = new OmniCore();
    }
    return OmniCore.instance;
  }

  // Helper to get current user info for multi-tenancy
  private async getIdentity() {
    if (typeof window === 'undefined') return { user_id: 'system', company_id: 'default' };
    const local = localStorage.getItem('omni_user');
    if (local) {
      const parsed = JSON.parse(local);
      return { user_id: parsed.id || 'unknown', company_id: parsed.company_id || 'default' };
    }
    return { user_id: 'anonymous', company_id: 'default' };
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

  // Store Eternal Memory (Persistent in Supabase)
  async storeMemory(
    content: string,
    type: EternalMemoryType,
    tags: string[] = []
  ): Promise<EternalMemory> {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { user_id, company_id } = await this.getIdentity();
    const id = generateUUID();
    const timestamp = Date.now();
    const hash_lock = await sha256(`${id}:${content}:${timestamp}`);

    const memoryValue = { content, tags, raw: content };

    const { error } = await supabase
      .from('user_memory')
      .insert({
        id,
        user_id,
        company_id,
        memory_type: 'ai_conversation', // Mapping to schema type
        memory_key: `mem_${timestamp}`,
        memory_value: memoryValue,
        context: { tags, consolidated: false },
        hash_lock,
      });

    if (error) throw error;

    return {
      id,
      type,
      content,
      tags,
      timestamp,
      hash_lock,
      consolidated: false,
    };
  }

  async getMemories(): Promise<EternalMemory[]> {
    if (!supabase) return [];
    
    const { user_id, company_id } = await this.getIdentity();
    const { data, error } = await supabase
      .from('user_memory')
      .select('*')
      .eq('user_id', user_id)
      .eq('company_id', company_id)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(m => ({
      id: m.id,
      type: 'thought' as any, // Simple mapping
      content: m.memory_value?.content || '',
      tags: m.context?.tags || [],
      timestamp: new Date(m.created_at).getTime(),
      hash_lock: m.hash_lock,
      consolidated: m.context?.consolidated || false,
    }));
  }

  // Consolidate memories (High-Performance DB-Level Aggregation)
  async consolidateMemories(type: EternalMemoryType): Promise<EternalMemory | null> {
    if (!supabase) return null;

    const { user_id, company_id } = await this.getIdentity();
    
    // Call the RPC function we deployed in migrations
    const { data: consolidatedId, error } = await supabase.rpc('consolidate_eternal_memories', {
      p_user_id: user_id,
      p_company_id: company_id,
      p_memory_type: 'ai_conversation'
    });

    if (error || !consolidatedId) {
      console.warn('Consolidation failed or not enough records:', error?.message);
      return null;
    }

    // Fetch the new record to return it
    const { data: m } = await supabase
      .from('user_memory')
      .select('*')
      .eq('id', consolidatedId)
      .single();

    if (!m) return null;

    return {
      id: m.id,
      type,
      content: JSON.stringify(m.memory_value),
      tags: ['consolidated'],
      timestamp: new Date(m.created_at).getTime(),
      hash_lock: m.hash_lock,
      consolidated: true,
    };
  }

  // Quick hash for display
  async quickHash(text: string): Promise<string> {
    const full = await sha256(text);
    return `sha256:${full.substring(0, 16)}...`;
  }
}

export const omniCore = OmniCore.getInstance();