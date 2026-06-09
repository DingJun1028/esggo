import { authenticateWithMaster } from './auth.ts';
import { mcp } from './mcp-proxy.ts';
import { MCPRouter } from './mcp-router.ts';
import { runComplianceCheck } from './compliance.ts';
import { logEvent } from './logger.ts';
import { io } from 'socket.io-client';

export async function initializeOmniMCP() {
  // 1. Authentication Check
  const isAuthorized = await authenticateWithMaster();
  if (!isAuthorized) {
    throw new Error('Master authorization failed');
  }

  // 2. Initialize real-time socket for UI updates
  const socket = io('http://localhost:3000');

  // 3. Log initialization
  logEvent('System', 'initializeOmniMCP', {}, { status: 'success' });

  return {
    mcp,
    MCPRouter,
    compliance: runComplianceCheck,
    socket,
    isAuthorized: () => true
  };
}

// Execute MCP service call
export async function executeMCPService(service: string, action: string, payload: Record<string, unknown>) {
  const omniMCP = await initializeOmniMCP();
  let result: unknown;
  let error: string | undefined;

  try {
    // Call appropriate MCP service
    if (service === 'firebase') {
      result = await omniMCP.mcp.firebase(action, payload);
    } else if (service === 'supabase') {
      result = await omniMCP.mcp.supabase(action, payload);
    } else if (service === 'genkit') {
      result = await omniMCP.mcp.genkit(action, payload);
    } else if (service === 'boostSpace') {
      result = await omniMCP.mcp.boostSpace(action, payload);
    } else {
      result = await omniMCP.MCPRouter.call(service, action, payload);
    }

    // Run compliance check
    const compliance = omniMCP.compliance(payload);  
    
    // Broadcast to UI
    omniMCP.socket.emit('service-executed', {
      service,
      action,
      result,
      compliance,
      timestamp: new Date().toISOString()
    });

    return { result, compliance };

  } catch (err: unknown) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = String(err);
    }
    logEvent(service, action, payload, null, error);
    throw err;
  }
}