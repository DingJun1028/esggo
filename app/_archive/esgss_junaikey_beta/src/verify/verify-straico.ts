import * as dotenv from 'dotenv';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { StraicoClient } from '../services/ai/straico';

// Load environment variables
dotenv.config();

async function verifyStraico() {
  console.log('🔍 Starting Straico Verification...');

  const apiKey = process.env.STRAICO_API_KEY;
  const baseUrl = process.env.STRAICO_BASE_URL;

  if (!apiKey) {
    omniLogger.error(LogCategory.SYSTEM, '[verify-straico] ❌ Error: STRAICO_API_KEY is missing in .env');
    process.exit(1);
  }

  console.log(`ℹ️  Configuration: BaseURL=${baseUrl || 'Default'}, KeyLength=${apiKey.length}`);

  const client = new StraicoClient({
    apiKey,
    baseUrl, // Let's trust the baseUrl logic in client or env
    defaultModel: 'google/gemini-pro',
  });

  try {
    console.log('⏳ Sending test prompt to Straico (Model: google/gemini-pro)...');
    const response = await client.generateText('System Check', 'google/gemini-pro');

    console.log('\n✅ Verification Successful!');
    console.log('🤖 AI Response:', response);
  } catch (error: any) {
    omniLogger.error(LogCategory.SYSTEM, '[verify-straico] \n❌ Verification Failed! Writing details to verify-straico-error.json');

    const errorLog = {
      message: error.message,
      // Check if it's our APIError wrapper
      details: error.details,
      // Check if it's raw Axios error (fallback)
      responseStatus: error.response?.status,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data ? JSON.parse(error.config.data) : undefined,
        headers: error.config?.headers,
      },
    };

    const fs = await import('fs/promises');
    await fs.writeFile('verify-straico-error.json', JSON.stringify(errorLog, null, 2));
  }
}

verifyStraico();
