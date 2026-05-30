/**
 * 🗃️ OmniSpace Adapter Registry
 * v1.0 | #OmniSpace #AdapterGovernance
 * 
 * Central registry for all OmniSpace-compatible agent adapters.
 */

import { omniagentAdapter } from './omniagent-adapter';
import type { TranscriptEntry, InferenceProvider, OmniAgentSkill } from './omniagent-adapter';

export interface AdapterManifest {
   adapterId: string;
   name: string;
   version: string;
   capabilities: string[];
   execute: (sessionId: string, prompt: string, context?: unknown) => Promise<TranscriptEntry[]>;
   detectModel: () => Promise<{ model: string; provider: InferenceProvider }>;
   listSkills: () => Promise<OmniAgentSkill[]>;
}

export class AdapterRegistry {
  private adapters: Map<string, AdapterManifest> = new Map();

  constructor() {
    this.initDefaultAdapters();
  }

  private initDefaultAdapters() {
    // 1. Register OmniAgent Local Adapter
    this.registerAdapter({
      adapterId: 'omniagent_local',
      name: 'OmniSpace OmniAgent Paperclip Adapter',
      version: '1.0.0',
      capabilities: [
        'Multi-provider Inference',
        'Persistent Memory',
        '30+ Native Tools',
        '80+ loadable skills',
        'Session FTS5 Search',
        'Structured Transcript Parsing'
      ],
      execute: omniagentAdapter.execute.bind(omniagentAdapter),
      detectModel: omniagentAdapter.detectModel.bind(omniagentAdapter),
      listSkills: omniagentAdapter.listSkills.bind(omniagentAdapter)
    });
  }

  public registerAdapter(manifest: AdapterManifest): void {
    console.log(`[AdapterRegistry] 📦 Registered adapter: ${manifest.adapterId} (v${manifest.version})`);
    this.adapters.set(manifest.adapterId, manifest);
  }

  public getAdapter(adapterId: string): AdapterManifest | undefined {
    return this.adapters.get(adapterId);
  }

  public listAdapters(): AdapterManifest[] {
    return Array.from(this.adapters.values());
  }
}

export const adapterRegistry = new AdapterRegistry();
