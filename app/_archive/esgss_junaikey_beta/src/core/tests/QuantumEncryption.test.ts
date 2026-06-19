import { describe, it, expect, beforeEach } from 'vitest';
import { QuantumEncryption, PQCAlgorithm } from '../security/QuantumEncryption';

describe('Quantum Sovereignty Prototype', () => {
    let pqc: QuantumEncryption;

    beforeEach(() => {
        pqc = QuantumEncryption.getInstance();
    });

    it('should be a singleton', () => {
        const instance2 = QuantumEncryption.getInstance();
        expect(pqc).toBe(instance2);
    });

    it('should generate a mocked quantum key pair', async () => {
        const keyPair = await pqc.generateKeyPair(PQCAlgorithm.CRYSTALS_KYBER_512);
        expect(keyPair).toBeDefined();
        expect(keyPair.publicKey).toBeInstanceOf(Uint8Array);
        expect(keyPair.privateKey).toBeInstanceOf(Uint8Array);
    });

    it('should encrypt and decrypt data (Mock)', async () => {
        const message = "Secret ESG Data";
        const keyPair = await pqc.generateKeyPair();

        // Encrypt
        const encrypted = await pqc.encrypt(message, keyPair.publicKey);
        expect(encrypted.ciphertext).toBeInstanceOf(Uint8Array);
        expect(encrypted.algo).toBeDefined();

        // Decrypt
        const decrypted = await pqc.decrypt(encrypted, keyPair.privateKey);
        expect(decrypted).toBe(message);
    });

    it('should sign and verify data (Mock)', async () => {
        const message = "Immutable Ledger Entry";
        const keyPair = await pqc.generateKeyPair();

        const signature = await pqc.sign(message, keyPair.privateKey);
        expect(signature).toBeInstanceOf(Uint8Array);

        const isValid = await pqc.verify(message, signature, keyPair.publicKey);
        expect(isValid).toBe(true);
    });
});
