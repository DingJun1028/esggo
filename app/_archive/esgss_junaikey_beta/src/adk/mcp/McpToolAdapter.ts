/**
 * MCP Tool Adapter
 * =========================================
 * [?¬è³ª] ADK FunctionTool ??MCP Tool ä¹‹é??„é??‘æ???
 * [EN] Bidirectional bridge between ADK FunctionTool and MCP Tool schemas.
 *
 * @version 1.0.0
 * @date 2026-02-19
 */

import type { McpToolResult, McpToolRegistration, FiveTAuditRecord } from './types';

// ?€?€?€ ADK Tool-like Interface ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
// Matches the shape of @google/adk FunctionTool without importing it directly
// (allows this module to work in both browser and server contexts)
interface AdkToolLike {
    name: string;
    description: string;
    // Zod schema or JSON schema for parameters
    parameters?: {
        _def?: { typeName?: string };
        shape?: Record<string, unknown>;
    };
    execute?: (args: Record<string, unknown>) => Promise<unknown>;
}

// ?€?€?€ ADK to MCP Schema Conversion ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
/**
 * Convert an ADK FunctionTool's parameter schema to MCP-compatible JSON Schema.
 * Handles Zod schemas by extracting the underlying shape.
 */
export function adkToMcpInputSchema(adkTool: AdkToolLike): Record<string, unknown> {
    // If the tool has no parameters, return empty schema
    if (!adkTool.parameters) {
        return {
            type: 'object',
            properties: {},
            required: [],
        };
    }

    // If it's a Zod schema, try to extract shape metadata
    const shape = adkTool.parameters.shape;
    if (shape) {
        const properties: Record<string, unknown> = {};
        const required: string[] = [];

        for (const [key, value] of Object.entries(shape)) {
            const zodField = value as {
                _def?: {
                    typeName?: string;
                    description?: string;
                    innerType?: { _def?: { typeName?: string } };
                };
                isOptional?: () => boolean;
                description?: string;
            };

            // Map Zod types to JSON Schema types
            const typeName = zodField._def?.typeName || zodField._def?.innerType?._def?.typeName;
            let jsonType = 'string'; // default

            switch (typeName) {
                case 'ZodNumber':
                    jsonType = 'number';
                    break;
                case 'ZodBoolean':
                    jsonType = 'boolean';
                    break;
                case 'ZodArray':
                    jsonType = 'array';
                    break;
                case 'ZodObject':
                    jsonType = 'object';
                    break;
                default:
                    jsonType = 'string';
            }

            properties[key] = {
                type: jsonType,
                description: zodField._def?.description || zodField.description || key,
            };

            // Check if field is required (not optional)
            const isOptional =
                zodField._def?.typeName === 'ZodOptional' ||
                (typeof zodField.isOptional === 'function' && zodField.isOptional());

            if (!isOptional) {
                required.push(key);
            }
        }

        return { type: 'object', properties, required };
    }

    // Fallback: return generic schema
    return {
        type: 'object',
        properties: {},
        required: [],
    };
}

// ?€?€?€ Create MCP Tool Registration from ADK Tool ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
/**
 * Convert an ADK-like tool into an McpToolRegistration with
 * automatic 5T audit trail generation.
 */
export function createMcpRegistration(
    adkTool: AdkToolLike,
    options?: { enable5TAudit?: boolean },
): McpToolRegistration {
    const enable5T = options?.enable5TAudit ?? true;

    return {
        name: adkTool.name,
        description: adkTool.description,
        inputSchema: adkToMcpInputSchema(adkTool),
        handler: async (args: Record<string, unknown>): Promise<McpToolResult> => {
            const startTime = Date.now();

            try {
                if (!adkTool.execute) {
                    throw new Error(`Tool "${adkTool.name}" does not have an execute method.`);
                }

                const result = await adkTool.execute(args);

                const auditTrail: FiveTAuditRecord | undefined = enable5T
                    ? {
                        tangible: true,
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true,
                        timestamp: startTime,
                        toolName: adkTool.name,
                        sourceOrigin: 'mcp-server/adk-bridge',
                    }
                    : undefined;

                return {
                    status: 'success',
                    data: result,
                    auditTrail,
                };
            } catch (error) {
                return {
                    status: 'error',
                    data: {
                        error: error instanceof Error ? error.message : String(error),
                        toolName: adkTool.name,
                    },
                };
            }
        },
    };
}

// ?€?€?€ Batch Registration ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
/**
 * Register multiple ADK tools at once.
 */
export function batchCreateMcpRegistrations(
    adkTools: AdkToolLike[],
    options?: { enable5TAudit?: boolean },
): McpToolRegistration[] {
    return adkTools.map((tool) => createMcpRegistration(tool, options));
}
