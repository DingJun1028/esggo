
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing GEMINI_API_KEY:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');

    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

    for (const modelName of models) {
        try {
            console.log(`\nTesting model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hello, are you active? Answer in 1 word.');
            console.log(`Result (${modelName}):`, result.response.text());
        } catch (error: any) {
            console.error(`Error (${modelName}):`, error.message);
            if (error.response) {
                console.error(`Status code:`, error.status);
            }
        }
    }
}

testGemini();
