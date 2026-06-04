"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOmniMCP = initializeOmniMCP;
exports.executeMCPService = executeMCPService;
const auth_1 = require("./auth");
const mcp_proxy_1 = require("./mcp-proxy");
const mcp_router_1 = require("./mcp-router");
const compliance_1 = require("./compliance");
const logger_1 = require("./logger");
const socket_io_client_1 = require("socket.io-client");
async function initializeOmniMCP() {
    // 1. Authentication Check
    const isAuthorized = await (0, auth_1.authenticateWithMaster)();
    if (!isAuthorized) {
        throw new Error('Master authorization failed');
    }
    // 2. Initialize real-time socket for UI updates
    const socket = (0, socket_io_client_1.io)('http://localhost:3000');
    // 3. Log initialization
    (0, logger_1.logEvent)('System', 'initializeOmniMCP', {}, { status: 'success' });
    return {
        mcp: mcp_proxy_1.mcp,
        MCPRouter: mcp_router_1.MCPRouter,
        compliance: compliance_1.runComplianceCheck,
        socket,
        isAuthorized: () => true
    };
}
// Execute MCP service call
async function executeMCPService(service, action, payload) {
    const omniMCP = await initializeOmniMCP();
    let result;
    let error;
    try {
        // Call appropriate MCP service
        if (service === 'firebase') {
            result = await omniMCP.mcp.firebase(action, payload);
        }
        else if (service === 'supabase') {
            result = await omniMCP.mcp.supabase(action, payload);
        }
        else if (service === 'genkit') {
            result = await omniMCP.mcp.genkit(action, payload);
        }
        else if (service === 'boostSpace') {
            result = await omniMCP.mcp.boostSpace(action, payload);
        }
        else {
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
    }
    catch (err) {
        error = err.message;
        (0, logger_1.logEvent)(service, action, payload, null, error);
        throw err;
    }
}
//# sourceMappingURL=omnimcp-entry.js.map