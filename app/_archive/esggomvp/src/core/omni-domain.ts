/**
 * 🏰 OmniDomain: Sovereign Law & Boundary System
 * "My Domain, My Rules"
 */

import { IOmniAtom, IOmniDomain } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * Jurisdiction Level (Hierarchy of Unity)
 */
export enum DomainLevel {
    UNIVERSE = 'Universe',
    DOMAIN = 'Domain',
    GALAXY = 'Galaxy',
    STAR = 'Star',
    ATOM = 'Atom'
}

/**
 * Domain Gatekeeper: Enforcing Constitutional Law
 */
export class OmniDomainGuard {
    private static domains: Map<string, IOmniDomain> = new Map();

    static registerDomain(domain: IOmniDomain) {
        this.domains.set(domain.uuid, domain);
        omniLogger.info(LogCategory.DOMAIN, `Domain registered: ${domain.name} under Master ${domain.master}`);
    }

    static getDomain(uuid: string): IOmniDomain | undefined {
        return this.domains.get(uuid);
    }

    /**
     * Border Violation Check (My Domain, My Rules)
     */
    static validate(atom: IOmniAtom<any>, domainUuid: string): boolean {
        const domain = this.domains.get(domainUuid);
        if (!domain) {
            omniLogger.error(LogCategory.SECURITY, `Access Denied: Domain ${domainUuid} not found.`);
            return false;
        }

        // 1. Sovereignty Check (Border Violation)
        if (atom.domainRef !== domain.uuid) {
            omniLogger.warn(LogCategory.SECURITY, `Border Violation: Atom ${atom.uuid} belongs to ${atom.domainRef}, not ${domain.uuid}`);
            return false;
        }

        // 2. Constitution: 5T Enforcement
        if (domain.constitution.enforce5T && (!atom.evidence || Object.keys(atom.evidence).length === 0)) {
            omniLogger.warn(LogCategory.SECURITY, `Constitution Violation: Atom ${atom.uuid} lacks 5T evidence in domain ${domain.name}`);
            return false;
        }

        // 3. Constitution: Required Tags
        if (domain.constitution.requiredTags.length > 0) {
            const atomTags = (atom.tags || []).map(t => t.semantic);
            const hasAllTags = domain.constitution.requiredTags.every((rt: any) => atomTags.includes(rt));
            if (!hasAllTags) {
                omniLogger.warn(LogCategory.SECURITY, `Constitution Violation: Atom ${atom.uuid} missing required tags for ${domain.name}`);
                return false;
            }
        }

        return true;
    }

    /**
     * 🏰 Create a new Sovereign Domain
     */
    static createDomain(
        name: string,
        master: string,
        constitution: Partial<IOmniDomain['constitution']>,
        parentDomain?: string
    ): IOmniDomain {
        const uuid = `domain-${Math.random().toString(36).substr(2, 9)}`;
        const domain: IOmniDomain = {
            uuid,
            name,
            master,
            constitution: {
                requiredTags: [],
                encryptionLevel: 'Standard',
                allowAnonymous: false,
                enforce5T: true,
                ...constitution
            },
            citizens: [master],
            parentDomain
        };
        this.registerDomain(domain);
        return domain;
    }
}

export const odm = OmniDomainGuard;
