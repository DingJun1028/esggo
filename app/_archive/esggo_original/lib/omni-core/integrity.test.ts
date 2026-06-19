import { describe, it, expect } from 'vitest';
import { integrityModule } from './integrity';

describe('OmniCoreIntegrity Module - 5T State Machine Validation', () => {
  
  it('should successfully execute the Sacred Seal process (SacredCommand)', async () => {
    const rawData = {
      metric: 'GHG Emissions Scope 1',
      source: 'Energy Bills 2025',
      formula: 'ISO-14064-1:2018',
      hooks: ['initial_entry']
    };

    const crystal = await integrityModule.sacredSeal(rawData);

    // 1. Traceable (可溯源)
    expect(crystal.uuid).toBeDefined();
    expect(crystal.evidence[0].source_origin).toBe('/Energy Bills 2025');

    // 2. Transparent (可透明)
    expect(crystal.formula).toBe('ISO-14064-1:2018');

    // 3. Tangible (可感知)
    expect(crystal.impact_metric).toBe('GHG Emissions Scope 1');

    // 4. Trackable (可追蹤)
    expect(crystal.timestamp).toBeGreaterThan(0);
    expect(crystal.evidence[0].lifecycle_hooks).toContain('initial_entry');
    expect(crystal.evidence[0].lifecycle_hooks.some(h => h.startsWith('purified_at_'))).toBe(true);

    // 5. Trustworthy (不可篡改)
    expect(crystal.status).toBe('Trustworthy');
    expect(crystal.hash_lock).toBeDefined();
    
    // Verify object is frozen
    expect(Object.isFrozen(crystal)).toBe(true);
    
    // @ts-ignore
    expect(() => { crystal.impact_metric = 'Modified'; }).toThrow();
  });

  it('should pass verification for an untampered crystal', async () => {
    const rawData = { metric: 'Energy Use', source: 'Meter A' };
    const crystal = await integrityModule.sacredSeal(rawData);
    
    const isValid = await integrityModule.verify(crystal);
    expect(isValid).toBe(true);
  });

  it('should fail verification if the crystal is tampered with (Entropy Infection)', async () => {
    const rawData = { metric: 'Energy Use', source: 'Meter A' };
    const crystal = await integrityModule.sacredSeal(rawData);
    
    // Bypass TypeScript and Object.freeze for simulation (in a real scenario, this would be a database data change)
    const tamperedCrystal = {
      ...crystal,
      impact_metric: 'Tainted Data'
    };

    const isValid = await integrityModule.verify(tamperedCrystal);
    expect(isValid).toBe(false);
  });
});
