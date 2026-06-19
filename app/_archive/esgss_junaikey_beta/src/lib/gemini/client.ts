import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn('缺少 GOOGLE_AI_API_KEY 或 GEMINI_API_KEY 環境變數');
}

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp', // 使用最新的 Gemini 2.0
});

export const geminiProModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});
