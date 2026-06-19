import axios from 'axios';

async function testGemma4() {
  const host = 'http://localhost:9379';
  const models = [
    'gemma-4-E4B-it.litertlm',
    'gemma-4-E4B-it',
    'gemma3-1b-gpu-custom',
    'models/gemma-4-E4B-it.litertlm',
    'models/gemma-4-E4B-it'
  ];
  
  for (const model of models) {
    const url = `${host}/v1beta/models/${model}:generateContent`;
    console.log(`Testing ${url}...`);
    try {
      const response = await axios.post(url, {
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
      });
      console.log(`✅ Success for ${model}!`);
      return;
    } catch (e: any) {
      console.log(`❌ Failed for ${model}: ${e.response?.status} - ${e.response?.data?.error?.message || e.message}`);
    }
  }
}

testGemma4();