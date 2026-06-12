import { describe, it, expect } from 'vitest';
import { CarbonCalculator } from './carbon-calculator';

describe('CarbonCalculator', () => {
  it('should correctly calculate Scope 2 emissions for electricity', () => {
    const result = CarbonCalculator.calculate({
      factorId: 'electricity_tw_2023',
      activityAmount: 1000,
      sourceOrigin: 'Test Bill'
    });

    expect(result.impact_metric).toBe('495.0000 kgCO2e');
    expect(result.formula).toContain('1000 kWh * 0.495');
    expect(result.status).toBe('Trustworthy');
    expect(result.evidence[0].source_origin).toBe('Test Bill');
  });

  it('should correctly calculate Scope 1 emissions for diesel', () => {
    const result = CarbonCalculator.calculate({
      factorId: 'diesel_stationary',
      activityAmount: 50,
      sourceOrigin: 'Fuel Receipt'
    });

    // 50 * 2.602 = 130.1
    expect(result.impact_metric).toBe('130.1000 kgCO2e');
    expect(result.evidence[0].processTrace).toContain('Identified Factor: Diesel Fuel (Stationary Combustion) (Scope 1)');
  });

  it('should throw error for unknown factor', () => {
    expect(() => {
      CarbonCalculator.calculate({
        factorId: 'invalid_id',
        activityAmount: 1,
        sourceOrigin: 'Nowhere'
      });
    }).toThrow('Emission factor not found: invalid_id');
  });
});
