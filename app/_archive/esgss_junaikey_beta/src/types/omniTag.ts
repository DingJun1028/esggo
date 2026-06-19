/**
 * OmniTag: The fundamental semantic unit of the JunAiKey system.
 * Structure follows: namespace:category:value
 */
export interface OmniTag {
    namespace: string;    // e.g., "sys", "user", "game", "esg", "ai"
    category: string;     // e.g., "role", "element", "status", "domain"
    value: string;        // e.g., "admin", "fire", "verified", "nexus"
    label?: string;       // Human readable name (i18n support)
    color?: string;       // Visual representation
    icon?: string;        // Icon identifier (Lucide or Emoji)
    description?: string; // Detailed meaning
    metadata?: Record<string, any>;
    aliases?: string[];   // For semantic resonance and search expansion
    level?: number;       // For hierarchical depth
    weight?: number;      // Dynamic weight (0-1) based on relevance/usage
    isSensitive?: boolean; // GDPR/Security compliance flag
    generatedBy?: 'ai' | 'system' | 'user';
    createdAt: string;
    updatedAt: string;
}

export interface TagEvent {
    id: string;
    resourceId: string;
    tagString: string;
    action: 'added' | 'removed' | 'updated' | 'merged' | 'split';
    timestamp: string;
    origin: string; // Service or User ID
    metadata?: Record<string, any>;
}

export interface TagLineage {
    tagString: string;
    history: TagEvent[];
    parents: string[]; // For merged tags
    children: string[]; // For split tags
}

export interface FiveTCertification {
    tangible: boolean;   // Visual feedback loops
    traceable: boolean;  // Origin source log
    trackable: boolean;  // Lifecycle hooks
    transparent: boolean;// Open algorithms
    trustworthy: boolean;// Immutable seal
    certifiedAt?: string;
    sealHash?: string;    // Verification hash
}

/**
 * TaggedResource: Any entity that can be annotated by OmniTags.
 */
export interface TaggedResource {
    id: string;
    type: string;         // e.g., "doc", "user", "api", "node"
    tags: string[];       // Array of tag strings (namespace:category:value)
    tagMetadata?: Record<string, {
        confidence: number;
        weight: number;
        lastVerified?: string;
        certification?: FiveTCertification;
    }>;
    resourceCertification?: FiveTCertification;
    lineageId?: string;
}

/**
 * OmniTagSchema: Defines the rules and constraints for a specific namespace/category.
 */
export interface OmniTagSchema {
    namespace: string;
    category: string;
    allowedValues?: string[];
    isUnique?: boolean; // If only one tag of this type can exist per resource
    parent?: { namespace: string; category: string }; // For hierarchy
}

export type TagString = string; // Format: namespace:category:value
