import { IOmniAtom } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 📚 AgentKnowledgeBase - 代理知識庫核心類別
 * 支援個人知識庫和共享知識庫，使用 UUID 區分不同的知識條目
 * 🏗️ v1.0: Initial implementation for agent knowledge management
 */

export interface AgentKnowledgeEntry {
    id: string;
    uuid: string;
    title: string;
    content: string;
    domain: string;
    tags: string[];
    author: string;
    authorId: string;
    agentId?: string;
    createdAt: number;
    updatedAt: number;
    accessCount: number;
    isPublic: boolean;
    isFavorite: boolean;
    isCrystallized: boolean;
    sharedAgents: string[];
    source?: string;
}

export class AgentKnowledgeBase {
    // 個人知識庫 - 每個代理的專屬知識
    private static personalKnowledge = new Map<string, Map<string, AgentKnowledgeEntry>>();
    
    // 共享知識庫 - 跨代理共享的知識
    private static sharedKnowledge = new Map<string, AgentKnowledgeEntry>();

    // 代理列表
    private static agents = new Map<string, { id: string; uuid: string; name: string; role: string; personality: string }>();

    /**
     * 🔧 初始化代理知識庫
     */
    public static initialize(): void {
        omniLogger.info(LogCategory.SYSTEM, 'AgentKnowledgeBase: Initializing agent knowledge base system');
        
        // 初始化一些範例代理
        this.agents.set('agent-001', {
            id: 'agent-001',
            uuid: 'agent-uuid-001-aaaa-bbbb-cccc-dddd11112222',
            name: 'Thoth',
            role: 'SENTINEL',
            personality: 'STOIC'
        });
        
        this.agents.set('agent-002', {
            id: 'agent-002',
            uuid: 'agent-uuid-002-eeee-ffff-1111-222233334444',
            name: 'EcoSentinel',
            role: 'ANALYST',
            personality: 'ANALYTICAL'
        });
        
        this.agents.set('agent-003', {
            id: 'agent-003',
            uuid: 'agent-uuid-003-5555-6666-7777-888899990000',
            name: 'FinanceOracle',
            role: 'AUDITOR',
            personality: 'EMPATHETIC'
        });
        
        this.agents.set('agent-004', {
            id: 'agent-004',
            uuid: 'agent-uuid-004-aaaa-bbbb-cccc-dddd55556666',
            name: 'RatingAnalyzer',
            role: 'SHEPHERD',
            personality: 'ENTHUSIASTIC'
        });

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeBase: Initialized ${this.agents.size} agents`);
    }

    /**
     * 🆔 產生 UUID
     */
    public static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * 📝 建立知識條目
     */
    public static createEntry(
        agentId: string,
        title: string,
        content: string,
        domain: string,
        tags: string[] = [],
        options?: { isPublic?: boolean; source?: string }
    ): AgentKnowledgeEntry {
        const now = Date.now();
        const entry: AgentKnowledgeEntry = {
            id: `kb-${this.generateUUID()}`,
            uuid: this.generateUUID(),
            title,
            content,
            domain,
            tags,
            author: this.agents.get(agentId)?.name || 'Unknown',
            authorId: agentId,
            agentId,
            createdAt: now,
            updatedAt: now,
            accessCount: 0,
            isPublic: options?.isPublic || false,
            isFavorite: false,
            isCrystallized: false,
            sharedAgents: [],
            source: options?.source
        };

        // 初始化代理的個人知識庫 Map（如果不存在）
        if (!this.personalKnowledge.has(agentId)) {
            this.personalKnowledge.set(agentId, new Map());
        }

        // 儲存到個人知識庫
        this.personalKnowledge.get(agentId)!.set(entry.uuid, entry);

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeBase: Created knowledge entry ${entry.uuid} for agent ${agentId}`);

        return entry;
    }

    /**
     * 📖 取得個人知識庫
     */
    public static getPersonalKnowledge(agentId: string): AgentKnowledgeEntry[] {
        const agentKB = this.personalKnowledge.get(agentId);
        if (!agentKB) return [];
        
        return Array.from(agentKB.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    }

    /**
     * 🌐 取得共享知識庫
     */
    public static getSharedKnowledge(filters?: { domain?: string; searchQuery?: string }): AgentKnowledgeEntry[] {
        let entries = Array.from(this.sharedKnowledge.values());

        if (filters?.domain && filters.domain !== 'all') {
            entries = entries.filter(e => e.domain === filters.domain);
        }

        if (filters?.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            entries = entries.filter(e => 
                e.title.toLowerCase().includes(query) ||
                e.content.toLowerCase().includes(query) ||
                e.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return entries.sort((a, b) => b.accessCount - a.accessCount);
    }

    /**
     * 🔍 搜尋知識（跨個人和共享）
     */
    public static searchKnowledge(agentId: string, query: string): AgentKnowledgeEntry[] {
        const results: AgentKnowledgeEntry[] = [];
        const lowerQuery = query.toLowerCase();

        // 搜尋個人知識庫
        const personalKB = this.personalKnowledge.get(agentId);
        if (personalKB) {
            personalKB.forEach(entry => {
                if (
                    entry.title.toLowerCase().includes(lowerQuery) ||
                    entry.content.toLowerCase().includes(lowerQuery) ||
                    entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
                ) {
                    results.push(entry);
                }
            });
        }

        // 搜尋共享知識庫（僅搜尋公開的）
        this.sharedKnowledge.forEach(entry => {
            if (entry.isPublic && (
                entry.title.toLowerCase().includes(lowerQuery) ||
                entry.content.toLowerCase().includes(lowerQuery) ||
                entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
            )) {
                results.push(entry);
            }
        });

        return results;
    }

    /**
     * ⭐ 切換收藏狀態
     */
    public static toggleFavorite(agentId: string, entryUuid: string): boolean {
        const agentKB = this.personalKnowledge.get(agentId);
        if (!agentKB) return false;

        const entry = agentKB.get(entryUuid);
        if (!entry) return false;

        entry.isFavorite = !entry.isFavorite;
        entry.updatedAt = Date.now();

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeBase: Toggled favorite for ${entryUuid} to ${entry.isFavorite}`);

        return entry.isFavorite;
    }

    /**
     * 💎 結晶化知識條目
     */
    public static crystallize(agentId: string, entryUuid: string): boolean {
        const agentKB = this.personalKnowledge.get(agentId);
        if (!agentKB) return false;

        const entry = agentKB.get(entryUuid);
        if (!entry) return false;

        entry.isCrystallized = true;
        entry.updatedAt = Date.now();

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeBase: Crystallized knowledge entry ${entryUuid}`);

        return true;
    }

    /**
     * 📤 分享到共享知識庫
     */
    public static shareToShared(agentId: string, entryUuid: string, isPublic: boolean = false): AgentKnowledgeEntry | null {
        const agentKB = this.personalKnowledge.get(agentId);
        if (!agentKB) return null;

        const entry = agentKB.get(entryUuid);
        if (!entry) return null;

        const sharedEntry: AgentKnowledgeEntry = {
            ...entry,
            id: `shared-${this.generateUUID()}`,
            uuid: this.generateUUID(),
            isPublic
        };

        this.sharedKnowledge.set(sharedEntry.uuid, sharedEntry);

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeBase: Shared knowledge entry ${entryUuid} to shared KB`);

        return sharedEntry;
    }

    /**
     * 📥 從共享知識庫匯入到個人知識庫
     */
    public static importFromShared(agentId: string, sharedUuid: string): AgentKnowledgeEntry | null {
        const sharedEntry = this.sharedKnowledge.get(sharedUuid);
        if (!sharedEntry) return null;

        const personalEntry: AgentKnowledgeEntry = {
            ...sharedEntry,
            id: `kb-${this.generateUUID()}`,
            uuid: this.generateUUID(),
            agentId,
            author: this.agents.get(agentId)?.name || 'Unknown',
            authorId: agentId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            accessCount: 0,
            isFavorite: false,
            isCrystallized: false,
            source: sharedUuid
        };

        if (!this.personalKnowledge.has(agentId)) {
            this.personalKnowledge.set(agentId, new Map());
        }

        this.personalKnowledge.get(agentId)!.set(personalEntry.uuid, personalEntry);

        // 增加原始條目的存取次數
        sharedEntry.accessCount++;

        omniLogger.info(LogCategory.SYSTEM, `AgentKnowledgeBase: Imported shared entry ${sharedUuid} to agent ${agentId}`);

        return personalEntry;
    }

    /**
     * 📊 取得代理統計
     */
    public static getAgentStats(agentId: string): { total: number; favorites: number; crystallized: number } {
        const agentKB = this.personalKnowledge.get(agentId);
        if (!agentKB) return { total: 0, favorites: 0, crystallized: 0 };

        const entries = Array.from(agentKB.values());
        return {
            total: entries.length,
            favorites: entries.filter(e => e.isFavorite).length,
            crystallized: entries.filter(e => e.isCrystallized).length
        };
    }

    /**
     * 👥 取得所有代理
     */
    public static getAgents(): Array<{ id: string; uuid: string; name: string; role: string; personality: string }> {
        return Array.from(this.agents.values());
    }

    /**
     * 🧹 清除數據（僅用於開發）
     */
    public static clear(): void {
        this.personalKnowledge.clear();
        this.sharedKnowledge.clear();
        omniLogger.info(LogCategory.SYSTEM, 'AgentKnowledgeBase: Cleared all knowledge data');
    }
}

// 初始化
if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'test') {
    AgentKnowledgeBase.initialize();
}
