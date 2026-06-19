import { generateCoWriteVariants } from '../app/actions';
import { ai } from '../lib/genkit';

// Mock Genkit
jest.mock('@/lib/genkit', () => ({
    ai: {
        generate: jest.fn(),
    },
}));

describe('AI Actions Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateCoWriteVariants handles valid input and returns 3 variants', async () => {
        (ai.generate as jest.Mock).mockResolvedValue({
            text: '["Variant 1", "Variant 2", "Variant 3"]',
        });

        const result = await generateCoWriteVariants('selected text', 'prompt', 'title');

        expect(result.success).toBe(true);
        expect(result.variants).toHaveLength(3);
        expect(result.variants[0]).toBe('Variant 1');
        expect(ai.generate).toHaveBeenCalled();
    });

    test('generateCoWriteVariants handles empty AI response gracefully with fallbacks', async () => {
        (ai.generate as jest.Mock).mockResolvedValue({
            text: '',
        });

        const result = await generateCoWriteVariants('selected text', 'prompt', 'title');

        expect(result.success).toBe(true);
        expect(result.variants).toHaveLength(3);
        expect(result.variants[0]).toContain('AI 正在分析');
    });

    test('generateCoWriteVariants handles errors gracefully', async () => {
        (ai.generate as jest.Mock).mockRejectedValue(new Error('AI Failure'));

        const result = await generateCoWriteVariants('selected text', 'prompt', 'title');

        expect(result.success).toBe(false);
        expect(result.variants).toHaveLength(0);
    });
});
