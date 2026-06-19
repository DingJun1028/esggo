/**
 * 🌐 Agent Shared Knowledge Database (代理共享知識庫)
 * 
 * A cross-agent knowledge pool. Agents can voluntarily publish entries here
 * for other agents and users to discover and learn from.
 * 
 * RLS Policy: public_read + shared_readwrite
 * — Anyone can read; only verified agents can write/publish.
 * 
 * 「知識即資產，共享即增幅」— Shared knowledge compounds in value.
 */

import { IKnowledgeEntry } from './agent-knowledge-db';
import { omniLogger, LogCategory } from './omniLogger';

export interface ISharedEntry extends IKnowledgeEntry {
    publishedByAgentId: string;
    publishedAt: number;
    usageCount: number;       // How many times this was referenced/used
    endorsements: string[];   // Agent IDs that endorsed this entry
}

/**
 * 🌿 AgentSharedKnowledgeDB: The collective intelligence pool across all agents.
 */
export class AgentSharedKnowledgeDB {
    private static pool: Map<string, ISharedEntry> = new Map();

    /**
     * Publish a personal knowledge entry to the shared pool.
     */
    static publish(entry: IKnowledgeEntry): ISharedEntry {
        const sharedEntry: ISharedEntry = {
            ...entry,
            publishedByAgentId: entry.agentId,
            publishedAt: Date.now(),
            usageCount: 0,
            endorsements: [],
        };

        this.pool.set(entry.id, sharedEntry);
        omniLogger.info(LogCategory.SYSTEM, `AgentSharedKnowledgeDB: Entry [${entry.title}] published by agent [${entry.agentId}].`);
        return sharedEntry;
    }

    /**
     * Query the shared pool. Optional filter by domain or tags.
     */
    static query(opts?: { domain?: IKnowledgeEntry['domain']; tag?: string; search?: string }): ISharedEntry[] {
        let results = Array.from(this.pool.values());

        if (opts?.domain) {
            results = results.filter(e => e.domain === opts.domain);
        }
        if (opts?.tag) {
            results = results.filter(e => e.tags.includes(opts.tag!));
        }
        if (opts?.search) {
            const q = opts.search.toLowerCase();
            results = results.filter(e =>
                e.title.toLowerCase().includes(q) ||
                e.content.toLowerCase().includes(q)
            );
        }

        return results.sort((a, b) => b.usageCount - a.usageCount);
    }

    /**
     * Get a specific shared entry by ID (increments usageCount).
     */
    static get(entryId: string): ISharedEntry | undefined {
        const entry = this.pool.get(entryId);
        if (entry) {
            entry.usageCount++;
            omniLogger.info(LogCategory.AI, `AgentSharedKnowledgeDB: Entry [${entryId}] accessed. Usage: ${entry.usageCount}`);
        }
        return entry;
    }

    /**
     * An agent endorses a shared entry (marks it as high-quality).
     */
    static endorse(agentId: string, entryId: string): boolean {
        const entry = this.pool.get(entryId);
        if (!entry) return false;
        if (entry.endorsements.includes(agentId)) return false; // already endorsed

        entry.endorsements.push(agentId);
        omniLogger.info(LogCategory.SYSTEM, `AgentSharedKnowledgeDB: Entry [${entryId}] endorsed by [${agentId}]. Total: ${entry.endorsements.length}`);
        return true;
    }

    /**
     * Remove an entry from the shared pool (only by the original publisher or system).
     */
    static unpublish(entryId: string, requestingAgentId?: string): boolean {
        const entry = this.pool.get(entryId);
        if (!entry) return false;
        if (requestingAgentId && entry.publishedByAgentId !== requestingAgentId) {
            omniLogger.info(LogCategory.SYSTEM, `AgentSharedKnowledgeDB: Unauthorized unpublish attempt by [${requestingAgentId}].`);
            return false;
        }

        this.pool.delete(entryId);
        omniLogger.info(LogCategory.SYSTEM, `AgentSharedKnowledgeDB: Entry [${entryId}] unpublished.`);
        return true;
    }

    /**
     * Leaderboard: Most used / most endorsed entries.
     */
    static leaderboard(limit: number = 10): ISharedEntry[] {
        return Array.from(this.pool.values())
            .sort((a, b) => (b.usageCount + b.endorsements.length * 3) - (a.usageCount + a.endorsements.length * 3))
            .slice(0, limit);
    }

    /**
     * Total count of entries in the shared pool.
     */
    static size(): number {
        return this.pool.size;
    }
}
