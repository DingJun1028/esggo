import express, { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { OmniError, ErrorCode, ValidationError } from '../utils/omniError.js';

const router = express.Router();

// Initialize GenAI on server
// Note: process.env.GEMINI_API_KEY must be set in backend .env
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    omniLogger.warn(LogCategory.SYSTEM, 'AI Proxy: GEMINI_API_KEY not found in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * POST /api/ai-proxy/generate
 * Simple text generation proxy
 * [5T: Transparent] Delegated to Google Generative AI
 */
router.post('/generate', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt, model: modelName } = req.body;

    if (!prompt) {
        throw new ValidationError('Prompt is required');
    }

    const model = genAI.getGenerativeModel({ model: modelName || DEFAULT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, text });
}));

/**
 * POST /api/ai-proxy/structure
 * Structured Data Generation Proxy (Mock-compliant signature)
 * [5T: Traceable] Logs generation context
 */
router.post('/structure', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { context, schemaDescription } = req.body;

    if (!context || !schemaDescription) {
        throw new ValidationError('Context and Schema Description are required');
    }

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });

    const prompt = `
Context: ${context}

Task: Generate a valid JSON object matching the following description.
Schema: ${schemaDescription}

Constraint: Output ONLY the JSON object. No markdown formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown if present
    const jsonString = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    try {
        const parsedData = JSON.parse(jsonString);
        res.json({ success: true, data: parsedData });
    } catch (e) {
        // Fallback or error if JSON is invalid
        omniLogger.warn(LogCategory.AI, 'Proxy Structure Parse Failed', { text });
        throw new OmniError('Failed to generate valid JSON structure', 500, ErrorCode.AI_ERROR);
    }
}));

/**
 * POST /api/ai-proxy/chat
 * Stateless Chat Proxy (Client holds history)
 */
router.post('/chat', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { message, history, systemInstruction, generationConfig } = req.body;

    if (!message) {
        throw new ValidationError('Message is required');
    }

    // Use the requested model or default
    const model = genAI.getGenerativeModel({
        model: DEFAULT_MODEL,
        systemInstruction: systemInstruction
    });

    // Convert history from simple object to SDK format if needed
    const sdkHistory = (history || []).map((h: any) => ({
        role: h.role,
        parts: [{ text: h.parts }]
    }));

    const chat = model.startChat({
        history: sdkHistory,
        generationConfig: generationConfig || {
            maxOutputTokens: 1000,
        }
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, text });
}));

export default router;
