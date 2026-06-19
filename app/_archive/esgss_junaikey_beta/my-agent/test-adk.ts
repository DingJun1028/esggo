import { Gemini } from '@google/adk';

console.log('--- ADK Basic Test ---');
try {
    const model = new Gemini({ model: 'gemini-2.0-flash' });
    console.log('Model initialized:', model.name);
} catch (e) {
    console.error('Failed to initialize model:', e);
}
