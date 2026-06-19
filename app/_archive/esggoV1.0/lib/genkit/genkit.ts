import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const ai = genkit({
    plugins: [
        googleAI({ apiKey: apiKey || false }),
    ],
    model: "googleai/gemini-1.5-flash", // Using stable 1.5-flash for maximum reliability
});
