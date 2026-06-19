import { IOmniTag, IOmniAtom, IOmniSpaceTime } from './omni-types';
import { ost } from './omni-space-time';

/**
 * 🏷️ OmniTagEngine: 萬能標籤運算引擎
 * 職責：自動化語義分析與 5T 標籤分配
 */
export class OmniTagEngine {

    /**
     * 🧠 inferTags: 根據 payload 內容推論標籤
     */
    public static inferTags(payload: any): IOmniTag[] {
        const tags: IOmniTag[] = [];
        const content = JSON.stringify(payload).toLowerCase();
        const spaceTime = ost.capture();

        // 核心語義映射表
        const dictionary: Array<{ key: string; tag: string; category: IOmniTag['category'] }> = [
            { key: 'carbon', tag: '#Carbon_Footprint', category: 'Asset' },
            { key: 'emission', tag: '#Environmental_Impact', category: 'Process' },
            { key: 'diversity', tag: '#Social_Responsibility', category: 'Identity' },
            { key: 'board', tag: '#Governance_Structure', category: 'Identity' },
            { key: 'prediction', tag: '#Future_Gnosis', category: 'Insight' },
            { key: 'urgent', tag: '#Priority_High', category: 'Process' },
            { key: 'policy', tag: '#Policy_Alert', category: 'Process' },
            { key: 'competitor', tag: '#Competitor_Watch', category: 'Identity' },
            { key: 'market', tag: '#Market_Intelligence', category: 'Asset' },
        ];

        dictionary.forEach(entry => {
            if (content.includes(entry.key.toLowerCase())) {
                tags.push(this.createTag(entry.tag, entry.category, spaceTime));
            }
        });

        // 預設標籤
        if (tags.length === 0) {
            tags.push(this.createTag('#Omni_General', 'Insight', spaceTime));
        }

        return tags;
    }

    private static createTag(semantic: string, category: IOmniTag['category'], spaceTime: IOmniSpaceTime): IOmniTag {
        return {
            id: `tag-${Math.random().toString(36).slice(2, 9)}`,
            semantic,
            dimension: 'AI_Inferred',
            weight: 0.85,
            category,
            reliability: 0.92,
            spaceTime
        };
    }
}
