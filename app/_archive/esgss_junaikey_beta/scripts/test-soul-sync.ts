/**
 * Test Script for Omni-Avatar Soul Sync Tools
 *
 * Verifies:
 * 1. grant_agent_experience
 * 2. assign_agent_persona
 */

// Port matches the background server instance
const PORT = 3003;
const SERVER_URL = `http://localhost:${PORT}`;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callTool(method: string, args: any) {
  try {
    const response = await fetch(`${SERVER_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: method,
          arguments: args,
        },
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(`❌ Call to ${method} failed:`, error);
    return null;
  }
}

async function runTest() {
  console.log(`🚀 Connecting to Omni Awakening Server on port ${PORT}...`);

  // Server is assumed running in background

  console.log('\n🧪 Testing grant_agent_experience...');
  // Use agent_1 (Genesis Agent)
  const xpResult = await callTool('grant_agent_experience', { agentId: 'agent_1', amount: 500 });
  console.log('XP Result:', JSON.stringify(xpResult, null, 2));

  console.log('\n🧪 Testing assign_agent_persona...');
  const personaResult = await callTool('assign_agent_persona', {
    agentId: 'agent_1',
    persona: 'warrior',
  });
  console.log('Persona Result:', JSON.stringify(personaResult, null, 2));

  // Invalid Persona Test
  console.log('\n🧪 Testing Invalid Persona...');
  const invalidResult = await callTool('assign_agent_persona', {
    agentId: 'agent_1',
    persona: 'potato_peeler',
  });
  console.log('Invalid Result (Expected Error):', JSON.stringify(invalidResult, null, 2));

  process.exit(0);
}

runTest().catch(console.error);
