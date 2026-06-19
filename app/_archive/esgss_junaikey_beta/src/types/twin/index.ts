
import { IComponentCore } from '../core/index.js'; // Assuming standard core types export
import { UserAvatarProfile } from '../user.js';
import { EsgCard } from '../esg/index.js';

/**
 * 🏛️ Digital Twin Core (5T Identity)
 * Base interface for all 5T-compliant identities.
 */
export interface IDigitalTwin extends IComponentCore {
    twinId: string; // Unique Twin UUID (separate from DB ID)
    displayName: string;
    description: string;
    type: 'PERSONAL' | 'CORPORATE';
    level: number;
    impactScore: number;

    // 5T Identity Attributes
    attributes: {
        tangible: boolean;   // Has Visual Representation?
        traceable: boolean;  // Has Verified Origin?
        trustworthy: boolean; // Is Hash Locked?
    };

    createdAt: string;
    updatedAt: string;
}

/**
 * 👤 Personal Digital Twin
 * The "Hero" of the journey.
 */
export interface IPersonalTwin extends IDigitalTwin {
    type: 'PERSONAL';
    userId: string;
    avatarProfile: UserAvatarProfile;
    careerPath: {
        currentRole: string;
        targetRole: string;
        skills: string[];
    };
    badges: string[]; // IDs of earned badges
    balance: {
        xp: number;
        gwc: number; // Good Wil Coin
    };
}

/**
 * 🏢 Corporate Digital Twin
 * The "Entity" of impact.
 */
export interface ICorporateTwin extends IDigitalTwin {
    type: 'CORPORATE';
    companyId: string;
    taxId: string;
    industry: string;

    // ESG Performance Snapshot
    esgStatus: {
        rating: string; // e.g., "AA", "Gold"
        environmentScore: number;
        socialScore: number;
        governanceScore: number;
        lastAudited: string;
    };

    supplyChainNodes: string[]; // IDs of connected supplier twins
    sustainabilityReports: string[]; // UUIDs of 5T Reports
}
