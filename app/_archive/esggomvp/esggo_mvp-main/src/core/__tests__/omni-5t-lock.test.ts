import { describe, it, expect, vi } from 'vitest';
import { ESGDataLock } from '../omni-5t-lock';
import { ESGRecord } from '../omni-types';

describe('ESGDataLock Core Mechanisms', () => {

    const lockService = new ESGDataLock();

    const mockRecord: ESGRecord = {
        id: 'record-001',
        type: 'carbon',
        data: { emissions: 1250, unit: 'tCO2e' },
        source: 'IoT-Sensor-Alpha',
        timestamp: '2026-03-01T12:00:00Z'
    };

    it('should generate consistent hashes for identical data', async () => {
        const hash1 = await lockService.generateHash(mockRecord);
        const hash2 = await lockService.generateHash(mockRecord);
        expect(hash1).toBe(hash2);
        expect(hash1.length).toBe(64); // SHA-256 is 64 hex chars
    });

    it('should produce different hashes for different data', async () => {
        const hash1 = await lockService.generateHash(mockRecord);

        const modifiedRecord = { ...mockRecord, data: { emissions: 1251, unit: 'tCO2e' } };
        const hash2 = await lockService.generateHash(modifiedRecord);

        expect(hash1).not.toBe(hash2);
    });

    it('should lock a record with a provable hash and chain', async () => {
        const lockedRecord = await lockService.lockRecord(mockRecord);

        expect(lockedRecord.id).toMatch(/^vault_/);
        expect(lockedRecord.locked).toBe(true);
        expect(lockedRecord.hash).toBeTruthy();
        expect(lockedRecord.verificationUrl).toContain(lockedRecord.id);
        expect(lockedRecord.originalData).toEqual(mockRecord);
    });

    it('should verify an authentic record successfully', async () => {
        const lockedRecord = await lockService.lockRecord(mockRecord);

        // Pass storedHash to bypass getFromVault mock
        const isValid = await lockService.verifyRecord(lockedRecord.id, mockRecord, lockedRecord.hash);
        expect(isValid).toBe(true);
    });

    it('should reject a tampered record', async () => {
        const lockedRecord = await lockService.lockRecord(mockRecord);

        const tamperedRecord = { ...mockRecord, data: { emissions: 9999, unit: 'tCO2e' } };
        const isValid = await lockService.verifyRecord(lockedRecord.id, tamperedRecord, lockedRecord.hash);

        expect(isValid).toBe(false);
    });
});
