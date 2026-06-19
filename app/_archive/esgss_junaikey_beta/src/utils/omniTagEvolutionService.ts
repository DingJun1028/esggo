import { OmniTag, TagEvent, TaggedResource, TagLineage } from '../types/omniTag';
import { OmniTagManager } from './omniTagManager';

/**
 * OmniTagEvolutionService: The core engine for the 
 * "Omni-directional Real-time Intelligent Bi-directional Auto-tracking Generative Tagging Mechanism".
 */
export class OmniTagEvolutionService {
    private static instance: OmniTagEvolutionService;
    private events: TagEvent[] = [];
    private lineages: Map<string, TagLineage> = new Map();
    private resources: Map<string, TaggedResource> = new Map();

    private constructor() { }

    public static getInstance(): OmniTagEvolutionService {
        if (!this.instance) {
            this.instance = new OmniTagEvolutionService();
        }
        return this.instance;
    }

    /**
     * Permanent Real-time Tracking: Record tag events as they happen.
     */
    public recordEvent(event: Omit<TagEvent, 'id' | 'timestamp'>): void {
        const newEvent: TagEvent = {
            ...event,
            id: `ev-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString()
        };
        this.events.push(newEvent);

        // Update Lineage
        let lineage = this.lineages.get(event.tagString);
        if (!lineage) {
            lineage = { tagString: event.tagString, history: [], parents: [], children: [] };
            this.lineages.set(event.tagString, lineage);
        }
        lineage.history.push(newEvent);

        console.log(`[OmniTag Evolution] Event Recorded: ${newEvent.action} -> ${newEvent.tagString} on ${event.resourceId}`);
    }

    /**
     * Generative Intelligence: Mock LLM-based tag generation.
     */
    public async generateTags(content: string, context: string = 'general'): Promise<string[]> {
        // In a real scenario, this would call a GPT/BERT model
        // Here we simulate AI intuition based on keywords
        const keywords: Record<string, string[]> = {
            'security': ['sys:sec:shield', 'sys:risk:high', 'user:status:monitored'],
            'data': ['sys:data:blob', 'infra:storage:nexus', 'sys:flow:active'],
            'creative': ['user:talent:art', 'sys:gen:ai', 'meta:concept:emerge'],
            'esg': ['esg:goal:netzero', 'esg:pillar:gov', 'sys:audit:pass']
        };

        const foundTags: string[] = [];
        Object.entries(keywords).forEach(([key, tags]) => {
            if (content.toLowerCase().includes(key)) {
                foundTags.push(...tags);
            }
        });

        // Add context tag
        foundTags.push(`ai:context:${context}`);

        return [...new Set(foundTags)];
    }

    /**
     * Bi-directional Tracking: Get resources by tag.
     */
    public getResourcesByTag(tagPattern: string): string[] {
        const results: string[] = [];
        this.resources.forEach((resource, id) => {
            const matches = resource.tags.some(t =>
                OmniTagManager.match(OmniTagManager.parse(t), tagPattern)
            );
            if (matches) results.push(id);
        });
        return results;
    }

    /**
     * Bi-directional Tracking: Get tags by resource.
     */
    public getResourceTags(resourceId: string): string[] {
        return this.resources.get(resourceId)?.tags || [];
    }

    /**
     * Weight Management & Auto-Cleaning: Cleanup low-weight tags.
     */
    public async autoCleanupResources(threshold: number = 0.2): Promise<number> {
        let cleanedCount = 0;
        this.resources.forEach((resource, id) => {
            if (resource.tagMetadata) {
                const survivors = resource.tags.filter(tag => {
                    const meta = resource.tagMetadata?.[tag];
                    return !meta || meta.weight >= threshold;
                });
                if (survivors.length < resource.tags.length) {
                    cleanedCount += (resource.tags.length - survivors.length);
                    resource.tags = survivors;
                    this.recordEvent({
                        resourceId: id,
                        tagString: 'system:cleanup:action',
                        action: 'updated',
                        origin: 'auto-evolution-engine'
                    });
                }
            }
        });
        return cleanedCount;
    }

    // Seed some data for visualization
    public seedMockData() {
        this.resources.set('res-001', {
            id: 'res-001',
            type: 'doc',
            tags: ['sys:sec:shield', 'esg:pillar:gov'],
            tagMetadata: {
                'sys:sec:shield': { confidence: 0.95, weight: 0.9 },
                'esg:pillar:gov': { confidence: 0.8, weight: 0.7 }
            }
        });
    }
}

export const tagEvolutionService = OmniTagEvolutionService.getInstance();
