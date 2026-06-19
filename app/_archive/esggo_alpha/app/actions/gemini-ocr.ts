"use server";

import { GoogleGenAI } from "@google/genai";
import crypto from 'crypto';
import { adminDb, FieldValue } from '@/lib/firebase-admin';
import { ENV } from '@/lib/config/env';

export async function extractOcrWithGemini(base64Data: string, mimeType: string) {
    try {
        const apiKey = ENV.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'AIzaDummyKeyForBuild') {
            throw new Error("GEMINI_API_KEY is not set on the server.");
        }

        const dataHash = crypto.createHash('sha256').update(base64Data).digest('hex');

        // 1. Check Firestore Cache
        const cacheDocRef = adminDb.collection('ocr_cache').doc(dataHash);
        const cacheDoc = await cacheDocRef.get();
        if (cacheDoc.exists) {
            console.log("CACHE HIT: OCR for hash", dataHash);
            return { success: true, data: cacheDoc.data()?.parsedData };
        }

        // 2. Not cached - process via Gemini
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: ENV.LITE_MODEL,
            contents: [
                {
                    text: 'Analyze this PDF/image and extract all text, tables, and charts. Return strictly valid JSON in this format: { "text": "full extracted text", "tables": [{"title": "Table Title", "data": [["Col1","Col2"],["Val1","Val2"]]}], "charts": ["Chart description 1"] }',
                },
                {
                    inlineData: {
                        mimeType,
                        data: base64Data,
                    },
                },
            ],
            config: { responseMimeType: "application/json" },
        });

        if (!response.text) {
            throw new Error("AI returned no content.");
        }

        // Try parsing to ensure it's valid JSON before sending to client
        const parsedData = JSON.parse(response.text);

        // 3. Store into cache
        await cacheDocRef.set({
            parsedData,
            mimeType,
            createdAt: FieldValue.serverTimestamp()
        });

        return { success: true, data: parsedData };
    } catch (error: any) {
        console.error("[ServerAction: extractOcrWithGemini] Error:", error);
        return { success: false, error: error.message || "Failed to extract text using AI." };
    }
}
