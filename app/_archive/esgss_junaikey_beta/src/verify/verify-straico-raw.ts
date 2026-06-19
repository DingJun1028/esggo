import axios from 'axios';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import * as dotenv from 'dotenv';
dotenv.config();

async function verifyRaw() {
  const apiKey = process.env.STRAICO_API_KEY;
  // Use the v1 URL directly as per findings
  const baseUrl = (process.env.STRAICO_BASE_URL || 'https://api.straico.com/v0/').replace(
    'v0',
    'v1'
  );
  const url = `${baseUrl}/prompt/completion`;

  console.log(`Testing Raw Axios Call to: ${url}`);
  console.log(`Model: openai/gpt-3.5-turbo`);

  try {
    const response = await axios.post(
      url,
      {
        models: ['gpt-3.5-turbo'],
        message: 'Status Check', // Changed from prompt to message based on error "Missing message"
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'JunAiKey-Verifier/1.0',
        },
      }
    );
    console.log('✅ Success:', response.data);
  } catch (error: any) {
    omniLogger.error(LogCategory.SYSTEM, '[verify-straico-raw] ❌ Failed!');
    if (error.response) {
      omniLogger.error(LogCategory.SYSTEM, '[verify-straico-raw] Status:', error.response.status);
      omniLogger.error(LogCategory.SYSTEM, '[verify-straico-raw] Data:', { data: JSON.stringify(error.response.data, null, 2) });
    } else {
      omniLogger.error(LogCategory.SYSTEM, '[verify-straico-raw] Error:', error.message);
    }
  }
}

verifyRaw();
