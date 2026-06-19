import { getAuditRecords, createAuditRecordAction, searchEvidence } from '../app/actions';
import { listAuditRecords, createAuditRecord } from '../src/dataconnect-generated';

// Mock Data Connect Generated SDK
jest.mock('@/src/dataconnect-generated', () => ({
    listAuditRecords: jest.fn(),
    createAuditRecord: jest.fn(),
    updateAuditRecord: jest.fn(),
    deleteAuditRecord: jest.fn(),
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
    dataconnect: {},
}));

// Mock Genkit (required since actions.ts initializes it at top level)
jest.mock('genkit', () => {
    const { z } = require('zod');
    return {
        genkit: jest.fn(() => ({
            generate: jest.fn(),
            defineFlow: jest.fn(),
        })),
        z,
    };
});

// Mock @genkit-ai/google-genai
jest.mock('@genkit-ai/google-genai', () => ({
    googleAI: jest.fn(),
}));

describe('Data Connect Actions Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getAuditRecords returns records on success', async () => {
        const mockData = {
            auditRecords: [
                { id: '1', title: 'Test Record', source: 'Test Source', createdAt: '2024-01-01T00:00:00Z' }
            ]
        };
        (listAuditRecords as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getAuditRecords();

        expect(result.success).toBe(true);
        expect(result.records).toHaveLength(1);
        expect(result.records[0].title).toBe('Test Record');
    });

    test('createAuditRecordAction returns new record on success', async () => {
        const mockRecord = { id: 'new-id', title: 'New Record' };
        (createAuditRecord as jest.Mock).mockResolvedValue({ data: { auditRecord: mockRecord } });

        const result = await createAuditRecordAction({ title: 'New Record' });

        expect(result.success).toBe(true);
        expect(result.auditRecord!.id).toBe('new-id');
    });

    test('getAuditRecords handles errors', async () => {
        (listAuditRecords as jest.Mock).mockRejectedValue(new Error('DB Error'));

        const result = await getAuditRecords();

        expect(result.success).toBe(false);
        expect(result.records).toHaveLength(0);
    });
});
