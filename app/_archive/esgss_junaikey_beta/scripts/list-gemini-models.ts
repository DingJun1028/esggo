import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ No API Key found in .env');
    process.exit(1);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    console.log('🔍 Querying Gemini API for available models...');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        if (data.models) {
            console.log('\n✨ Available Models:');
            console.log('-------------------');
            data.models.forEach((model: any) => {
                console.log(`- ${model.name.replace('models/', '')}`);
                console.log(`  Description: ${model.description}`);
                console.log(`  Capabilities: ${JSON.stringify(model.supportedGenerationMethods)}`);
                console.log('-------------------');
            });

            // Filter for 'generateContent' capable models and sort by version if possible
            const chatModels = data.models.filter((m: any) =>
                m.supportedGenerationMethods.includes('generateContent')
            );

            console.log(`\n🏆 Recommended Chat Models (Count: ${chatModels.length}):`);
            chatModels.forEach((m: any) => console.log(`👉 ${m.name.replace('models/', '')}`));

        } else {
            console.log('⚠️ No models found in response.');
        }

    } catch (error) {
        console.error('❌ Failed to fetch models:', error);
    }
}

listModels();
