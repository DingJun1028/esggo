import { 
    chatWithESGAssistant, 
    generateCoWriteVariants, 
    saveReportAction, 
    suggestESGTasks 
} from '../app/actions';
import { ai } from '../lib/genkit';

// Mock Firebase and DataConnect
jest.mock('@/lib/firebase', () => ({
    auth: {},
    db: {},
    storage: {},
    functions: {},
    dataconnect: {
        settings: {},
    },
}));

// Mock Genkit
jest.mock('@/lib/genkit', () => ({
    ai: {
        generate: jest.fn(),
    },
}));

// Mock Data Connect generated functions
jest.mock('@dataconnect/generated', () => ({
    listAuditRecords: jest.fn().mockResolvedValue({ data: { auditRecords: [] } }),
    createAuditRecord: jest.fn(),
    updateAuditRecord: jest.fn(),
    deleteAuditRecord: jest.fn(),
    upsertReportSection: jest.fn(),
}));

describe('ESG Alpha Actions - Conservative Strategy Refinement', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('chatWithESGAssistant', () => {
        it('should return cleaned text on successful AI generation', async () => {
            (ai.generate as jest.Mock).mockResolvedValue({
                text: '```markdown\nHello World\n```'
            });

            const result = await chatWithESGAssistant([{ role: 'user', content: 'hi' }]);
            
            expect(result.success).toBe(true);
            expect(result.text).toBe('Hello World');
        });

        it('should handle AI errors gracefully', async () => {
            (ai.generate as jest.Mock).mockRejectedValue(new Error('AI fail'));

            const result = await chatWithESGAssistant([{ role: 'user', content: 'hi' }]);
            
            expect(result.success).toBe(false);
            expect(result.text).toContain('伺服器連線建立失敗');
        });
    });

    describe('generateCoWriteVariants', () => {
        it('should parse JSON variants correctly', async () => {
            (ai.generate as jest.Mock).mockResolvedValue({
                text: '```json\n["Variant 1", "Variant 2", "Variant 3"]\n```'
            });

            const result = await generateCoWriteVariants('text', 'prompt', 'title');
            
            expect(result.success).toBe(true);
            expect(result.variants).toHaveLength(3);
            expect(result.variants[0]).toBe('Variant 1');
            expect(result.integrityCheck!.protocol).toBe('V8.1 SEAL');
        });

        it('should return empty array on invalid JSON', async () => {
            (ai.generate as jest.Mock).mockResolvedValue({
                text: 'invalid json'
            });

            const result = await generateCoWriteVariants('text', 'prompt', 'title');
            
            expect(result.success).toBe(true);
            expect(result.variants).toHaveLength(3);
            expect(result.variants[0]).toContain('AI 正在分析');
        });
    });

    describe('saveReportAction', () => {
        it('should return V8.1 SEAL certification', async () => {
            const result = await saveReportAction('rep-123', { 'sec-1': 'content' });
            
            expect(result.success).toBe(true);
            expect(result.seal).toBe('V8.1 SEAL CERTIFIED');
            expect(result.trustScore).toBe(0.99);
            expect(result.integrityMark).toContain('ADK-V8.1-HASH-');
        });
    });

    describe('suggestESGTasks', () => {
        it('should parse tasks correctly', async () => {
             (ai.generate as jest.Mock).mockResolvedValue({
                text: '[{"title": "Task 1", "description": "Desc 1"}]'
            });

            const result = await suggestESGTasks([], 'zh');
            
            expect(result.success).toBe(true);
            expect(result.suggestions).toHaveLength(1);
            expect(result.suggestions[0].title).toBe('Task 1');
        });
    });
});
