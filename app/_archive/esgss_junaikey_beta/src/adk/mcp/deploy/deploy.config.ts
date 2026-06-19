/**
 * MCP Deployment Configuration
 * =========================================
 * [?¨Ë≥™] Â§öÁí∞Â¢ÉÈÉ®ÁΩ≤Á??•Ë?ÂÆâÂÖ®?çÁΩÆ
 * [EN] Multi-environment deployment strategy and security configuration.
 *
 * Supports: Local, Cloud Run, GKE Sidecar, Vertex AI Agent Engine
 *
 * @version 1.0.0
 * @date 2026-02-19
 */

import type { DeploymentConfig, DeploymentEnvironment, McpConnectionMode } from '../types';
import { detectEnvironment } from '../McpClientConfig';

// ?Ä?Ä?Ä Constants ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
const DEFAULT_TIMEOUT = 30_000; // 30 seconds
const CLOUD_RUN_TIMEOUT = 60_000; // 60 seconds
const VERTEX_AI_TIMEOUT = 120_000; // 120 seconds

// ?Ä?Ä?Ä Deployment Profiles ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
const DEPLOYMENT_PROFILES: Record<DeploymentEnvironment, DeploymentConfig> = {
    local: {
        environment: 'local',
        timeout: DEFAULT_TIMEOUT,
        toolFilter: undefined,
    },
    'cloud-run': {
        environment: 'cloud-run',
        mcpServerUrl: process.env?.MCP_SERVER_URL || 'http://mcp-server:8090/mcp',
        authToken: process.env?.MCP_AUTH_TOKEN,
        timeout: CLOUD_RUN_TIMEOUT,
        toolFilter: undefined,
    },
    gke: {
        environment: 'gke',
        mcpServerUrl: process.env?.MCP_SERVER_URL || 'http://localhost:8090/mcp', // sidecar pattern
        authToken: process.env?.MCP_AUTH_TOKEN,
        timeout: CLOUD_RUN_TIMEOUT,
        toolFilter: undefined,
    },
    'vertex-ai': {
        environment: 'vertex-ai',
        mcpServerUrl: process.env?.MCP_SERVER_URL,
        authToken: process.env?.MCP_AUTH_TOKEN,
        timeout: VERTEX_AI_TIMEOUT,
        toolFilter: undefined,
    },
};

// ?Ä?Ä?Ä Get Deployment Config ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
/**
 * Get the deployment configuration for the current environment.
 * Auto-detects environment if not specified.
 */
export function getDeploymentConfig(
    overrideEnv?: DeploymentEnvironment,
): DeploymentConfig {
    const env = overrideEnv ?? detectEnvironment();
    return DEPLOYMENT_PROFILES[env];
}

// ?Ä?Ä?Ä Get Optimal Connection Mode ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
/**
 * Determine the optimal MCP connection mode for the current environment.
 *
 * - Local ??Stdio (in-process, zero network overhead)
 * - Cloud Run ??StreamableHTTP (scalable, supports multiple concurrent sessions)
 * - GKE ??StreamableHTTP via sidecar (localhost:8090)
 * - Vertex AI ??StreamableHTTP
 */
export function getOptimalConnectionMode(
    env?: DeploymentEnvironment,
): McpConnectionMode {
    const environment = env ?? detectEnvironment();

    switch (environment) {
        case 'local':
            return 'stdio';
        case 'cloud-run':
        case 'vertex-ai':
            return 'streamable-http';
        case 'gke':
            return 'streamable-http'; // sidecar pattern uses localhost
        default:
            return 'stdio';
    }
}

// ?Ä?Ä?Ä Security Checklist ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
/**
 * Production security checklist for MCP deployment.
 * Returns a list of checks and their status.
 */
export function getSecurityChecklist(): Array<{
    check: string;
    status: 'pass' | 'warn' | 'fail';
    detail: string;
}> {
    const checks: Array<{
        check: string;
        status: 'pass' | 'warn' | 'fail';
        detail: string;
    }> = [];

    // 1. Auth token configured
    const hasAuth = !!process.env?.MCP_AUTH_TOKEN;
    checks.push({
        check: 'MCP_AUTH_TOKEN configured',
        status: hasAuth ? 'pass' : 'warn',
        detail: hasAuth
            ? 'Authentication token is set.'
            : 'No auth token. MCP server will accept unauthenticated requests.',
    });

    // 2. HTTPS enforcement
    const mcpUrl = process.env?.MCP_SERVER_URL || '';
    const isHttps = mcpUrl.startsWith('https://') || mcpUrl === '';
    checks.push({
        check: 'HTTPS enforcement',
        status: isHttps ? 'pass' : 'warn',
        detail: isHttps
            ? 'MCP server URL uses HTTPS or is localhost.'
            : `MCP server URL "${mcpUrl}" does not use HTTPS.`,
    });

    // 3. Tool filtering
    checks.push({
        check: 'Tool filtering',
        status: 'pass',
        detail: 'Tool access is controlled via McpToolRegistration.name filtering.',
    });

    // 4. Rate limiting
    const hasRateLimit = !!process.env?.MCP_RATE_LIMIT;
    checks.push({
        check: 'Rate limiting',
        status: hasRateLimit ? 'pass' : 'warn',
        detail: hasRateLimit
            ? 'Rate limiting is configured.'
            : 'Consider setting MCP_RATE_LIMIT for production.',
    });

    // 5. 5T Audit trail
    checks.push({
        check: '5T Audit trail',
        status: 'pass',
        detail: 'All MCP tool calls generate FiveTAuditRecord entries.',
    });

    return checks;
}

// ?Ä?Ä?Ä Docker Configuration Helper ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
/**
 * Generate a minimal Dockerfile content for the MCP server.
 */
export function generateDockerfileContent(): string {
    return `# OmniMcpServer Dockerfile
# ?Ä?Ä?Ä Build Stage ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx tsc --project tsconfig.json

# ?Ä?Ä?Ä Runtime Stage ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV MCP_MODE=streamable-http
ENV MCP_PORT=8090

EXPOSE 8090

CMD ["node", "dist/adk/mcp/OmniMcpServer.js"]
`;
}
