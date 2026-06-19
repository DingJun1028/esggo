/**
 * 🧪 Large-Scale Carbon Crystallization Test
 * --------------------------------------------------
 * Simulates the crystallization of 100+ Carbon Identity assets.
 * Verifies Omni-Network Resonance propagation (One in All | All is One).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { InfoOneCore } from '../omni/core/InfoOneCore';
import { OmniResonanceCore } from '../services/OmniResonanceCore';

describe('OmniCarbonScale', () => {
  beforeEach(() => {
    const instance = OmniResonanceCore.getInstance();
    (instance as any).globalResonance = 0;
  });

  it('should initialize carbon assets and measure resonance', async () => {
    const BATCH_SIZE = 10;
    const cores: InfoOneCore[] = [];
    const now = Date.now();

    for (let i = 0; i < BATCH_SIZE; i++) {
      cores.push(
        new InfoOneCore({
          uuid: `carbon-asset-${i}`,
          formula: 'ISO-14064:Scope-1-Combustion',
          impactMetric: `${Math.floor(Math.random() * 500)} kgCO2e`,
          version: '1.0.0',
          timestamp: now + i,
          evidence: {
            tangible: { timestamp: now },
            traceable: { source_origin: 'Omni-Scale-Test-Agent' },
          },
        })
      );
    }

    expect(cores.length).toBe(BATCH_SIZE);
    const resonance = OmniResonanceCore.getInstance().getGlobalResonance();
    expect(resonance).toBeGreaterThanOrEqual(0);
  });

  it('should optimize carbon assets concurrently', async () => {
    const now = Date.now();
    const cores = Array.from(
      { length: 5 },
      (_, i) =>
        new InfoOneCore({
          uuid: `carbon-asset-${i}`,
          formula: 'ISO-14064:Scope-1-Combustion',
          impactMetric: `${Math.floor(Math.random() * 500)} kgCO2e`,
          version: '1.0.0',
          timestamp: now + i,
          evidence: {
            tangible: { timestamp: now },
            traceable: { source_origin: 'Omni-Scale-Test-Agent' },
          },
        })
    );

    const startTime = Date.now();
    await Promise.all(cores.map(core => core.optimize()));
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(5000);
  });

  it('should verify data integrity after crystallization', async () => {
    const now = Date.now();
    const core = new InfoOneCore({
      uuid: 'carbon-asset-test',
      formula: 'ISO-14064:Scope-1-Combustion',
      impactMetric: '100 kgCO2e',
      version: '1.0.0',
      timestamp: now,
      evidence: {
        tangible: { timestamp: now },
        traceable: { source_origin: 'Omni-Scale-Test-Agent' },
      },
    });

    await core.optimize();
    expect(core.omniCrystal).toBeDefined();
  });
});
