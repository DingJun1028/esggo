/**
 * Redundancy Validator
 * Ensures "不得重複" (No-Repeat) behavior by tracking data points used across the report.
 */

export interface UsageReference {
    reportId: string;
    chapterId: string;
    timestamp: number;
    usageContext: string;
}

// In-memory registry for demonstration; in production this maps to Firestore
class RedundancyValidatorService {
    private registry: Map<string, UsageReference[]> = new Map();

    /**
     * Mark a data atom (nodeId) as consumed by a specific chapter
     */
    registerUsage(nodeId: string, ref: UsageReference) {
        const existing = this.registry.get(nodeId) || [];
        // Check if already used in this chapter
        if (existing.some(r => r.chapterId === ref.chapterId)) return;

        this.registry.set(nodeId, [...existing, ref]);
    }

    /**
     * Check if a node is used elsewhere
     */
    getUsage(nodeId: string): UsageReference[] {
        return this.registry.get(nodeId) || [];
    }

    /**
     * Validation check for "Primary Usage" constraint
     */
    isRepeat(nodeId: string, currentChapterId: string): boolean {
        const usage = this.registry.get(nodeId);
        if (!usage) return false;

        // If it's used in and ONLY in the current chapter, it's not a "repeat" for this context
        return usage.some(u => u.chapterId !== currentChapterId);
    }

    reset() {
        this.registry.clear();
    }
}

export const RedundancyValidator = new RedundancyValidatorService();
