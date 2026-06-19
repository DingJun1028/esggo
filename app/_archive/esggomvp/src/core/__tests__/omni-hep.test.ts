import { describe, it, expect, vi } from 'vitest';
import { OmniOne } from '../omni-one';
import { IOmniSeed } from '../omni-types';

describe('HEP: Hypercube Evolution Protocol Verification', () => {
    it('should manifest an Atom with 16D Hypercube metadata', async () => {
        const seed: IOmniSeed<any> = {
            intent: 'HEP Protocol Verification Test',
            type: 'Intelligence',
            payload: { test: true },
            domainRef: 'TEST-DOMAIN',
            tags: ['test', 'hypercube', 'evolution']
        };

        const atom = await OmniOne.manifest(seed);

        // Verify Basic Meta
        expect(atom.uuid).toBeDefined();

        // Verify Space-Time Phase (w dimension)
        expect(atom.spaceTime?.w).toBeGreaterThanOrEqual(0);
        expect(atom.spaceTime?.w).toBeLessThanOrEqual(1);
        expect(atom.spaceTime?.proof.method).toBe('Hyper-Phase-Sync');

        // Verify Hypercube Dimensions (13-16)
        expect(atom.hypercube).toBeDefined();
        expect(atom.hypercube?.entropy).toBeGreaterThan(0);
        expect(atom.hypercube?.harmony).toBeLessThan(1);
        expect(atom.hypercube?.singularity).toHaveLength(8);
        expect(atom.hypercube?.infinityLink).toBe(true); // Intelligence seeds should have infinityLink
        expect(atom.hypercube?.tesseractHash).toHaveLength(64); // SHA-256
    });

    it('should increase entropy based on tag complexity', async () => {
        const seed1: IOmniSeed<any> = {
            intent: 'Simple Seed',
            type: 'Note',
            payload: {},
            domainRef: 'TEST',
            tags: ['A']
        };

        const seed2: IOmniSeed<any> = {
            intent: 'Complex Seed',
            type: 'Note',
            payload: {},
            domainRef: 'TEST',
            tags: ['A', 'B', 'C', 'D', 'E']
        };

        const atom1 = await OmniOne.manifest(seed1);
        const atom2 = await OmniOne.manifest(seed2);

        expect(atom2.hypercube!.entropy).toBeGreaterThan(atom1.hypercube!.entropy);
    });
});
