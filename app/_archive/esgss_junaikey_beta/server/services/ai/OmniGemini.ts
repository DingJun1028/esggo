
import { GoogleGenerativeAI } from '@google/generative-ai';
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';

export class OmniGemini {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            omniLogger.warn(LogCategory.AI, '[OmniGemini] GOOGLE_API_KEY not found. AI features will be disabled.');
            // Initialize with a dummy key to prevent immediate crash, but methods will fail gracefully
            this.genAI = new GoogleGenerativeAI('DUMMY_KEY');
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }

        // Default to Gemini 2.0 Flash (or Pro as fallback)
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    }

    public async generateText(prompt: string): Promise<string> {
        if (!process.env.GOOGLE_API_KEY) {
            return "AI capabilities are currently unavailable. Please configure GOOGLE_API_KEY.";
        }

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            omniLogger.error(LogCategory.AI, '[OmniGemini] Generation failed', { error: error.message });

            // Basic Retry Logic could be added here
            return "I apologize, but I am unable to process your request at this moment.";
        }
    }
}
