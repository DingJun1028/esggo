/**
 * @vitest-environment node
 */
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Writable, Readable } from 'stream';

// Helper to interact with the process
class MCPClient {
  private process: ChildProcessWithoutNullStreams;
  private responses: any[] = [];
  private responseCallbacks: Map<string | number, (response: any) => void> = new Map();
  private acker: (value: unknown) => void = () => {};

  constructor(scriptPath: string) {
    // We use 'npx' and 'tsx' to run the script, similar to the package.json scripts
    this.process = spawn('npx', ['tsx', scriptPath], {
      shell: true, // Use shell to support npx on Windows
    });

    this.process.stdout.setEncoding('utf8');
    this.process.stdout.on('data', data => {
      const lines = data
        .toString()
        .split('\n')
        .filter(line => line.trim() !== '');
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          this.responses.push(json);
          if (json.id && this.responseCallbacks.has(json.id)) {
            this.responseCallbacks.get(json.id)!(json);
            this.responseCallbacks.delete(json.id);
          }
        } catch (e) {
          // console.error("Failed to parse JSON from MCP server:", line);
        }
      }
    });

    this.process.stderr.on('data', data => {
      // console.error(`MCP Server STDERR: ${data}`);
      if (data.includes('Booting Omni Awakening MCP Server...')) {
        this.acker('booted');
      }
    });
  }

  asyncwaitForBoot() {
    return new Promise(resolve => {
      this.acker = resolve;
    });
  }

  async send(method: string, params: any, id: string | number = Date.now()): Promise<any> {
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    const promise = new Promise(resolve => {
      this.responseCallbacks.set(id, resolve);
    });

    this.process.stdin.write(JSON.stringify(request) + '\n');

    return promise;
  }

  kill() {
    this.process.kill();
  }
}

describe('MCP Server Integration Test', () => {
  let client: MCPClient;

  beforeAll(async () => {
    client = new MCPClient('scripts/run-mcp.ts');
    await client.asyncwaitForBoot();
  }, 15000); // Increase timeout for spawning process

  afterAll(() => {
    client.kill();
  });

  it('should initialize and list tools', async () => {
    const initResponse = await client.send('initialize', {}, 'init-1');
    expect(initResponse.result.serverInfo.name).toBe('OmniAwakeningServer');

    const listResponse = await client.send('tools/list', {}, 'list-1');
    expect(listResponse.result.tools).toBeInstanceOf(Array);
    expect(listResponse.result.tools.length).toBeGreaterThan(0);
    const toolNames = listResponse.result.tools.map((t: any) => t.name);
    expect(toolNames).toContain('get_awakening_state');
  });

  it('should call a simple tool like get_awakening_state', async () => {
    const response = await client.send(
      'tools/call',
      { name: 'get_awakening_state', arguments: {} },
      'awakening-state-1'
    );

    expect(response.id).toBe('awakening-state-1');
    expect(response.result).toBeDefined();
    const resultText = response.result.content[0].text;
    const resultObj = JSON.parse(resultText);

    // This makes a lot of assumptions about the underlying state,
    // but we can at least check the structure.
    expect(resultObj).toHaveProperty('status');
    expect(resultObj).toHaveProperty('level');
    expect(resultObj).toHaveProperty('details');
  }, 10000);

  it('should return an error for a non-existent tool', async () => {
    const response = await client.send(
      'tools/call',
      { name: 'foo_bar_baz', arguments: {} },
      'error-1'
    );

    expect(response.id).toBe('error-1');
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32601);
    expect(response.error.message).toContain('Tool not found: foo_bar_baz');
  });

  it('should return an error for a tool call with missing required parameters', async () => {
    const response = await client.send(
      'tools/call',
      { name: 'broadcast_insight', arguments: { message: 'only message' } },
      'error-2'
    );

    expect(response.id).toBe('error-2');
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32000);
    // The exact error message might vary, but it should indicate a failure.
    expect(response.error.message).toContain('Tool execution failed');
  });
});
