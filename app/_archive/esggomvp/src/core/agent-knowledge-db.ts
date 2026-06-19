/**
 * 🧠 Agent Knowledge Database (代理個人知識庫)
 * 
 * Each agent has an isolated personal knowledge store.
 * Only the owning agent (by agentId) can read/write its entries.
 * 
 * 「服務即教學，知識即資產」— Each entry is a sealed knowledge asset.
 */

import { omniLogger, LogCategory } from './omniLogger';

export interface IKnowledgeEntry {
    id: string;           // UUID
    agentId: string;      // Owner agent ID
    title: string;
    content: string;
    domain: 'E' | 'S' | 'G' | 'T' | 'General'; // ESG domain
    tags: string[];
    createdAt: number;
    updatedAt: number;
    isShared?: boolean;   // If true, also published to the shared DB
    hashLock?: string;    // SHA-256 hash for immutability verification
}

/**
 * 🔒 AgentKnowledgeDB: Personal, isolated knowledge store per agent.
 */
export class AgentKnowledgeDB {
    private static store: Map<string, IKnowledgeEntry[]> = new Map();

    /**
     * Add a knowledge entry for a specific agent.
     */
    static add(entry: Omit<IKnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): IKnowledgeEntry {
        const now = Date.now();
        const newEntry: IKnowledgeEntry = {
            ...entry,
            id: `ke_${now}_${Math.random().toString(36).slice(2, 7)}`,
            createdAt: now,
            updatedAt: now,
        };

        const existing = this.store.get(entry.agentId) || [];
        existing.push(newEntry);
        this.store.set(entry.agentId, existing);

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeDB: Entry [${newEntry.title}] saved for agent [${entry.agentId}].`);

        // Auto-publish to shared DB if flagged (dynamic import avoids circular dep)
        if (entry.isShared) {
            import('./agent-shared-knowledge-db').then(({ AgentSharedKnowledgeDB }) => {
                AgentSharedKnowledgeDB.publish(newEntry);
            });
        }

        return newEntry;
    }

    /**
     * Query all entries for a given agent.
     */
    static query(agentId: string, domain?: IKnowledgeEntry['domain']): IKnowledgeEntry[] {
        const entries = this.store.get(agentId) || [];
        if (domain) return entries.filter(e => e.domain === domain);
        return entries;
    }

    /**
     * Get a single entry by ID (only if it belongs to the given agent).
     */
    static get(agentId: string, entryId: string): IKnowledgeEntry | undefined {
        return this.query(agentId).find(e => e.id === entryId);
    }

    /**
     * Update an existing entry.
     */
    static update(agentId: string, entryId: string, patch: Partial<IKnowledgeEntry>): IKnowledgeEntry | null {
        const entries = this.store.get(agentId) || [];
        const idx = entries.findIndex(e => e.id === entryId);
        if (idx === -1) return null;

        entries[idx] = { ...entries[idx], ...patch, updatedAt: Date.now() };
        this.store.set(agentId, entries);

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeDB: Entry [${entryId}] updated.`);
        return entries[idx];
    }

    /**
     * Delete an entry owned by the agent.
     */
    static delete(agentId: string, entryId: string): boolean {
        const entries = this.store.get(agentId) || [];
        const filtered = entries.filter(e => e.id !== entryId);
        if (filtered.length === entries.length) return false;

        this.store.set(agentId, filtered);
        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeDB: Entry [${entryId}] removed from agent [${agentId}].`);
        return true;
    }

    /**
     * List all agent IDs that have knowledge entries.
     */
    static listAgentIds(): string[] {
        return Array.from(this.store.keys());
    }
}
