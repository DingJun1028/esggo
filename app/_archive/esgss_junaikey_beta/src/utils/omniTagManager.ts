import { OmniTag, TagString } from '../types/omniTag';

/**
 * OmniTagManager: Utility for parsing, formatting, and matching tags.
 */
export const OmniTagManager = {
    /**
     * Parse a string like "sys:role:admin" into an OmniTag object.
     */
    parse(tagStr: TagString): Partial<OmniTag> {
        const parts = tagStr.split(':');
        return {
            namespace: parts[0] || 'unknown',
            category: parts[1] || 'default',
            value: parts[2] || 'none'
        };
    },

    /**
     * Format an OmniTag object back into a string.
     */
    stringify(tag: Partial<OmniTag>): TagString {
        return `${tag.namespace || 'unknown'}:${tag.category || 'default'}:${tag.value || 'none'}`;
    },

    /**
     * Check if a tag matches a pattern (supports wildcards).
     * pattern: "sys:role:*" or "*:*:admin"
     */
    match(tag: Partial<OmniTag>, pattern: string): boolean {
        const pParts = pattern.split(':');
        const tParts = [tag.namespace, tag.category, tag.value];

        return pParts.every((p, i) => p === '*' || p === tParts[i]);
    },

    /**
     * Generate common styling or color based on namespace.
     */
    getNamespaceTheme(namespace: string): { color: string; icon: string } {
        const themes: Record<string, { color: string; icon: string }> = {
            sys: { color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: 'Settings' },
            user: { color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: 'User' },
            esg: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: 'ShieldCheck' },
            ai: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: 'Sparkles' },
            game: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: 'Zap' },
        };
        return themes[namespace] || { color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', icon: 'Hash' };
    }
};

/**
 * Initial Registry of Core Tags (Ontology)
 */
export const CORE_OMNI_TAGS: OmniTag[] = [
    { namespace: 'sys', category: 'status', value: 'verified', label: '已驗證', icon: 'CheckCircle', color: '#10b981' },
    { namespace: 'sys', category: 'access', value: 'internal', label: '內部專用', icon: 'Lock', color: '#6366f1' },
    { namespace: 'user', category: 'role', value: 'summoner', label: '召喚使', icon: 'Key', color: '#fbbf24' },
    { namespace: 'esg', category: 'pillar', value: 'governance', label: '公司治理', icon: 'Scale', color: '#3b82f6' },
    { namespace: 'ai', category: 'trust', value: 'high', label: '高信賴度', icon: 'Star', color: '#8b5cf6' },
];
