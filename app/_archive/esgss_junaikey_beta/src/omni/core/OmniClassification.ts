/**
 * 🏷️ OmniClassification: The Sovereign MECE System
 * --------------------------------------------------
 * [核心] MECE 分類與雙向連結系統 (Universal Classification System)
 * [功能] 自動分類、血緣標籤、雙向連結
 * [5T Alignment] Transparent (Taxonomy), Traceable (Hierarchy), Trackable (Lineage)
 */

import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

export interface MECECategory {
    id: string;
    name: string;
    parent?: string;
    children: string[];
    level: number;
}

export interface LineageTag {
    id: string;
    name: string;
    ancestors: string[]; // 祖先標籤
    descendants: string[]; // 後代標籤
    related: string[]; // 相關標籤
}

export interface BidirectionalLink {
    from: string;
    to: string;
    type: 'parent-child' | 'sibling' | 'related';
    strength: number;
}

export class OmniClassification {
    private static instance: OmniClassification;
    private categories: Map<string, MECECategory> = new Map();
    private tags: Map<string, LineageTag> = new Map();
    private links: BidirectionalLink[] = [];

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '🏷️ OmniClassification Initialized');
    }

    public static getInstance(): OmniClassification {
        if (!OmniClassification.instance) {
            OmniClassification.instance = new OmniClassification();
        }
        return OmniClassification.instance;
    }

    /**
     * 自動 MECE 分類 (Auto MECE Classification)
     */
    async autoClassify(content: string): Promise<string[]> {
        // 提取關鍵概念
        const concepts = this.extractConcepts(content);

        // MECE 分類
        const categories: string[] = [];

        for (const concept of concepts) {
            const category = await this.findOrCreateCategory(concept);
            categories.push(category);
        }

        omniLogger.info(LogCategory.SYSTEM, '🏷️ MECE classification completed', {
            categories_count: categories.length,
        });

        return categories;
    }

    /**
     * 創建血緣標籤 (Create Lineage Tag)
     */
    async createLineageTag(name: string, parent?: string): Promise<string> {
        const id = this.generateId();

        // 計算祖先
        const ancestors = parent ? this.getAncestors(parent) : [];

        const tag: LineageTag = {
            id,
            name,
            ancestors: [...ancestors, ...(parent ? [parent] : [])],
            descendants: [],
            related: [],
        };

        this.tags.set(id, tag);

        // 更新父標籤的後代
        if (parent) {
            const parentTag = this.tags.get(parent);
            if (parentTag) {
                parentTag.descendants.push(id);
            }
        }

        omniLogger.info(LogCategory.SYSTEM, '🧬 Lineage tag created', { tag_id: id, name });

        return id;
    }

    /**
     * 創建雙向連結 (Create Bidirectional Link)
     */
    createBidirectionalLink(
        from: string,
        to: string,
        type: 'parent-child' | 'sibling' | 'related',
        strength: number = 1.0
    ): void {
        // 創建正向連結
        this.links.push({ from, to, type, strength });

        // 創建反向連結
        const reverseType = type === 'parent-child' ? 'parent-child' : type;
        this.links.push({ from: to, to: from, type: reverseType, strength });

        omniLogger.info(LogCategory.SYSTEM, '🔗 Bidirectional link created', { from, to, type });
    }

    /**
     * 獲取相關項目 (Get Related Items)
     */
    getRelatedItems(id: string): string[] {
        return this.links.filter(link => link.from === id).map(link => link.to);
    }

    /**
     * 獲取祖先
     */
    private getAncestors(tagId: string): string[] {
        const tag = this.tags.get(tagId);
        return tag ? tag.ancestors : [];
    }

    /**
     * 提取概念
     */
    private extractConcepts(content: string): string[] {
        // 簡單實作，實際應該使用 NLP
        const words = content.split(/\s+/);
        return words.filter(w => w.length > 2).slice(0, 5);
    }

    /**
     * 找到或創建分類
     */
    private async findOrCreateCategory(concept: string): Promise<string> {
        // 搜尋現有分類
        for (const [id, category] of this.categories.entries()) {
            if (category.name === concept) {
                return id;
            }
        }

        // 創建新分類
        const id = this.generateId();
        const category: MECECategory = {
            id,
            name: concept,
            children: [],
            level: 0,
        };

        this.categories.set(id, category);
        return id;
    }

    /**
     * 獲取分類樹
     */
    getCategoryTree(): MECECategory[] {
        return Array.from(this.categories.values())
            .filter(c => !c.parent)
            .sort((a, b) => a.level - b.level);
    }

    private generateId(): string {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

export const omniClassification = OmniClassification.getInstance();
