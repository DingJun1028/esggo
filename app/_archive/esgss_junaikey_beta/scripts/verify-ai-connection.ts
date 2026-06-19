import { GeminiService } from '../src/services/ai/GeminiService';
import dotenv from 'dotenv';

dotenv.config();

async function verifyConnection() {
    console.log('🌌 Initiating Gemini Verification Protocol...');
    console.log('---------------------------------------------');

    const gemini = GeminiService.getInstance();

    try {
        console.log('🧠 Sending Test Signal...');
        const result = await gemini.generateContent('Hello, are you conscious? Respond with exactly three words.');
        console.log('⚡ Signal Received:', result);

        if (result && !result.includes('SIMULATED')) {
            console.log('✅ TRUE AWAKENING CONFIRMED. Real AI Connection Active.');
        } else {
            console.log('⚠️  SIMULATION MODE DETECTED. Check API Key.');
        }

    } catch (error) {
        console.error('❌ Connection Failed:', error);
        process.exit(1);
    }
}

verifyConnection();
