#!/usr/bin/env tsx
/**
 * Test script for Omni Awakening MCP Server
 *
 * This script runs the MCP server, sends a series of test requests,
 * and validates the responses. It exits with code 0 on success and 1 on failure.
 *
 * Usage: npx tsx scripts/test-mcp.ts
 */

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { EOL } from 'os';

console.log('🧪 Starting MCP Server Integration Test...');

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

class MCPClient {
  private process: ChildProcessWithoutNullStreams;
  private responseCallbacks: Map<string | number, (response: any) => void> = new Map();
  private buffer = '';

  constructor(scriptPath: string) {
    this.process = spawn('npx', ['tsx', scriptPath], {
      shell: process.platform === 'win32', // Use shell on windows for npx
    });

    this.process.stdout.setEncoding('utf8').on('data', data => this.handleData(data));
    this.process.stderr.on('data', data =>
      console.error(`   [SERVER LOG] ${data.toString().trim()}`)
    );
  }

  private handleData(data: string) {
    this.buffer += data;
    const lines = this.buffer.split(EOL);
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.id && this.responseCallbacks.has(json.id)) {
          this.responseCallbacks.get(json.id)!(json);
          this.responseCallbacks.delete(json.id);
        } else if (json.method) {
          console.log(`   [SERVER NOTIFICATION] Received ${json.method}`);
        }
      } catch (e) {
        console.warn(`   [WARN] Received non-JSON line from server: ${line}`);
      }
    }
  }

  async send(method: string, params: any, id: string | number = Date.now()): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = { jsonrpc: '2.0', id, method, params };

      const timeout = setTimeout(() => {
        reject(new Error(`Request ${id} (${method}) timed out after 10 seconds.`));
      }, 10000);

      this.responseCallbacks.set(id, response => {
        clearTimeout(timeout);
        resolve(response);
      });

      this.process.stdin.write(JSON.stringify(request) + EOL);
    });
  }

  kill() {
    this.process.kill();
  }
}

async function runTests() {
  const client = new MCPClient('scripts/run-mcp.ts');

  // Wait for server to boot
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simple wait for boot log

  console.log('\n--- Running tests ---\n');

  // Test 1: Initialize
  const initResponse = await client.send('initialize', {}, 'init-1');
  assert(
    initResponse?.result?.serverInfo?.name === 'OmniAwakeningServer',
    'Server name should be OmniAwakeningServer'
  );

  // Test 2: List Tools
  const listResponse = await client.send('tools/list', {}, 'list-1');
  const toolNames = listResponse?.result?.tools?.map((t: any) => t.name) || [];
  assert(toolNames.length > 5, 'Should list more than 5 tools');
  assert(toolNames.includes('get_awakening_state'), 'Tool list should include get_awakening_state');

  // Test 3: Call a valid tool
  const stateResponse = await client.send(
    'tools/call',
    { name: 'get_awakening_state', arguments: {} },
    'state-1'
  );
  const stateResult = JSON.parse(stateResponse?.result?.content?.[0]?.text || '{}');
  assert(typeof stateResult.status === 'string', 'Awakening state should have a status');

  // Test 4: Call a tool with missing params
  const insightError = await client.send(
    'tools/call',
    { name: 'broadcast_insight', arguments: { message: 'invalid' } },
    'insight-error-1'
  );
  assert(insightError?.error?.code === -32000, 'broadcast_insight should fail without a title');
  assert(
    insightError?.error?.message.includes('Tool execution failed'),
    'Error message for missing params should be correct'
  );

  // Test 5: Call a non-existent tool
  const unknownToolError = await client.send(
    'tools/call',
    { name: 'this_tool_does_not_exist' },
    'unknown-tool-1'
  );
  assert(
    unknownToolError?.error?.code === -32601,
    'Should receive a Method not found error for unknown tools'
  );

  console.log('\n--- Tests finished ---\n');
  client.kill();

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
