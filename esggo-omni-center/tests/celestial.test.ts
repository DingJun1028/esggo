import { describe, it, expect } from 'vitest';
import { CelestialController, ZKPIntegrityModule } from '../src/lib/celestial/implementation';

describe('CelestialController (無作妙德)', () => {
  it('should successfully sense, seal, and stream data', async () => {
    const controller = new CelestialController();
    const mockInput = { project_id: 'p_123', amount: 100, cost: 50 };
    
    const result = await controller.executeCelestialFlow(mockInput);
    
    // 驗證 ZKP 封印狀態 (不可篡改性)
    expect(result).toBeDefined();
    expect(result!.uuid).toBeDefined();
    expect((result as any).sealTimestamp).toBeDefined();
    expect(Object.isFrozen(result)).toBe(true);
    
    // 驗證原數值未被篡改
    expect(result!.amount).toBe(100);
    expect(result!.cost).toBe(50);
  });

  it('should successfully handle ESG chart data and OCR knowledge points (E2E)', async () => {
    const controller = new CelestialController();
    const esgChartData = {
      project_id: 'p_esg_01',
      chartType: 'Bar',
      data: [{ label: 'Scope 1', value: 25 }, { label: 'Scope 2', value: 105 }]
    };
    
    const ocrData = {
      id: 'doc_123',
      knowledgePoints: [
        { label: 'WHY', text: 'Reduce carbon footprint' },
        { label: 'WHAT', text: 'Implemented recycling' }
      ]
    };
    
    const chartResult = await controller.executeCelestialFlow(esgChartData);
    const ocrResult = await controller.executeCelestialFlow(ocrData);
    
    expect(chartResult!.uuid).toBeDefined();
    expect((chartResult as any).sealTimestamp).toBeDefined();
    expect(Object.isFrozen(chartResult)).toBe(true);
    
    expect(ocrResult!.uuid).toBeDefined();
    expect((ocrResult as any).sealTimestamp).toBeDefined();
    expect(Object.isFrozen(ocrResult)).toBe(true);
  });

  it('should trigger self-healing fallback when high entropy invalid data is provided', async () => {
    const controller = new CelestialController();
    
    // Provide high entropy data (missing project_id, amount is a string)
    const highEntropyData = {
      amount: "invalid_string", // should be number
      cost: "also_invalid"
    };
    
    const result = await controller.executeCelestialFlow(highEntropyData);
    
    // It should purify and cast to numbers (NaN or 0 in this case, based on our logic, it casts to 0 if NaN)
    expect(result!.uuid).toBeDefined();
    expect((result as any).sealTimestamp).toBeDefined();
    expect(result!.amount).toBe(0);
    expect(result!.cost).toBe(0);
    expect(Object.isFrozen(result)).toBe(true);
  });
});

describe('ZKPIntegrityModule', () => {
  it('should freeze sealed data', () => {
    const zkpModule = new ZKPIntegrityModule();
    const data = { type: 'vote', user_id: 'u_01' };
    
    const sealedData = zkpModule.governance.seal(data) as Record<string, unknown>;
    expect(Object.isFrozen(sealedData)).toBe(true);
    expect(sealedData.sealTimestamp).toBeDefined();
  });
  
  it('should trigger calibration when entropy is high', () => {
    const zkpModule = new ZKPIntegrityModule();
    zkpModule.governance.purify(0.9); // high entropy
    
    // It should log a purify event
    expect(zkpModule.evidence.processTrace.some(e => e.includes('[PURIFY]'))).toBe(true);
  });
});
