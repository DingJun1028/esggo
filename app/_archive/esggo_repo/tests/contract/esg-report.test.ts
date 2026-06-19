import { SharedESGReport } from '@esggo/types';
import { expect, test, describe } from 'vitest';

describe('SharedESGReport Contract', () => {
  test('should conform to SharedESGReport interface', () => {
    const mockServerResponse: SharedESGReport = {
      reportId: 'esg-rep-001',
      companyName: 'Example Corp',
      year: 2023,
      status: 'submitted',
      score: 85.5,
    };

    // This test primarily checks for type compatibility at compile time.
    // At runtime, we can perform additional checks if needed.
    // For a contract test, the main goal is to ensure the shape matches.
    const validateReport = (report: SharedESGReport) => {
      expect(typeof report.reportId).toBe('string');
      expect(typeof report.companyName).toBe('string');
      expect(typeof report.year).toBe('number');
      expect(['draft', 'submitted', 'verified']).toContain(report.status);
      expect(typeof report.score).toBe('number');
    };

    validateReport(mockServerResponse);
  });

  test('should reject invalid status', () => {
    const invalidReport: any = { // Use 'any' to bypass TS for testing invalid cases
      reportId: 'esg-rep-002',
      companyName: 'Another Corp',
      year: 2024,
      status: 'invalid-status', // This should be caught by the type system or runtime validation
      score: 70.0,
    };

    // If TypeScript is correctly configured, this line would ideally fail at compile time
    // without the 'any' cast, indicating a contract breach.
    // At runtime, we can explicitly check the value.
    expect(() => {
      const validateReport = (report: SharedESGReport) => {
        expect(['draft', 'submitted', 'verified']).toContain(report.status);
      };
      validateReport(invalidReport);
    }).toThrowError();
  });
});
