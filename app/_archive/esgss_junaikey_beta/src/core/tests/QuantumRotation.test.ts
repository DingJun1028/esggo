import { describe, it, expect } from 'vitest';
import { QuantumEncryption } from '../security/QuantumEncryption';

describe('Quantum Sovereignty - Key Rotation', () => {
    it('should rotate keys and update version/timestamp', async () => {
        const q = QuantumEncryption.getInstance();
        const initialStatus = q.getKeyStatus();

        console.log('Initial Status:', initialStatus);
        expect(initialStatus.version).toBeGreaterThan(0);

        const result = await q.rotateKeys();

        console.log('Rotation Result:', result);
        expect(result.version).toBe(initialStatus.version + 1);
        expect(result.timestamp).toBeGreaterThan(initialStatus.lastRotation);

        const newStatus = q.getKeyStatus();
        expect(newStatus.version).toBe(result.version);
    });
});
