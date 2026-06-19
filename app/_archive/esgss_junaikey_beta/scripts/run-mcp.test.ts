// scripts/run-mcp.test.ts
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const runMcpScript = path.resolve(__dirname, 'run-mcp.ts');
const envPath = path.resolve(__dirname, '../.env');

describe('scripts/run-mcp.ts', () => {
  const originalEnv = { ...process.env };
  const mockEnvContent = `
# This is a comment
GEMINI_API_KEY=test_key_from_file
MCP_TRANSPORT=http
MCP_PORT=9999
`;

  beforeEach(() => {
    // Reset process.env
    process.env = { ...originalEnv };
    // Mock the .env file
    fs.writeFileSync(envPath, mockEnvContent);

    // Mock the server import to prevent it from actually starting
    vi.mock('../src/omni/mcp/OmniAwakeningServer.ts', () => {
      console.error('[MCP] Mock Server Initialized');
      return {
        OmniAwakeningServer: vi.fn(),
      };
    });
  });

  afterEach(() => {
    // Restore process.env
    process.env = originalEnv;
    // Clean up mock .env
    if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
    }
    // Clear all mocks
    vi.restoreAllMocks();
  });

  it('should load environment variables from .env file', done => {
    const command = `npx tsx ${runMcpScript}`;

    exec(command, (error, stdout, stderr) => {
      expect(error).toBeNull();
      // Check if the script's output indicates it tried to start the server
      expect(stderr).toContain('[MCP] 🚀 Starting OmniAwakeningServer...');
      // We can't directly check process.env of the child process,
      // but we can check the server start messages which use these vars.
      expect(stderr).toContain('Transport: http');
      expect(stderr).toContain('Port: 9999');
      done();
    });
  });

  it('should parse --transport and --port arguments and override .env', done => {
    const command = `npx tsx ${runMcpScript} --transport stdio --port 1234`;

    exec(command, (error, stdout, stderr) => {
      expect(error).toBeNull();
      expect(stderr).toContain('[MCP] 🚀 Starting OmniAwakeningServer...');
      expect(stderr).toContain('Transport: stdio');
      expect(stderr).not.toContain('Port:'); // Stdio transport doesn't log a port
      done();
    });
  });

  it('should handle script execution failure gracefully', done => {
    // Force an error by making the server import fail
    vi.mock('../src/omni/mcp/OmniAwakeningServer.ts', () => {
      throw new Error('Test Import Error');
    });

    const command = `npx tsx ${runMcpScript}`;

    exec(command, (error, stdout, stderr) => {
      expect(error).not.toBeNull();
      expect(stderr).toContain('[MCP] ❌ Critical Startup Error:');
      expect(stderr).toContain('Test Import Error');
      done();
    });
  });
});
