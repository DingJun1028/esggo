import { OmniTag, TagString, FiveTCertification, TaggedResource } from '@/types/omniTag';
import { omniLogger, LogCategory } from '@/services/omniLogger';

/**
 * 🏷️ OmniTagService
 * --------------------------------------------------
 * Centralized logic for the "Universal Tagging" system (OmniTags)
 * and 5T Protocol Governance.
 */
export class OmniTagService {
    private static instance: OmniTagService;
    private resources: Map<string, TaggedResource> = new Map();

    private constructor() { }

    public static getInstance(): OmniTagService {
        if (!this.instance) {
            this.instance = new OmniTagService();
        }
        return this.instance;
    }

    /**
     * 🏷️ Create Tag String
     */
    public createTagString(namespace: string, category: string, value: string): TagString {
        return `${namespace}:${category}:${value}`;
    }

    /**
     * 🛡️ Verify 5T Certification
     */
    public verify5T(resource: TaggedResource): FiveTCertification {
        // Mock verification logic based on metadata and tags
        const tags = resource.tags;
        const hasSource = tags.some(t => t.startsWith('sys:src:'));
        const hasHash = tags.some(t => t.startsWith('sys:hash:'));

        return {
            tangible: true, // Always true if it exists
            traceable: hasSource,
            trackable: resource.type === 'node' || resource.type === 'doc',
            transparent: true,
            trustworthy: hasHash,
            certifiedAt: new Date().toISOString(),
            sealHash: `SHA-256-${Math.random().toString(36).substring(7)}`
        };
    }

    /**
     * 🔄 Sync Resource
     */
    public syncResource(resource: TaggedResource): void {
        const cert = this.verify5T(resource);
        const updatedResource = {
            ...resource,
            resourceCertification: cert
        };
        this.resources.set(resource.id, updatedResource);

        omniLogger.info(LogCategory.SYSTEM, `[OmniTag] Resource ${resource.id} synced with 5T Protocol.`, {
            certification: cert
        });
    }

    /**
     * 📡 Get All Tags for Resource
     */
    public getResource(id: string): TaggedResource | undefined {
        return this.resources.get(id);
    }
}

export const omniTagService = OmniTagService.getInstance();
