/**
 * 🗃️ OmniSpace Adapter Registry
 * v1.0 | #OmniSpace #AdapterGovernance
 *
 * Central registry for all OmniSpace-compatible agent adapters.
 */
import { omniagentAdapter } from './omniagent-adapter';
export class AdapterRegistry {
    constructor() {
        this.adapters = new Map();
        this.initDefaultAdapters();
    }
    initDefaultAdapters() {
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
    registerAdapter(manifest) {
        console.log(`[AdapterRegistry] 📦 Registered adapter: ${manifest.adapterId} (v${manifest.version})`);
        this.adapters.set(manifest.adapterId, manifest);
    }
    getAdapter(adapterId) {
        return this.adapters.get(adapterId);
    }
    listAdapters() {
        return Array.from(this.adapters.values());
    }
}
export const adapterRegistry = new AdapterRegistry();
//# sourceMappingURL=adapter-registry.js.map