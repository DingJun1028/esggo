#!/usr/bin/env tsx
/**
 * Test script for Omni Awakening MCP Server (HTTP Transport)
 *
 * This script starts the MCP server in HTTP mode, sends a series of test requests,
 * and validates the responses. It exits with code 0 on success and 1 on failure.
 *
 * Usage: npx tsx scripts/test-mcp-http.ts
 */

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { EOL } from 'os';

console.log('🧪 Starting MCP Server HTTP Integration Test...');

const PORT = 3005;
const SERVER_URL = `http://localhost:${PORT}`;

let assertionCount = 0;
let failedAssertions = 0;

function assert(condition: boolean, message: string) {
  assertionCount++;
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    failedAssertions++;
  } else {
    console.log(`✅ Assertion passed: ${message}`);
  }
}

async function sendRequest(
  method: string,
  params: any,
  id: string | number = Date.now()
): Promise<any> {
  try {
    const response = await fetch(`${SERVER_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Request ${id} (${method}) failed:`, error);
    return { error: { message: (error as Error).message } };
  }
}

async function runTests() {
  console.log(`\n🚀 Spawning MCP Server on port ${PORT}...`);

  const serverProcess = spawn(
    'npx',
    ['tsx', 'scripts/run-mcp.ts', '--transport', 'http', '--port', String(PORT)],
    {
      shell: process.platform === 'win32',
    }
  );

  serverProcess.stderr.on('data', data =>
    console.error(`   [SERVER LOG] ${data.toString().trim()}`)
  );

  // Wait for the server to be ready. A better way would be to ping a health endpoint.
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('\n--- Running tests ---\n');

  // Test 1: List Tools
  const listResponse = await sendRequest('tools/list', {}, 'list-http-1');
  const toolNames = listResponse?.result?.tools?.map((t: any) => t.name) || [];
  assert(toolNames.length > 5, 'Should list more than 5 tools');
  assert(toolNames.includes('get_esg_components'), 'Tool list should include get_esg_components');

  // Test 2: Call get_esg_components
  const esgCompResponse = await sendRequest(
    'tools/call',
    { name: 'get_esg_components', arguments: {} },
    'esg-comp-1'
  );
  const esgResult = JSON.parse(esgCompResponse?.result?.content?.[0]?.text || '{}');
  assert(esgResult?.summary?.system_health === 'OPTIMAL', 'ESG system health should be OPTIMAL');
  assert(Array.isArray(esgResult?.components?.souls), 'ESG components should include souls');

  // Test 3: Call a tool that requires params and check for failure
  const xpError = await sendRequest(
    'tools/call',
    { name: 'grant_agent_experience', arguments: { amount: 100 } },
    'xp-error-1'
  );
  assert(xpError?.error?.code === -32000, 'grant_agent_experience should fail without agentId');
  assert(
    xpError?.error?.message.includes('Missing agentId'),
    'Error message for missing agentId should be correct'
  );

  // Test 4: Check SSE connection (briefly)
  console.log('\n📡 Testing SSE connection...');
  const sseController = new AbortController();
  let sseConnected = false;
  const ssePromise = fetch(`${SERVER_URL}/sse`, { signal: sseController.signal })
    .then(response => {
      sseConnected = response.ok;
      assert(sseConnected, 'SSE endpoint should be connectable');
      // Gracefully close connection after checking
      sseController.abort();
    })
    .catch(() => {
      sseConnected = false;
      assert(sseConnected, 'SSE connection should not fail');
    });

  await ssePromise;

  console.log('\n--- Tests finished ---\n');
  serverProcess.kill();

  console.log(`Total assertions: ${assertionCount}`);
  if (failedAssertions > 0) {
    console.error(`🔴 Test run failed with ${failedAssertions} assertion(s).`);
    process.exit(1);
  } else {
    console.log('✅ All tests passed.');
    process.exit(0);
  }
}

runTests().catch(error => {
  console.error('\n🚨 An unexpected error occurred during the test run:', error);
  process.exit(1);
});
