/**
 * 🌐 Tenant Context: The Multi-tenant Identity Anchor
 * Defines the "Archon" structure for organizational sovereignty.
 */

export interface IArchon {
    id: string;              // Unique Archon Identifier
    name: string;            // Organization Name
    slug: string;            // URL-friendly identifier
    tier: 'Core' | 'Elite' | 'Transcended';
    resonance: number;       // Global resonance of this tenant
    status: 'Active' | 'Vigilant' | 'Suspended';
    settings: {
        themeColor: string;
        customMantra?: string;
    };
}

export const PRIME_ARCHON: IArchon = {
    id: 'archon-000',
    name: 'DingJun (Prime Archon)',
    slug: 'prime',
    tier: 'Transcended',
    resonance: 1.0,
    status: 'Active',
    settings: {
        themeColor: '#63a6b0',
        customMantra: '自覺覺他，妙果共證。'
    }
};

export const GUEST_ARCHON: IArchon = {
    id: 'archon-guest',
    name: 'Guest Organization',
    slug: 'guest',
    tier: 'Core',
    resonance: 0.1,
    status: 'Active',
    settings: {
        themeColor: '#94a3b8',
        customMantra: 'Service is Learning.'
    }
};

/**
 * Resolves the active Archon from storage or environment.
 */
export const resolveCurrentArchon = (): IArchon => {
    if (typeof window === 'undefined') return PRIME_ARCHON;
    const stored = localStorage.getItem('omni_active_archon');
    return stored ? JSON.parse(stored) : PRIME_ARCHON;
};
